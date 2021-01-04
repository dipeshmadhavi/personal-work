// compute the minimum size of a Pool Group needed to hold all of the Lane Groups
function computeMinPoolSize(pool) {
  // assert(pool instanceof go.Group && pool.category === "Pool");
  var len = MINLENGTH;
  pool.memberParts.each(function(lane) {
    // pools ought to only contain lanes, not plain Nodes
    if (!(lane instanceof go.Group)) return;
    var holder = lane.placeholder;
    if (holder !== null) {
      var sz = holder.actualBounds;
      len = Math.max(len, sz.height);
    }
  });
  return new go.Size(NaN, len);
}

// compute the minimum size for a particular Lane Group
function computeLaneSize(lane) {
  // assert(lane instanceof go.Group && lane.category !== "Pool");
  var sz = computeMinLaneSize(lane);
  if (lane.isSubGraphExpanded) {
    var holder = lane.placeholder;
    if (holder !== null) {
      var hsz = holder.actualBounds;
      sz.width = Math.max(sz.width, hsz.width);
    }
  }
  // minimum breadth needs to be big enough to hold the header
  var hdr = lane.findObject('HEADER');
  if (hdr !== null) sz.width = Math.max(sz.width, hdr.actualBounds.width);
  return sz;
}

// determine the minimum size of a Lane Group, even if collapsed
function computeMinLaneSize(lane) {
  if (!lane.isSubGraphExpanded) return new go.Size(1, MINLENGTH);
  return new go.Size(MINBREADTH, MINLENGTH);
}

// this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
function relayoutDiagram() {
  myDiagram.layout.invalidateLayout();
  myDiagram.findTopLevelGroups().each(function(g) {
    if (g.category === 'VerticalPool') g.layout.invalidateLayout();
  });
  myDiagram.layoutDiagram();
}

// define a custom ResizingTool to limit how far one can shrink a lane Group
function LaneResizingTool() {
  go.ResizingTool.call(this);
}
go.Diagram.inherit(LaneResizingTool, go.ResizingTool);

LaneResizingTool.prototype.isLengthening = function() {
  return this.handle.alignment === go.Spot.Bottom;
};

LaneResizingTool.prototype.computeMinPoolSize = function() {
  var lane = this.adornedObject.part;
  // assert(lane instanceof go.Group && lane.category !== "Pool");
  var msz = computeMinLaneSize(lane); // get the absolute minimum size
  if (this.isLengthening()) {
    // compute the minimum length of all lanes
    var sz = computeMinPoolSize(lane.containingGroup);
    msz.height = Math.max(msz.height, sz.height);
  } else {
    // find the minimum size of this single lane
    var sz = computeLaneSize(lane);
    msz.width = Math.max(msz.width, sz.width);
    msz.height = Math.max(msz.height, sz.height);
  }
  return msz;
};

LaneResizingTool.prototype.resize = function(newr) {
  var lane = this.adornedObject.part;
  if (this.isLengthening()) {
    // changing the length of all of the lanes
    lane.containingGroup.memberParts.each(function(lane) {
      if (!(lane instanceof go.Group)) return;
      var shape = lane.resizeObject;
      if (shape !== null) {
        // set its desiredSize length, but leave each breadth alone
        shape.height = newr.height;
      }
    });
  } else {
    // changing the breadth of a single lane
    go.ResizingTool.prototype.resize.call(this, newr);
  }
  relayoutDiagram(); // now that the lane has changed size, layout the pool again
};
// end LaneResizingTool class

// define a custom grid layout that makes sure the length of each lane is the same
// and that each lane is broad enough to hold its subgraph
function VerticalPoolLayout() {
  go.GridLayout.call(this);
  this.cellSize = new go.Size(1, 1);
  this.wrappingColumn = Infinity;
  this.wrappingWidth = Infinity;
  this.isRealtime = false; // don't continuously layout while dragging
  this.alignment = go.GridLayout.Position;
  // This sorts based on the location of each Group.
  // This is useful when Groups can be moved up and down in order to change their order.
  this.comparer = function(a, b) {
    var ax = a.location.x;
    var bx = b.location.x;
    if (isNaN(ax) || isNaN(bx)) return 0;
    if (ax < bx) return -1;
    if (ax > bx) return 1;
    return 0;
  };
}
go.Diagram.inherit(VerticalPoolLayout, go.GridLayout);

VerticalPoolLayout.prototype.doLayout = function(coll) {
  var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction('VerticalPoolLayout');
  var pool = this.group;
  if (pool !== null && pool.category === 'VerticalPool') {
    // make sure all of the Group Shapes are big enough
    var minsize = computeMinPoolSize(pool);
    pool.memberParts.each(function(lane) {
      if (!(lane instanceof go.Group)) return;
      if (lane.category !== 'VerticalPool') {
        var shape = lane.resizeObject;
        if (shape !== null) {
          // change the desiredSize to be big enough in both directions
          var sz = computeLaneSize(lane);
          shape.width = !isNaN(shape.width)
            ? Math.max(shape.width, sz.width)
            : sz.width;
          shape.height = isNaN(shape.height)
            ? minsize.height
            : Math.max(shape.height, minsize.height);
          var cell = lane.resizeCellSize;
          if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0)
            shape.width = Math.ceil(shape.width / cell.width) * cell.width;
          if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0)
            shape.height = Math.ceil(shape.height / cell.height) * cell.height;
        }
      }
    });
  }
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction('VerticalPoolLayout');
};
// end VerticalPoolLayout class

// Horizontal PoolLayout class
function HorizontalPoolLayout() {
  go.GridLayout.call(this);
  this.cellSize = new go.Size(1, 1);
  this.wrappingColumn = 1;
  this.wrappingWidth = Infinity;
  this.isRealtime = false; // don't continuously layout while dragging
  this.alignment = go.GridLayout.Position;
  // This sorts based on the location of each Group.
  // This is useful when Groups can be moved up and down in order to change their order.
  this.comparer = function(a, b) {
    var ay = a.location.y;
    var by = b.location.y;
    if (isNaN(ay) || isNaN(by)) return 0;
    if (ay < by) return -1;
    if (ay > by) return 1;
    return 0;
  };
}
go.Diagram.inherit(HorizontalPoolLayout, go.GridLayout);

HorizontalPoolLayout.prototype.doLayout = function(coll) {
  var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction('HorizontalPoolLayout');
  var pool = this.group;
  if (pool !== null && pool.category === 'HorizontalPool') {
    // make sure all of the Group Shapes are big enough
    var minsize = computeMinPoolSize(pool);
    pool.memberParts.each(function(lane) {
      if (!(lane instanceof go.Group)) return;
      if (lane.category !== 'HorizontalPool') {
        var shape = lane.resizeObject;
        if (shape !== null) {
          // change the desiredSize to be big enough in both directions
          var sz = computeLaneSize(lane);
          shape.width = isNaN(shape.width)
            ? minsize.width
            : Math.max(shape.width, minsize.width);
          shape.height = !isNaN(shape.height)
            ? Math.max(shape.height, sz.height)
            : sz.height;
          var cell = lane.resizeCellSize;
          if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0)
            shape.width = Math.ceil(shape.width / cell.width) * cell.width;
          if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0)
            shape.height = Math.ceil(shape.height / cell.height) * cell.height;
        }
      }
    });
  }
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction('HorizontalPoolLayout');
};
// end HorizontalPoolLayout class
