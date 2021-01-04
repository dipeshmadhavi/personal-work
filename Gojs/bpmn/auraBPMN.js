const $ = go.GraphObject.make; // for more concise visual tree definitions

const GradientYellow = $(go.Brush, 'Linear', {
  0: 'LightGoldenRodYellow',
  1: '#FFFF66'
});
const GradientLightGreen = $(go.Brush, 'Linear', {
  0: '#E0FEE0',
  1: 'PaleGreen'
});
const GradientLightGray = $(go.Brush, 'Linear', { 0: 'White', 1: '#DADADA' });

const ActivityNodeFill = $(go.Brush, 'Linear', {
  0: 'OldLace',
  1: 'PapayaWhip'
});
const ActivityNodeStroke = '#CDAA7D';
const ActivityMarkerStrokeWidth = 1.5;
const ActivityNodeWidth = 120;
const ActivityNodeHeight = 80;
const ActivityNodeStrokeWidth = 1;
const ActivityNodeStrokeWidthIsCall = 4;

const SubprocessNodeFill = ActivityNodeFill;
const SubprocessNodeStroke = ActivityNodeStroke;

const EventNodeSize = 42;
const EventNodeInnerSize = EventNodeSize - 6;
const EventNodeSymbolSize = EventNodeInnerSize - 14;
const EventEndOuterFillColor = 'pink';
const EventBackgroundColor = GradientLightGreen;
const EventSymbolLightFill = 'white';
const EventSymbolDarkFill = 'dimgray';
const EventDimensionStrokeColor = 'green';
const EventDimensionStrokeEndColor = 'red';
const EventNodeStrokeWidthIsEnd = 4;

const GatewayNodeSize = 80;
const GatewayNodeSymbolSize = 45;
const GatewayNodeFill = GradientYellow;
const GatewayNodeStroke = 'darkgoldenrod';
const GatewayNodeSymbolStroke = 'darkgoldenrod';
const GatewayNodeSymbolFill = GradientYellow;
const GatewayNodeSymbolStrokeWidth = 3;

const DataFill = GradientLightGray;
const MINLENGTH = 400;
const MINBREADTH = 20; 

let myDiagram;
let myPalette;
let procName = component.get('v.processName');
let direction = true;
//debugger;

function BPMNRelinkingTool() {
  go.RelinkingTool.call(this);
  super();
  // orthogonal routing during linking
  this.temporaryLink.routing = go.Link.Orthogonal;
  // link validation using the validate methods defined below
  this.linkValidation = (fromnode, fromport, tonode, toport) => {
    return (
      BPMNLinkingTool.validateSequenceLinkConnection(
        fromnode,
        fromport,
        tonode,
        toport
      ) ||
      BPMNLinkingTool.validateMessageLinkConnection(
        fromnode,
        fromport,
        tonode,
        toport
      )
    );
  };
}
go.Diagram.inherit(BPMNRelinkingTool, go.RelinkingTool);

BPMNRelinkingTool.prototype.reconnectLink = function(
  existinglink,
  newnode,
  newport,
  toend
) {
  const diagram = existinglink.diagram;
  if (diagram === null) return false;
  const model = diagram.model;
  if (model === null) return false;

  function recreateLinkData(data, cat) {
    // Copy existing data, then set from, to, and category
    const copy = model.copyLinkData(data);
    copy.from = data.from;
    copy.to = data.to;
    copy.category = cat;
    copy.points = undefined; // don't keep points from existing link
    model.removeLinkData(data);
    model.addLinkData(copy);
  }

  if (super.reconnectLink(existinglink, newnode, newport, toend)) {
    const data = existinglink.data;
    const fromnode = existinglink.fromNode;
    const fromport = existinglink.fromPort;
    const tonode = existinglink.toNode;
    const toport = existinglink.toPort;
    if (
      fromnode !== null &&
      fromport !== null &&
      tonode !== null &&
      toport !== null
    ) {
      diagram.startTransaction('Relink updates');
      if (
        BPMNLinkingTool.validateMessageLinkConnection(
          fromnode,
          fromport,
          tonode,
          toport
        )
      ) {
        // Recreate the link if the category changed, since it is a different class
        if (existinglink.category !== 'msg') {
          recreateLinkData(data, 'msg');
        }
      }

      // maybe make the label visible
      if (fromnode.category === 'gateway') {
        const label = existinglink.findObject('Label');
        if (label !== null) label.visible = true;
      }
      diagram.commitTransaction('Relink updates');
    }
    return true;
  }
  return false;
};

function BPMNLinkingTool() {
  go.LinkingTool.call(this);
  super();
  // don't allow user to create link starting on the To node
  this.direction = go.LinkingTool.ForwardsOnly;
  // orthogonal routing during linking
  this.temporaryLink.routing = go.Link.Orthogonal;
  // link validation using the validate methods defined below
  this.linkValidation = (fromnode, fromport, tonode, toport) => {
    return (
      BPMNLinkingTool.validateSequenceLinkConnection(
        fromnode,
        fromport,
        tonode,
        toport
      ) ||
      BPMNLinkingTool.validateMessageLinkConnection(
        fromnode,
        fromport,
        tonode,
        toport
      )
    );
  };
}
go.Diagram.inherit(BPMNLinkingTool, go.LinkingTool);

BPMNLinkingTool.prototype.insertLink = function(
  fromnode,
  fromport,
  tonode,
  toport
) {
  let lsave = null;
  // maybe temporarily change the link data that is copied to create the new link
  if (
    BPMNLinkingTool.validateMessageLinkConnection(
      fromnode,
      fromport,
      tonode,
      toport
    )
  ) {
    lsave = this.archetypeLinkData;
    this.archetypeLinkData = { category: 'msg' };
  }

  // create the link in the standard manner by calling the base method
  const newlink = super.insertLink(fromnode, fromport, tonode, toport);

  // maybe make the label visible
  if (newlink !== null && fromnode.category === 'gateway') {
    const label = newlink.findObject('Label');
    if (label !== null) label.visible = true;
  }

  // maybe restore the original archetype link data
  if (lsave !== null) this.archetypeLinkData = lsave;
  return newlink;
};

BPMNLinkingTool.prototype.validateSequenceLinkConnection = function(
  fromnode,
  fromport,
  tonode,
  toport
) {
  if (fromnode.category === null || tonode.category === null) return true;

  // if either node is in a subprocess, both nodes must be in same subprocess (even for Message Flows)
  if (
    (fromnode.containingGroup !== null &&
      fromnode.containingGroup.category === 'subprocess') ||
    (tonode.containingGroup !== null &&
      tonode.containingGroup.category === 'subprocess')
  ) {
    if (fromnode.containingGroup !== tonode.containingGroup) return false;
  }

  if (fromnode.containingGroup === tonode.containingGroup) return true; // a valid Sequence Flow
  // also check for children in common pool
  const common = fromnode.findCommonContainingGroup(tonode);
  return common != null;
};

BPMNLinkingTool.prototype.validateMessageLinkConnection = function(
  fromnode,
  fromport,
  tonode,
  toport
) {
  if (fromnode.category === null || tonode.category === null) return true;

  if (
    fromnode.category === 'privateProcess' ||
    tonode.category === 'privateProcess'
  )
    return true;

  // if either node is in a subprocess, both nodes must be in same subprocess (even for Message Flows)
  if (
    (fromnode.containingGroup !== null &&
      fromnode.containingGroup.category === 'subprocess') ||
    (tonode.containingGroup !== null &&
      tonode.containingGroup.category === 'subprocess')
  ) {
    if (fromnode.containingGroup !== tonode.containingGroup) return false;
  }

  if (fromnode.containingGroup === tonode.containingGroup) return false; // an invalid Message Flow

  // also check if fromnode and tonode are in same pool
  const common = fromnode.findCommonContainingGroup(tonode);
  return common === null;
};

function PoolLink() {
  go.Link.call(this);
}
go.Diagram.inherit(PoolLink, go.Link);

PoolLink.prototype.getLinkPoint = function(
  node,
  port,
  spot,
  from,
  ortho,
  othernode,
  otherport
) {
  const r = new go.Rect(
    port.getDocumentPoint(go.Spot.TopLeft),
    port.getDocumentPoint(go.Spot.BottomRight)
  );
  const op = super.getLinkPoint(
    othernode,
    otherport,
    spot,
    from,
    ortho,
    node,
    port
  );

  const below = op.y > r.centerY;
  const y = below ? r.bottom : r.top;
  if (node.category === 'privateProcess') {
    if (op.x < r.left) return new go.Point(r.left, y);
    if (op.x > r.right) return new go.Point(r.right, y);
    return new go.Point(op.x, y);
  } else {
    // otherwise get the standard link point by calling the base class method
    return super.getLinkPoint(
      node,
      port,
      spot,
      from,
      ortho,
      othernode,
      otherport
    );
  }
};

PoolLink.prototype.computeOtherPoint = function(othernode, otherport) {
  const op = super.computeOtherPoint(othernode, otherport);
  let node = this.toNode;
  if (node === othernode) node = this.fromNode;
  if (node !== null) {
    if (othernode.category === 'privateProcess') {
      op.x = node.getDocumentPoint(go.Spot.MiddleBottom).x;
    } else {
      if (
        (node === this.fromNode) !==
        node.actualBounds.centerY < othernode.actualBounds.centerY
      ) {
        op.x -= 1;
      } else {
        op.x += 1;
      }
    }
  }
  return op;
};

PoolLink.prototype.getLinkDirection = function(
  node,
  port,
  linkpoint,
  spot,
  from,
  ortho,
  othernode,
  otherport
) {
  if (node.category === 'privateProcess') {
    const p = port.getDocumentPoint(go.Spot.Center);
    const op = otherport.getDocumentPoint(go.Spot.Center);
    const below = op.y > p.y;
    return below ? 90 : 270;
  } else {
    return super.getLinkDirection.call(
      this,
      node,
      port,
      linkpoint,
      spot,
      from,
      ortho,
      othernode,
      otherport
    );
  }
};

function DrawCommandHandler() {
  go.CommandHandler.call(this);
  _arrowKeyBehavior = 'move';
  _pasteOffsett = new go.Point(10, 10);
  _lastPasteOffset = new go.Point(0, 0);
}
go.Diagram.inherit(DrawCommandHandler, go.CommandHandler);

DrawCommandHandler.prototype.arrowKeyBehavior = function() {
  return this._arrowKeyBehavior;
};
DrawCommandHandler.prototype.arrowKeyBehavior = function(val) {
  if (
    val !== 'move' &&
    val !== 'select' &&
    val !== 'scroll' &&
    val !== 'none'
  ) {
    throw new Error(
      'DrawCommandHandler.arrowKeyBehavior must be either "move", "select", "scroll", or "none", not: ' +
        val
    );
  }
  this._arrowKeyBehavior = val;
};

DrawCommandHandler.prototype.pasteOffset = function() {
  return this._pasteOffset;
};
DrawCommandHandler.prototype.pasteOffset = function(val) {
  if (!(val instanceof go.Point))
    throw new Error(
      'DrawCommandHandler.pasteOffset must be a Point, not: ' + val
    );
  this._pasteOffset.set(val);
};

DrawCommandHandler.prototype.canAlignSelection = function() {
  const diagram = this.diagram;
  if (diagram.isReadOnly || diagram.isModelReadOnly) return false;
  if (diagram.selection.count < 2) return false;
  return true;
};

DrawCommandHandler.prototype.alignLeft = function() {
  const diagram = this.diagram;
  diagram.startTransaction('aligning left');
  let minPosition = Infinity;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    minPosition = Math.min(current.position.x, minPosition);
  });
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(minPosition, current.position.y));
  });
  diagram.commitTransaction('aligning left');
};

DrawCommandHandler.prototype.alignRight = function() {
  const diagram = this.diagram;
  diagram.startTransaction('aligning right');
  let maxPosition = -Infinity;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    const rightSideLoc = current.actualBounds.x + current.actualBounds.width;
    maxPosition = Math.max(rightSideLoc, maxPosition);
  });
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(
      new go.Point(maxPosition - current.actualBounds.width, current.position.y)
    );
  });
  diagram.commitTransaction('aligning right');
};

DrawCommandHandler.prototype.alignTop = function() {
  const diagram = this.diagram;
  diagram.startTransaction('alignTop');
  let minPosition = Infinity;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    minPosition = Math.min(current.position.y, minPosition);
  });
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(current.position.x, minPosition));
  });
  diagram.commitTransaction('alignTop');
};

DrawCommandHandler.prototype.alignBottom = function() {
  const diagram = this.diagram;
  diagram.startTransaction('aligning bottom');
  let maxPosition = -Infinity;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    const bottomSideLoc = current.actualBounds.y + current.actualBounds.height;
    maxPosition = Math.max(bottomSideLoc, maxPosition);
  });
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(
      new go.Point(
        current.actualBounds.x,
        maxPosition - current.actualBounds.height
      )
    );
  });
  diagram.commitTransaction('aligning bottom');
};

DrawCommandHandler.prototype.alignCenterX = function() {
  const diagram = this.diagram;
  const firstSelection = diagram.selection.first();
  if (!firstSelection) return;
  diagram.startTransaction('aligning Center X');
  const centerX =
    firstSelection.actualBounds.x + firstSelection.actualBounds.width / 2;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(
      new go.Point(
        centerX - current.actualBounds.width / 2,
        current.actualBounds.y
      )
    );
  });
  diagram.commitTransaction('aligning Center X');
};

DrawCommandHandler.prototype.alignCenterY = function() {
  const diagram = this.diagram;
  const firstSelection = diagram.selection.first();
  if (!firstSelection) return;
  diagram.startTransaction('aligning Center Y');
  const centerY =
    firstSelection.actualBounds.y + firstSelection.actualBounds.height / 2;
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(
      new go.Point(
        current.actualBounds.x,
        centerY - current.actualBounds.height / 2
      )
    );
  });
  diagram.commitTransaction('aligning Center Y');
};

DrawCommandHandler.prototype.alignColumn = function(distance) {
  const diagram = this.diagram;
  diagram.startTransaction('align Column');
  if (distance === undefined) distance = 0; // for aligning edge to edge
  distance = parseFloat(distance.toString());
  const selectedParts = new Array();
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    selectedParts.push(current);
  });
  for (let i = 0; i < selectedParts.length - 1; i++) {
    const current = selectedParts[i];
    // adds distance specified between parts
    const curBottomSideLoc =
      current.actualBounds.y + current.actualBounds.height + distance;
    const next = selectedParts[i + 1];
    next.move(new go.Point(current.actualBounds.x, curBottomSideLoc));
  }
  diagram.commitTransaction('align Column');
};

DrawCommandHandler.prototype.alignRow = function(distance) {
  if (distance === undefined) distance = 0; // for aligning edge to edge
  distance = parseFloat(distance.toString());
  const diagram = this.diagram;
  diagram.startTransaction('align Row');
  const selectedParts = new Array();
  diagram.selection.each(current => {
    if (current instanceof go.Link) return; // skips over go.Link
    selectedParts.push(current);
  });
  for (let i = 0; i < selectedParts.length - 1; i++) {
    const current = selectedParts[i];
    // adds distance specified between parts
    const curRightSideLoc =
      current.actualBounds.x + current.actualBounds.width + distance;
    const next = selectedParts[i + 1];
    next.move(new go.Point(curRightSideLoc, current.actualBounds.y));
  }
  diagram.commitTransaction('align Row');
};

DrawCommandHandler.prototype.canRotate = function() {
  const diagram = this.diagram;
  if (diagram.isReadOnly || diagram.isModelReadOnly) return false;
  if (diagram.selection.count < 1) return false;
  return true;
};

DrawCommandHandler.prototype.rotate = function(angle) {
  if (angle === undefined) angle = 90;
  const diagram = this.diagram;
  diagram.startTransaction('rotate ' + angle.toString());
  diagram.selection.each(current => {
    if (current instanceof go.Link || current instanceof go.Group) return; // skips over Links and Groups
    current.angle += angle;
  });
  diagram.commitTransaction('rotate ' + angle.toString());
};

DrawCommandHandler.prototype.doKeyDown = function() {
  const diagram = this.diagram;
  const e = diagram.lastInput;

  // determines the function of the arrow keys
  if (
    e.key === 'Up' ||
    e.key === 'Down' ||
    e.key === 'Left' ||
    e.key === 'Right'
  ) {
    const behavior = this.arrowKeyBehavior;
    if (behavior === 'none') {
      // no-op
      return;
    } else if (behavior === 'select') {
      this._arrowKeySelect();
      return;
    } else if (behavior === 'move') {
      this._arrowKeyMove();
      return;
    }
    // otherwise drop through to get the default scrolling behavior
  }

  // otherwise still does all standard commands
  super.doKeyDown();
};

DrawCommandHandler.prototype._getAllParts = function() {
  const allParts = new Array();
  this.diagram.nodes.each(node => {
    allParts.push(node);
  });
  this.diagram.parts.each(part => {
    allParts.push(part);
  });
  // note that this ignores Links
  return allParts;
};

DrawCommandHandler.prototype._arrowKeyMove = function() {
  const diagram = this.diagram;
  const e = diagram.lastInput;
  // moves all selected parts in the specified direction
  let vdistance = 0;
  let hdistance = 0;
  // if control is being held down, move pixel by pixel. Else, moves by grid cell size
  if (e.control || e.meta) {
    vdistance = 1;
    hdistance = 1;
  } else if (diagram.grid !== null) {
    const cellsize = diagram.grid.gridCellSize;
    hdistance = cellsize.width;
    vdistance = cellsize.height;
  }
  diagram.startTransaction('arrowKeyMove');
  diagram.selection.each(part => {
    if (e.key === 'Up') {
      part.move(
        new go.Point(part.actualBounds.x, part.actualBounds.y - vdistance)
      );
    } else if (e.key === 'Down') {
      part.move(
        new go.Point(part.actualBounds.x, part.actualBounds.y + vdistance)
      );
    } else if (e.key === 'Left') {
      part.move(
        new go.Point(part.actualBounds.x - hdistance, part.actualBounds.y)
      );
    } else if (e.key === 'Right') {
      part.move(
        new go.Point(part.actualBounds.x + hdistance, part.actualBounds.y)
      );
    }
  });
  diagram.commitTransaction('arrowKeyMove');
};

DrawCommandHandler.prototype._arrowKeySelect = function() {
  const diagram = this.diagram;
  const e = diagram.lastInput;
  let nextPart = null;
  if (e.key === 'Up') {
    nextPart = this._findNearestPartTowards(270);
  } else if (e.key === 'Down') {
    nextPart = this._findNearestPartTowards(90);
  } else if (e.key === 'Left') {
    nextPart = this._findNearestPartTowards(180);
  } else if (e.key === 'Right') {
    nextPart = this._findNearestPartTowards(0);
  }
  if (nextPart !== null) {
    if (e.shift) {
      nextPart.isSelected = true;
    } else if (e.control || e.meta) {
      nextPart.isSelected = !nextPart.isSelected;
    } else {
      diagram.select(nextPart);
    }
  }
};

DrawCommandHandler.prototype._findNearestPartTowards = function(dir) {
  const originalPart = this.diagram.selection.first();
  if (originalPart === null) return null;
  const originalPoint = originalPart.actualBounds.center;
  const allParts = this._getAllParts();
  let closestDistance = Infinity;
  let closest = originalPart; // if no parts meet the criteria, the same part remains selected

  for (let i = 0; i < allParts.length; i++) {
    const nextPart = allParts[i];
    if (nextPart === originalPart) continue; // skips over currently selected part
    const nextPoint = nextPart.actualBounds.center;
    const angle = originalPoint.directionPoint(nextPoint);
    const anglediff = this._angleCloseness(angle, dir);
    if (anglediff <= 45) {
      // if this part's center is within the desired direction's sector,
      let distance = originalPoint.distanceSquaredPoint(nextPoint);
      distance *= 1 + Math.sin((anglediff * Math.PI) / 180); // the more different from the intended angle, the further it is
      if (distance < closestDistance) {
        // and if it's closer than any other part,
        closestDistance = distance; // remember it as a better choice
        closest = nextPart;
      }
    }
  }
  return closest;
};

DrawCommandHandler.prototype._angleCloseness = function(a, dir) {
  return Math.min(
    Math.abs(dir - a),
    Math.min(Math.abs(dir + 360 - a), Math.abs(dir - 360 - a))
  );
};

DrawCommandHandler.prototype.copyToClipboard = function(coll) {
  super.copyToClipboard(coll);
  this._lastPasteOffset.set(this.pasteOffset);
};

DrawCommandHandler.prototype.pasteFromClipboard = function() {
  const coll = super.pasteFromClipboard();
  this.diagram.moveParts(coll, this._lastPasteOffset, false);
  this._lastPasteOffset.add(this.pasteOffset);
  return coll;
};

function PoolLayout() {
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

go.Diagram.inherit(PoolLayout, go.GridLayout);

PoolLayout.prototype.doLayout = function(coll) {
  var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction('PoolLayout');
  var pool = this.group;
  if (pool !== null && pool.category === 'Pool') {
    // make sure all of the Group Shapes are big enough
    var minsize = computeMinPoolSize(pool);
    pool.memberParts.each(function(lane) {
      if (!(lane instanceof go.Group)) return;
      if (lane.category !== 'Pool') {
        var shape = lane.resizeObject;
        if (shape !== null) {
          // change the desiredSize to be big enough in both directions
          var sz = computeLaneSize(lane);
          shape.width = !isNaN(shape.width)
            ? Math.max(shape.width, sz.width)
            : sz.width;
          //shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
          shape.height = 1000;
          var cell = lane.resizeCellSize;
          //if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
          //if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
        }
      }
    });
  }
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction('PoolLayout');
};

function LaneResizingTool() {
  go.ResizingTool.call(this);
}
go.Diagram.inherit(LaneResizingTool, go.ResizingTool);

LaneResizingTool.prototype.isLengthening = function() {
  return (this.handle !== null && this.handle.alignment === go.Spot.Right);
}

LaneResizingTool.prototype.computeMinSize = function() {
  if (this.adornedObject === null) return new go.Size(MINLENGTH, MINBREADTH);
  const lane = this.adornedObject.part;
  if (!(lane instanceof go.Group) || lane.containingGroup === null) return new go.Size(MINLENGTH, MINBREADTH);
  // assert(lane instanceof go.Group && lane.category !== "Pool");
  const msz = computeMinLaneSize(lane);  // get the absolute minimum size
  if (this.isLengthening()) {  // compute the minimum length of all lanes
    const sz = computeMinPoolSize(lane.containingGroup);
    msz.width = Math.max(msz.width, sz.width);
  } else {  // find the minimum size of this single lane
    const sz = computeLaneSize(lane);
    msz.width = Math.max(msz.width, sz.width);
    msz.height = Math.max(msz.height, sz.height);
  }
  return msz;
}

LaneResizingTool.prototype.canStart = function() {
  if (!go.ResizingTool.prototype.canStart.call(this)) return false;

  // if this is a resize handle for a "Lane", we can start.
  const diagram = this.diagram;
  const handl = this.findToolHandleAt(diagram.firstInput.documentPoint, this.name);
  if (handl === null || handl.part === null) return false;
  const ad = handl.part;
  if (ad.adornedObject === null || ad.adornedObject.part === null) return false;
  return (ad.adornedObject.part.category === 'Lane');
}

LaneResizingTool.prototype.resize = function(newr) {
  if (this.adornedObject === null) return;
  const lane = this.adornedObject.part;
  if (lane instanceof go.Group && lane.containingGroup !== null && this.isLengthening()) {  // changing the length of all of the lanes
    lane.containingGroup.memberParts.each((l) => {
      if (!(l instanceof go.Group)) return;
      const shape = l.resizeObject;
      if (shape !== null) {  // set its desiredSize length, but leave each breadth alone
        shape.width = newr.width;
      }
    });
  } else {  // changing the breadth of a single lane
    super.resize.call(this, newr);
  }
  relayoutDiagram();  // now that the lane has changed size, layout the pool again
}

const tooltiptemplate = $(
  'ToolTip',
  $(
    go.TextBlock,
    { margin: 3, editable: true },
    new go.Binding('text', '', function(data) {
      if (data.item !== undefined) return data.item;
      return '(unnamed item)';
    })
  )
);

function nodeActivityTaskTypeConverter(s) {
  const tasks = [
    'Empty',
    'BpmnTaskMessage',
    'BpmnTaskUser',
    'BpmnTaskManual', // Custom hand symbol
    'BpmnTaskScript',
    'BpmnTaskMessage', // should be black on white
    'BpmnTaskService', // Custom gear symbol
    'InternalStorage'
  ];
  if (s < tasks.length) return tasks[s];
  return 'NotAllowed'; // error
}

function nodeActivityBESpotConverter(s) {
  const x = 10 + EventNodeSize / 2;
  if (s === 0) return new go.Spot(0, 1, x, 0); // bottom left
  if (s === 1) return new go.Spot(1, 1, -x, 0); // bottom right
  if (s === 2) return new go.Spot(1, 0, -x, 0); // top right
  return new go.Spot(1, 0, -x - (s - 2) * EventNodeSize, 0); // top ... right-to-left-ish spread
}

function nodeActivityTaskTypeColorConverter(s) {
  return s === 5 ? 'dimgray' : 'white';
}

function nodeEventTypeConverter(s) {
  // order here from BPMN 2.0 poster
  const tasks = [
    'NotAllowed',
    'Empty',
    'BpmnTaskMessage',
    'BpmnEventTimer',
    'BpmnEventEscalation',
    'BpmnEventConditional',
    'Arrow',
    'BpmnEventError',
    'ThinX',
    'BpmnActivityCompensation',
    'Triangle',
    'Pentagon',
    'ThickCross',
    'Circle'
  ];
  if (s < tasks.length) return tasks[s];
  return 'NotAllowed'; // error
}

function nodeEventDimensionStrokeColorConverter(s) {
  if (s === 8) return EventDimensionStrokeEndColor;
  return EventDimensionStrokeColor;
}

function nodeEventDimensionSymbolFillConverter(s) {
  if (s <= 6) return EventSymbolLightFill;
  return EventSymbolDarkFill;
}

const boundaryEventMenu = $(
  // context menu for each boundaryEvent on Activity node
  'ContextMenu',
  $(
    'ContextMenuButton',
    $(go.TextBlock, 'Remove event'),
    // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
    {
      click: function(e, obj) {
        removeActivityNodeBoundaryEvent(obj.part.adornedObject);
      }
    }
  )
);

function removeActivityNodeBoundaryEvent(obj) {
  if (obj === null || obj.panel === null || obj.panel.itemArray === null)
    return;
  myDiagram.startTransaction('removeBoundaryEvent');
  const pid = obj.portId;
  const arr = obj.panel.itemArray;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].portId === pid) {
      myDiagram.model.removeArrayItem(arr, i);
      break;
    }
  }
  myDiagram.commitTransaction('removeBoundaryEvent');
}

const boundaryEventItemTemplate =
  $(go.Panel, 'Spot',
    {
      contextMenu: boundaryEventMenu,
      alignmentFocus: go.Spot.Center,
      fromLinkable: true, toLinkable: false, cursor: 'pointer', fromSpot: go.Spot.Bottom,
      fromMaxLinks: 1, toMaxLinks: 0
    },
    new go.Binding('portId', 'portId'),
    new go.Binding('alignment', 'alignmentIndex', nodeActivityBESpotConverter),
    $(go.Shape, 'Circle',
      { desiredSize: new go.Size(EventNodeSize, EventNodeSize) },
      new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 6) ? [4, 2] : null; }),
      new go.Binding('fromSpot', 'alignmentIndex',
        function (s) {
          //  nodeActivityBEFromSpotConverter, 0 & 1 go on bottom, all others on top of activity
          if (s < 2) return go.Spot.Bottom;
          return go.Spot.Top;
        }),
      new go.Binding('fill', 'color')),
    $(go.Shape, 'Circle',
      {
        alignment: go.Spot.Center,
        desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize), fill: null
      },
      new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 6) ? [4, 2] : null; })
    ),
    $(go.Shape, 'NotAllowed',
      {
        alignment: go.Spot.Center,
        desiredSize: new go.Size(EventNodeSymbolSize, EventNodeSymbolSize), fill: 'white'
      },
      new go.Binding('figure', 'eventType', nodeEventTypeConverter)
    )
  );

// ------------------------------------------  Activity Node contextMenu   ----------------------------------------------

const activityNodeMenu =
  $('ContextMenu',
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Email Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(2, 5); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Timer Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(3, 5); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Escalation Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(4, 5); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Error Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(7, 5); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Signal Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(10, 5); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Add N-I Escalation Event', { margin: 3 }),
      { click: function (e, obj) { addActivityNodeBoundaryEvent(4, 6); } }),
    $('ContextMenuButton',
      $(go.TextBlock, 'Rename', { margin: 3 }),
      { click: function (e, obj) { rename(obj); } }));


// sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
function makeSubButton(sub) {
  if (sub) {
    return [$('SubGraphExpanderButton'),
    { margin: 2, visible: false },
    new go.Binding('visible', 'isSubProcess')];
  }
  return [];
}

// sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
function makeMarkerPanel(sub, scale) {
  return $(go.Panel, 'Horizontal',
    { alignment: go.Spot.MiddleBottom, alignmentFocus: go.Spot.MiddleBottom },
    $(go.Shape, 'BpmnActivityLoop',
      { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: ActivityMarkerStrokeWidth },
      new go.Binding('visible', 'isLoop')),
    $(go.Shape, 'BpmnActivityParallel',
      { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: ActivityMarkerStrokeWidth },
      new go.Binding('visible', 'isParallel')),
    $(go.Shape, 'BpmnActivitySequential',
      { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: ActivityMarkerStrokeWidth },
      new go.Binding('visible', 'isSequential')),
    $(go.Shape, 'BpmnActivityAdHoc',
      { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: ActivityMarkerStrokeWidth },
      new go.Binding('visible', 'isAdHoc')),
    $(go.Shape, 'BpmnActivityCompensation',
      { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: ActivityMarkerStrokeWidth, fill: null },
      new go.Binding('visible', 'isCompensation')),
    makeSubButton(sub)
  ); // end activity markers horizontal panel
}

const activityNodeTemplate =
  $(go.Node, 'Spot',
    {
      locationObjectName: 'SHAPE', locationSpot: go.Spot.Center,
      resizable: true, resizeObjectName: 'PANEL',
      toolTip: tooltiptemplate,
      selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
      contextMenu: activityNodeMenu,
      itemTemplate: boundaryEventItemTemplate
    },
    new go.Binding('itemArray', 'boundaryEventArray'),
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    // move a selected part into the Foreground layer, so it isn"t obscured by any non-selected parts
    new go.Binding('layerName', 'isSelected', function (s) { return s ? 'Foreground' : ''; }).ofObject(),
    $(go.Panel, 'Auto',
      {
        name: 'PANEL',
        minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
        desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight)
      },
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Panel, 'Spot',
        $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
          {
            name: 'SHAPE',
            fill: ActivityNodeFill, stroke: ActivityNodeStroke,
            parameter1: 10, // corner size
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
            fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
          },
          new go.Binding('fill', 'color'),
          new go.Binding('strokeWidth', 'isCall',
            function (s) { return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
        ),
        //        $(go.Shape, "RoundedRectangle",  // the inner "Transaction" rounded rectangle
        //          { margin: 3,
        //            stretch: go.GraphObject.Fill,
        //            stroke: ActivityNodeStroke,
        //            parameter1: 8, fill: null, visible: false
        //          },
        //          new go.Binding("visible", "isTransaction")
        //         ),
        // task icon
        $(go.Shape, 'BpmnTaskScript',    // will be None, Script, Manual, Service, etc via converter
          {
            alignment: new go.Spot(0, 0, 5, 5), alignmentFocus: go.Spot.TopLeft,
            width: 22, height: 22
          },
          new go.Binding('fill', 'taskType', nodeActivityTaskTypeColorConverter),
          new go.Binding('figure', 'taskType', nodeActivityTaskTypeConverter)
        ), // end Task Icon
        makeMarkerPanel(false, 1) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
      ),  // end main body rectangles spot panel
      $(go.TextBlock,  // the center text
        {
          alignment: go.Spot.Center, textAlign: 'center', margin: 12,
          editable: true
        },
        new go.Binding('text').makeTwoWay())
    )  // end Auto Panel
  );  // end go.Node, which is a Spot Panel with bound itemArray

// ------------------------------- template for Activity / Task node in Palette  -------------------------------

const palscale = 2;
const activityNodeTemplateForPalette =
  $(go.Node, 'Vertical',
    {
      locationObjectName: 'SHAPE',
      locationSpot: go.Spot.Center,
      selectionAdorned: false
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Panel, 'Spot',
      {
        name: 'PANEL',
        desiredSize: new go.Size(ActivityNodeWidth / palscale, ActivityNodeHeight / palscale)
      },
      $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
        {
          name: 'SHAPE',
          fill: ActivityNodeFill, stroke: ActivityNodeStroke,
          parameter1: 10 / palscale  // corner size (default 10)
        },
        new go.Binding('strokeWidth', 'isCall',
          function (s) { return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })),
      $(go.Shape, 'RoundedRectangle',  // the inner "Transaction" rounded rectangle
        {
          margin: 3,
          stretch: go.GraphObject.Fill,
          stroke: ActivityNodeStroke,
          parameter1: 8 / palscale, fill: null, visible: false
        },
        new go.Binding('visible', 'isTransaction')),
      // task icon
      $(go.Shape, 'BpmnTaskScript',    // will be None, Script, Manual, Service, etc via converter
        {
          alignment: new go.Spot(0, 0, 5, 5), alignmentFocus: go.Spot.TopLeft,
          width: 22 / palscale, height: 22 / palscale
        },
        new go.Binding('fill', 'taskType', nodeActivityTaskTypeColorConverter),
        new go.Binding('figure', 'taskType', nodeActivityTaskTypeConverter)),
      makeMarkerPanel(false, palscale) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
    ), // End Spot panel
    $(go.TextBlock,  // the center text
      { alignment: go.Spot.Center, textAlign: 'center', margin: 2 },
      new go.Binding('text'))
  );  // End Node

const subProcessGroupTemplateForPalette =
  $(go.Group, 'Vertical',
    {
      locationObjectName: 'SHAPE',
      locationSpot: go.Spot.Center,
      isSubGraphExpanded: false,
      selectionAdorned: false
    },
    $(go.Panel, 'Spot',
      {
        name: 'PANEL',
        desiredSize: new go.Size(ActivityNodeWidth / palscale, ActivityNodeHeight / palscale)
      },
      $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
        {
          name: 'SHAPE',
          fill: ActivityNodeFill, stroke: ActivityNodeStroke,
          parameter1: 10 / palscale  // corner size (default 10)
        },
        new go.Binding('strokeWidth', 'isCall', function (s) { return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
      ),
      $(go.Shape, 'RoundedRectangle',  // the inner "Transaction" rounded rectangle
        {
          margin: 3,
          stretch: go.GraphObject.Fill,
          stroke: ActivityNodeStroke,
          parameter1: 8 / palscale, fill: null, visible: false
        },
        new go.Binding('visible', 'isTransaction')),
      makeMarkerPanel(true, palscale) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
    ), // end main body rectangles spot panel
    $(go.TextBlock,  // the center text
      { alignment: go.Spot.Center, textAlign: 'center', margin: 2 },
      new go.Binding('text'))
  );  // end go.Group

// ------------------------------------------  Event Node Template  ----------------------------------------------

const eventNodeTemplate =
  $(go.Node, 'Vertical',
    {
      locationObjectName: 'SHAPE',
      locationSpot: go.Spot.Center,
      toolTip: tooltiptemplate
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
    new go.Binding('layerName', 'isSelected', function (s) { return s ? 'Foreground' : ''; }).ofObject(),
    // can be resided according to the user's desires
    { resizable: false, resizeObjectName: 'SHAPE' },
    $(go.Panel, 'Spot',
      $(go.Shape, 'Circle',  // Outer circle
        {
          strokeWidth: 1,
          name: 'SHAPE',
          desiredSize: new go.Size(EventNodeSize, EventNodeSize),
          portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
          fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
        },
        // allows the color to be determined by the node data
        new go.Binding('fill', 'eventDimension', function (s) { return (s === 8) ? EventEndOuterFillColor : EventBackgroundColor; }),
        new go.Binding('strokeWidth', 'eventDimension', function (s) { return s === 8 ? EventNodeStrokeWidthIsEnd : 1; }),
        new go.Binding('stroke', 'eventDimension', nodeEventDimensionStrokeColorConverter),
        new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 3 || s === 6) ? [4, 2] : null; }),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
      ),  // end main shape
      $(go.Shape, 'Circle',  // Inner circle
        { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize), fill: null },
        new go.Binding('stroke', 'eventDimension', nodeEventDimensionStrokeColorConverter),
        new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 3 || s === 6) ? [4, 2] : null; }), // dashes for non-interrupting
        new go.Binding('visible', 'eventDimension', function (s) { return s > 3 && s <= 7; }) // inner  only visible for 4 thru 7
      ),
      $(go.Shape, 'NotAllowed',
        { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeSymbolSize, EventNodeSymbolSize), stroke: 'black' },
        new go.Binding('figure', 'eventType', nodeEventTypeConverter),
        new go.Binding('fill', 'eventDimension', nodeEventDimensionSymbolFillConverter)
      )
    ),  // end Auto Panel
    $(go.TextBlock,
      { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: true },
      new go.Binding('text').makeTwoWay())

  );

function nodeGatewaySymbolTypeConverter(s) {
  const tasks = ['NotAllowed',
    'ThinCross',      // 1 - Parallel
    'Circle',         // 2 - Inclusive
    'AsteriskLine',   // 3 - Complex
    'ThinX',          // 4 - Exclusive  (exclusive can also be no symbol, just bind to visible=false for no symbol)
    'Pentagon',       // 5 - double cicle event based gateway
    'Pentagon',       // 6 - exclusive event gateway to start a process (single circle)
    'ThickCross'];   // 7 - parallel event gateway to start a process (single circle)
  if (s < tasks.length) return tasks[s];
  return 'NotAllowed'; // error
}

// tweak the size of some of the gateway icons
function nodeGatewaySymbolSizeConverter(s) {
  const size = new go.Size(GatewayNodeSymbolSize, GatewayNodeSymbolSize);
  if (s === 4) {
    size.width = size.width / 4 * 3;
    size.height = size.height / 4 * 3;
  } else if (s > 4) {
    size.width = size.width / 1.6;
    size.height = size.height / 1.6;
  }
  return size;
}
function nodePalGatewaySymbolSizeConverter(s) {
  const size = nodeGatewaySymbolSizeConverter(s);
  size.width = size.width / 2;
  size.height = size.height / 2;
  return size;
}

const gatewayNodeTemplate =
  $(go.Node, 'Vertical',
    {
      locationObjectName: 'SHAPE',
      locationSpot: go.Spot.Center,
      toolTip: tooltiptemplate
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
    new go.Binding('layerName', 'isSelected', function (s) { return s ? 'Foreground' : ''; }).ofObject(),
    // can be resided according to the user's desires
    { resizable: false, resizeObjectName: 'SHAPE' },
    $(go.Panel, 'Spot',
      $(go.Shape, 'Diamond',
        {
          strokeWidth: 1, fill: GatewayNodeFill, stroke: GatewayNodeStroke,
          name: 'SHAPE',
          desiredSize: new go.Size(GatewayNodeSize, GatewayNodeSize),
          portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
          fromSpot: go.Spot.NotLeftSide, toSpot: go.Spot.NotRightSide
        },
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),  // end main shape
      $(go.Shape, 'NotAllowed',
        { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke, fill: GatewayNodeSymbolFill },
        new go.Binding('figure', 'gatewayType', nodeGatewaySymbolTypeConverter),
        // new go.Binding("visible", "gatewayType", function(s) { return s !== 4; }),   // comment out if you want exclusive gateway to be X instead of blank.
        new go.Binding('strokeWidth', 'gatewayType', function (s) { return (s <= 4) ? GatewayNodeSymbolStrokeWidth : 1; }),
        new go.Binding('desiredSize', 'gatewayType', nodeGatewaySymbolSizeConverter)),
      // the next 2 circles only show up for event gateway
      $(go.Shape, 'Circle',  // Outer circle
        {
          strokeWidth: 1, stroke: GatewayNodeSymbolStroke, fill: null, desiredSize: new go.Size(EventNodeSize, EventNodeSize)
        },
        new go.Binding('visible', 'gatewayType', function (s) { return s >= 5; }) // only visible for > 5
      ),  // end main shape
      $(go.Shape, 'Circle',  // Inner circle
        {
          alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke,
          desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize),
          fill: null
        },
        new go.Binding('visible', 'gatewayType', function (s) { return s === 5; }) // inner  only visible for == 5
      )
    ),
    $(go.TextBlock,
      { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: true },
      new go.Binding('text').makeTwoWay())
  ); // end go.Node Vertical

// --------------------------------------------------------------------------------------------------------------

const gatewayNodeTemplateForPalette =
  $(go.Node, 'Vertical',
    {
      toolTip: tooltiptemplate,
      resizable: false,
      locationObjectName: 'SHAPE',
      locationSpot: go.Spot.Center,
      resizeObjectName: 'SHAPE'
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Panel, 'Spot',
      $(go.Shape, 'Diamond',
        {
          strokeWidth: 1, fill: GatewayNodeFill, stroke: GatewayNodeStroke, name: 'SHAPE',
          desiredSize: new go.Size(GatewayNodeSize / 2, GatewayNodeSize / 2)
        }),
      $(go.Shape, 'NotAllowed',
        { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke, strokeWidth: GatewayNodeSymbolStrokeWidth, fill: GatewayNodeSymbolFill },
        new go.Binding('figure', 'gatewayType', nodeGatewaySymbolTypeConverter),
        // new go.Binding("visible", "gatewayType", function(s) { return s !== 4; }),   // comment out if you want exclusive gateway to be X instead of blank.
        new go.Binding('strokeWidth', 'gatewayType', function (s) { return (s <= 4) ? GatewayNodeSymbolStrokeWidth : 1; }),
        new go.Binding('desiredSize', 'gatewayType', nodePalGatewaySymbolSizeConverter)),
      // the next 2 circles only show up for event gateway
      $(go.Shape, 'Circle',  // Outer circle
        {
          strokeWidth: 1, stroke: GatewayNodeSymbolStroke, fill: null, desiredSize: new go.Size(EventNodeSize / 2, EventNodeSize / 2)
        },
        // new go.Binding("desiredSize", "gatewayType", new go.Size(EventNodeSize/2, EventNodeSize/2)),
        new go.Binding('visible', 'gatewayType', function (s) { return s >= 5; }) // only visible for > 5
      ),  // end main shape
      $(go.Shape, 'Circle',  // Inner circle
        {
          alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke,
          desiredSize: new go.Size(EventNodeInnerSize / 2, EventNodeInnerSize / 2),
          fill: null
        },
        new go.Binding('visible', 'gatewayType', function (s) { return s === 5; }) // inner  only visible for == 5
      )),

    $(go.TextBlock,
      { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: false },
      new go.Binding('text'))
  );

// --------------------------------------------------------------------------------------------------------------

const annotationNodeTemplate =
  $(go.Node, 'Auto',
    { background: GradientLightGray, locationSpot: go.Spot.Center },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'Annotation', // A left bracket shape
      { portId: '', fromLinkable: true, cursor: 'pointer', fromSpot: go.Spot.Left, strokeWidth: 2, stroke: 'gray' }),
    $(go.TextBlock,
      { margin: 5, editable: true },
      new go.Binding('text').makeTwoWay())
  );

const dataObjectNodeTemplate =
  $(go.Node, 'Vertical',
    { locationObjectName: 'SHAPE', locationSpot: go.Spot.Center },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'File',
      {
        name: 'SHAPE', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
        fill: DataFill, desiredSize: new go.Size(EventNodeSize * 0.8, EventNodeSize)
      }),
    $(go.TextBlock,
      {
        margin: 5,
        editable: true
      },
      new go.Binding('text').makeTwoWay())
  );

const dataStoreNodeTemplate =
  $(go.Node, 'Vertical',
    { locationObjectName: 'SHAPE', locationSpot: go.Spot.Center },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'Database',
      {
        name: 'SHAPE', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
        fill: DataFill, desiredSize: new go.Size(EventNodeSize, EventNodeSize)
      }),
    $(go.TextBlock,
      { margin: 5, editable: true },
      new go.Binding('text').makeTwoWay())
  );

// ------------------------------------------  private process Node Template Map   ----------------------------------------------

const privateProcessNodeTemplate =
  $(go.Node, 'Auto',
    { layerName: 'Background', resizable: true, resizeObjectName: 'LANE' },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'Rectangle',
      { fill: null }),
    $(go.Panel, 'Table',     // table with 2 cells to hold header and lane
      {
        desiredSize: new go.Size(ActivityNodeWidth * 6, ActivityNodeHeight),
        background: DataFill, name: 'LANE', minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight * 0.667)
      },
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.TextBlock,
        {
          row: 0, column: 0,
          angle: 270, margin: 5,
          editable: true, textAlign: 'center'
        },
        new go.Binding('text').makeTwoWay()),
      $(go.RowColumnDefinition, { column: 1, separatorStrokeWidth: 1, separatorStroke: 'black' }),
      $(go.Shape, 'Rectangle',
        {
          row: 0, column: 1,
          stroke: null, fill: 'transparent',
          portId: '', fromLinkable: true, toLinkable: true,
          fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
          cursor: 'pointer', stretch: go.GraphObject.Fill
        })
    )
  );

const privateProcessNodeTemplateForPalette =
  $(go.Node, 'Vertical',
    { locationSpot: go.Spot.Center },
    $(go.Shape, 'Process',
      { fill: DataFill, desiredSize: new go.Size(GatewayNodeSize / 2, GatewayNodeSize / 4) }),
    $(go.TextBlock,
      { margin: 5, editable: true },
      new go.Binding('text'))
  );

const poolTemplateForPalette =
  $(go.Group, 'Vertical',
    {
      locationSpot: go.Spot.Center,
      computesBoundsIncludingLinks: false,
      isSubGraphExpanded: false
    },
    $(go.Shape, 'Process',
      { fill: 'white', desiredSize: new go.Size(GatewayNodeSize / 2, GatewayNodeSize / 4) }),
    $(go.Shape, 'Process',
      { fill: 'white', desiredSize: new go.Size(GatewayNodeSize / 2, GatewayNodeSize / 4) }),
    $(go.TextBlock,
      { margin: 5, editable: true },
      new go.Binding('text'))
  );

const swimLanesGroupTemplateForPalette =
  $(go.Group, 'Vertical'); // empty in the palette

const subProcessGroupTemplate =
  $(go.Group, 'Spot',
    {
      locationSpot: go.Spot.Center,
      locationObjectName: 'PH',
      // locationSpot: go.Spot.Center,
      isSubGraphExpanded: false,
      memberValidation: function (group, part) {
        return !(part instanceof go.Group) ||
          (part.category !== 'Pool' && part.category !== 'Lane');
      },
      mouseDrop: function (e, grp) {
        if (!(grp instanceof go.Group) || grp.diagram === null) return;
        const ok = grp.addMembers(grp.diagram.selection, true);
        if (!ok) grp.diagram.currentTool.doCancel();
      },
      contextMenu: activityNodeMenu,
      itemTemplate: boundaryEventItemTemplate
    },
    new go.Binding('itemArray', 'boundaryEventArray'),
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
    // new go.Binding("layerName", "isSelected", function (s) { return s ? "Foreground" : ""; }).ofObject(),
    $(go.Panel, 'Auto',
      $(go.Shape, 'RoundedRectangle',
        {
          name: 'PH', fill: SubprocessNodeFill, stroke: SubprocessNodeStroke,
          minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
          portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
          fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
        },
        new go.Binding('strokeWidth', 'isCall', function (s) { return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
      ),
      $(go.Panel, 'Vertical',
        { defaultAlignment: go.Spot.Left },
        $(go.TextBlock,  // label
          { margin: 3, editable: true },
          new go.Binding('text', 'text').makeTwoWay(),
          new go.Binding('alignment', 'isSubGraphExpanded', function (s) { return s ? go.Spot.TopLeft : go.Spot.Center; })),
        // create a placeholder to represent the area where the contents of the group are
        $(go.Placeholder,
          { padding: new go.Margin(5, 5) }),
        makeMarkerPanel(true, 1)  // sub-process,  loop, parallel, sequential, ad doc and compensation markers
      )  // end Vertical Panel
    )
  );  // end Group

const laneEventMenu =  // context menu for each lane
  $('ContextMenu',
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Lane'),
      // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
      { click: function (e, obj) { addLaneEvent((obj.part).adornedObject); } })
  );

function addLaneEvent(lane) {
  myDiagram.startTransaction('addLane');
  if (lane != null && lane.data.category === 'Lane') {
    // create a new lane data object
    const shape = lane.findObject('SHAPE');
    const size = new go.Size(shape ? shape.width : MINLENGTH, MINBREADTH);
    const newlanedata = {
      category: 'Lane',
      text: 'New Lane',
      color: 'white',
      isGroup: true,
      loc: go.Point.stringify(new go.Point(lane.location.x, lane.location.y + 1)), // place below selection
      size: go.Size.stringify(size),
      group: lane.data.group
    };
    // and add it to the model
    myDiagram.model.addNodeData(newlanedata);
  }
  myDiagram.commitTransaction('addLane');
}

const swimLanesGroupTemplate =
  $(go.Group, 'Spot', groupStyle(),
    {
      name: 'Lane',
      contextMenu: laneEventMenu,
      minLocation: new go.Point(NaN, -Infinity),  // only allow vertical movement
      maxLocation: new go.Point(NaN, Infinity),
      selectionObjectName: 'SHAPE',  // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true, resizeObjectName: 'SHAPE',  // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: $(go.LayeredDigraphLayout,  // automatically lay out the lane's subgraph
        {
          isInitial: false,  // don't even do initial layout
          isOngoing: false,  // don't invalidate layout when nodes or links are added or removed
          direction: 0,
          columnSpacing: 10,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
        }),
      computesBoundsAfterDrag: true,  // needed to prevent recomputing Group.placeholder bounds too soon
      computesBoundsIncludingLinks: false,  // to reduce occurrences of links going briefly outside the lane
      computesBoundsIncludingLocation: true,  // to support empty space at top-left corner of lane
      handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
      mouseDrop: function (e, grp) {  // dropping a copy of some Nodes and Links onto this Group adds them to this Group
        // don't allow drag-and-dropping a mix of regular Nodes and Groups
        if (!e.diagram.selection.any((n) => (n instanceof go.Group && n.category !== 'subprocess') || n.category === 'privateProcess')) {
          if (!(grp instanceof go.Group) || grp.diagram === null) return;
          const ok = grp.addMembers(grp.diagram.selection, true);
          if (ok) {
            updateCrossLaneLinks(grp);
            relayoutDiagram();
          } else {
            grp.diagram.currentTool.doCancel();
          }
        }
      },
      subGraphExpandedChanged: function (grp) {
        if (grp.diagram === null) return;
        if (grp.diagram.undoManager.isUndoingRedoing) return;
        const shp = grp.resizeObject;
        if (grp.isSubGraphExpanded) {
          shp.height = (grp)['_savedBreadth'];
        } else {
          (grp)['_savedBreadth'] = shp.height;
          shp.height = NaN;
        }
        updateCrossLaneLinks(grp);
      }
    },
    // new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),

    $(go.Shape, 'Rectangle',  // this is the resized object
      { name: 'SHAPE', fill: 'white', stroke: null },  // need stroke null here or you gray out some of pool border.
      new go.Binding('fill', 'color'),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),

    // the lane header consisting of a Shape and a TextBlock
    $(go.Panel, 'Horizontal',
      {
        name: 'HEADER',
        angle: 270,  // maybe rotate the header to read sideways going up
        alignment: go.Spot.LeftCenter, alignmentFocus: go.Spot.LeftCenter
      },
      $(go.TextBlock,  // the lane label
        { editable: true, margin: new go.Margin(2, 0, 0, 8) },
        new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
        new go.Binding('text', 'text').makeTwoWay()),
      $('SubGraphExpanderButton', { margin: 4, angle: -270 })  // but this remains always visible!
    ),  // end Horizontal Panel
    $(go.Placeholder,
      { padding: 12, alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft }),
    $(go.Panel, 'Horizontal', { alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft },
      $(go.TextBlock,  // this TextBlock is only seen when the swimlane is collapsed
        {
          name: 'LABEL',
          editable: true, visible: false,
          angle: 0, margin: new go.Margin(6, 0, 0, 20)
        },
        new go.Binding('visible', 'isSubGraphExpanded', function (e) { return !e; }).ofObject(),
        new go.Binding('text', 'text').makeTwoWay())
    )
  );  // end swimLanesGroupTemplate

// define a custom resize adornment that has two resize handles if the group is expanded
// myDiagram.groupTemplate.resizeAdornmentTemplate =
swimLanesGroupTemplate.resizeAdornmentTemplate =
  $(go.Adornment, 'Spot',
    $(go.Placeholder),
    $(go.Shape,  // for changing the length of a lane
      {
        alignment: go.Spot.Right,
        desiredSize: new go.Size(7, 50),
        fill: 'lightblue', stroke: 'dodgerblue',
        cursor: 'col-resize'
      },
      new go.Binding('visible', '', function (ad) {
        if (ad.adornedPart === null) return false;
        return ad.adornedPart.isSubGraphExpanded;
      }).ofObject()),
    $(go.Shape,  // for changing the breadth of a lane
      {
        alignment: go.Spot.Bottom,
        desiredSize: new go.Size(50, 7),
        fill: 'lightblue', stroke: 'dodgerblue',
        cursor: 'row-resize'
      },
      new go.Binding('visible', '', function (ad) {
        if (ad.adornedPart === null) return false;
        return ad.adornedPart.isSubGraphExpanded;
      }).ofObject())
  );

const poolGroupTemplate =
  $(go.Group, 'Auto', groupStyle(),
    {
      computesBoundsIncludingLinks: false,
      // use a simple layout that ignores links to stack the "lane" Groups on top of each other
      layout: $(PoolLayout, { spacing: new go.Size(0, 0) })  // no space between lanes
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape,
      { fill: 'white' },
      new go.Binding('fill', 'color')),
    $(go.Panel, 'Table',
      { defaultColumnSeparatorStroke: 'black' },
      $(go.Panel, 'Horizontal',
        { column: 0, angle: 270 },
        $(go.TextBlock,
          { editable: true, margin: new go.Margin(5, 0, 5, 0) },  // margin matches private process (black box pool)
          new go.Binding('text').makeTwoWay())
      ),
      $(go.Placeholder,
        { background: 'darkgray', column: 1 })
    )
  );

// ------------------------------------------  Template Maps  ----------------------------------------------

// create the nodeTemplateMap, holding main view node templates:
const nodeTemplateMap = new go.Map();
// for each of the node categories, specify which template to use
nodeTemplateMap.add('activity', activityNodeTemplate);
nodeTemplateMap.add('event', eventNodeTemplate);
nodeTemplateMap.add('gateway', gatewayNodeTemplate);
nodeTemplateMap.add('annotation', annotationNodeTemplate);
nodeTemplateMap.add('dataobject', dataObjectNodeTemplate);
nodeTemplateMap.add('datastore', dataStoreNodeTemplate);
nodeTemplateMap.add('privateProcess', privateProcessNodeTemplate);
// for the default category, "", use the same template that Diagrams use by default
// this just shows the key value as a simple TextBlock

const groupTemplateMap = new go.Map();
groupTemplateMap.add('subprocess', subProcessGroupTemplate);
groupTemplateMap.add('Lane', swimLanesGroupTemplate);
groupTemplateMap.add('Pool', poolGroupTemplate);

// create the nodeTemplateMap, holding special palette "mini" node templates:
const palNodeTemplateMap = new go.Map();
palNodeTemplateMap.add('activity', activityNodeTemplateForPalette);
palNodeTemplateMap.add('event', eventNodeTemplate);
palNodeTemplateMap.add('gateway', gatewayNodeTemplateForPalette);
palNodeTemplateMap.add('annotation', annotationNodeTemplate);
palNodeTemplateMap.add('dataobject', dataObjectNodeTemplate);
palNodeTemplateMap.add('datastore', dataStoreNodeTemplate);
palNodeTemplateMap.add('privateProcess', privateProcessNodeTemplateForPalette);

const palGroupTemplateMap = new go.Map();
palGroupTemplateMap.add('subprocess', subProcessGroupTemplateForPalette);
palGroupTemplateMap.add('Pool', poolTemplateForPalette);
palGroupTemplateMap.add('Lane', swimLanesGroupTemplateForPalette);


// ------------------------------------------  Link Templates   ----------------------------------------------

const sequenceLinkTemplate =
  $(go.Link,
    {
      contextMenu:
        $('ContextMenu',
          $('ContextMenuButton',
            $(go.TextBlock, 'Default Flow'),
            // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
            { click: function (e, obj) { setSequenceLinkDefaultFlow((obj.part).adornedObject); } }),
          $('ContextMenuButton',
            $(go.TextBlock, 'Conditional Flow'),
            // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
            { click: function (e, obj) { setSequenceLinkConditionalFlow((obj.part).adornedObject); } })
        ),
      routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10,
      // fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide,
      reshapable: true, relinkableFrom: true, relinkableTo: true, toEndSegmentLength: 20
    },
    new go.Binding('points').makeTwoWay(),
    $(go.Shape, { stroke: 'black', strokeWidth: 1 }),
    $(go.Shape, { toArrow: 'Triangle', scale: 1.2, fill: 'black', stroke: null }),
    $(go.Shape, { fromArrow: '', scale: 1.5, stroke: 'black', fill: 'white' },
      new go.Binding('fromArrow', 'isDefault', function (s) {
        if (s === null) return '';
        return s ? 'BackSlash' : 'StretchedDiamond';
      }),
      new go.Binding('segmentOffset', 'isDefault', function (s) {
        return s ? new go.Point(5, 0) : new go.Point(0, 0);
      })),
    $(go.TextBlock, { // this is a Link label
      name: 'Label', editable: true, text: 'label', segmentOffset: new go.Point(-10, -10), visible: false
    },
      new go.Binding('text', 'text').makeTwoWay(),
      new go.Binding('visible', 'visible').makeTwoWay())
  );

function setSequenceLinkDefaultFlow(obj) {
  myDiagram.startTransaction('setSequenceLinkDefaultFlow');
  const model = myDiagram.model;
  model.setDataProperty(obj.data, 'isDefault', true);
  // Set all other links from the fromNode to be isDefault=null
  if (obj.fromNode !== null) {
    obj.fromNode.findLinksOutOf().each(function (link) {
      if (link !== obj && link.data.isDefault) {
        model.setDataProperty(link.data, 'isDefault', null);
      }
    });
  }
  myDiagram.commitTransaction('setSequenceLinkDefaultFlow');
}

// set Conditional Sequence Flow (diamond From Arrow)
function setSequenceLinkConditionalFlow(obj) {
  myDiagram.startTransaction('setSequenceLinkConditionalFlow');
  const model = myDiagram.model;
  model.setDataProperty(obj.data, 'isDefault', false);
  myDiagram.commitTransaction('setSequenceLinkConditionalFlow');
}

const messageFlowLinkTemplate =
  $(PoolLink, // defined in BPMNClasses.js
    {
      routing: go.Link.Orthogonal, curve: go.Link.JumpGap, corner: 10,
      fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
      reshapable: true, relinkableTo: true, toEndSegmentLength: 20
    },
    new go.Binding('points').makeTwoWay(),
    $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [6, 2] }),
    $(go.Shape, { toArrow: 'Triangle', scale: 1, fill: 'white', stroke: 'black' }),
    $(go.Shape, { fromArrow: 'Circle', scale: 1, visible: true, stroke: 'black', fill: 'white' }),
    $(go.TextBlock, {
      editable: true, text: 'label'
    }, // Link label
      new go.Binding('text', 'text').makeTwoWay())
  );

const dataAssociationLinkTemplate =
  $(go.Link,
    {
      routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10,
      fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides,
      reshapable: true, relinkableFrom: true, relinkableTo: true
    },
    new go.Binding('points').makeTwoWay(),
    $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [1, 3] }),
    $(go.Shape, { toArrow: 'OpenTriangle', scale: 1, fill: null, stroke: 'blue' })
  );

const annotationAssociationLinkTemplate =
  $(go.Link,
    {
      reshapable: true, relinkableFrom: true, relinkableTo: true,
      toSpot: go.Spot.AllSides,
      toEndSegmentLength: 20, fromEndSegmentLength: 40
    },
    new go.Binding('points').makeTwoWay(),
    $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [1, 3] }),
    $(go.Shape, { toArrow: 'OpenTriangle', scale: 1, stroke: 'black' })
  );

const linkTemplateMap = new go.Map();
linkTemplateMap.add('msg', messageFlowLinkTemplate);
linkTemplateMap.add('annotation', annotationAssociationLinkTemplate);
linkTemplateMap.add('data', dataAssociationLinkTemplate);
linkTemplateMap.add('', sequenceLinkTemplate);  // default  


// this may be called to force the lanes to be laid out again
function relayoutLanes() {
  myDiagram.nodes.each(function(lane) {
    if (!(lane instanceof go.Group)) return;
    if (lane.category === 'Pool') return;
    lane.layout.isValidLayout = false; // force it to be invalid
  });
  myDiagram.layoutDiagram();
}

function updateCells(ssid) {
  myDiagram.model.startTransaction('modified property');
  myDiagram.model.addNodeData({
    key: ssid,
    text: 'Key'
  });
  // ... maybe modify other properties and/or other data objects
  myDiagram.model.commitTransaction('modified property');
}
// this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
function relayoutDiagram() {
  myDiagram.layout.invalidateLayout();
  myDiagram.findTopLevelGroups().each(function(g) {
    if (g.category === 'Pool') g.layout.invalidateLayout();
  });
  myDiagram.layoutDiagram();
}

// compute the minimum size of a Pool Group needed to hold all of the Lane Groups
function computeMinPoolSize(pool) {
  // assert(pool instanceof go.Group && pool.category === "Pool");
  let len = 2500;
  pool.memberParts.each(function(lane) {
    // pools ought to only contain lanes, not plain Nodes
    if (!(lane instanceof go.Group)) return;
    let holder = lane.placeholder;
    if (holder !== null) {
      let sz = holder.actualBounds;
      len = Math.max(len, sz.height);
    }
  });
  return new go.Size(NaN, len);
}

// compute the minimum size for a particular Lane Group
function computeLaneSize(lane) {
  // assert(lane instanceof go.Group && lane.category !== "Pool");
  let sz = computeMinLaneSize(lane);
  if (lane.isSubGraphExpanded) {
    let holder = lane.placeholder;
    if (holder !== null) {
      let hsz = holder.actualBounds;
      sz.width = Math.max(sz.width, hsz.width);
    }
  }
  // minimum breadth needs to be big enough to hold the header
  let hdr = lane.findObject('HEADER');
  if (hdr !== null) sz.width = Math.max(sz.width, hdr.actualBounds.width);
  return sz;
}

// determine the minimum size of a Lane Group, even if collapsed
function computeMinLaneSize(lane) {
  if (!lane.isSubGraphExpanded) return new go.Size(1, MINLENGTH);
  return new go.Size(MINBREADTH, MINLENGTH);
}

function diagramInfo(model) {
  return (
    'Model:\n' +
    model.nodeDataArray.length +
    ' nodes, ' +
    model.linkDataArray.length +
    ' links'
  );
}

//this is a Part.dragComputation function for limiting where a Node may be dragged
function stayInGroup(part, pt, gridpt) {
  // don't constrain top-level nodes
  let grp = part.containingGroup;
  if (grp === null) return pt;
  // try to stay within the background Shape of the Group
  let back = grp.resizeObject;
  if (back === null) return pt;
  // allow dragging a Node out of a Group if the Shift key is down
  if (part.diagram.lastInput.shift) return pt;
  let p1 = back.getDocumentPoint(go.Spot.TopLeft);
  let p2 = back.getDocumentPoint(go.Spot.BottomRight);
  let b = part.actualBounds;
  let loc = part.location;
  // find the padding inside the group's placeholder that is around the member parts
  let m = grp.placeholder.padding;
  // now limit the location appropriately
  let x =
    Math.max(p1.x + m.left, Math.min(pt.x, p2.x - m.right - b.width - 1)) +
    (loc.x - b.x);
  let y =
    Math.max(p1.y + m.top, Math.min(pt.y, p2.y - m.bottom - b.height - 1)) +
    (loc.y - b.y);
  return new go.Point(x, y);
}

function groupStyle() {
  // common settings for both Lane and Pool Groups
  return [
    {
      layerName: 'Background', // all pools and lanes are always behind all nodes and links
      background: 'transparent', // can grab anywhere in bounds
      movable: true, // allows users to re-order by dragging
      copyable: false, // can't copy lanes or pools
      avoidable: false // don't impede AvoidsNodes routed Links
      // minLocation: new go.Point(-Infinity, NaN),  // only allow horizontal movement
      // maxLocation: new go.Point(Infinity, NaN)
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  ];
}

// hide links between lanes when either lane is collapsed
function updateCrossLaneLinks(group) {
  group.findExternalLinksConnected().each(function(l) {
    l.visible = l.fromNode.isVisible() && l.toNode.isVisible();
  });
}

function nodeStyle() {
  return [
    new go.Binding('width', 'width'),
    new go.Binding('height', 'height'),
    // The Node.location comes from the "loc" property of the node data,
    // converted by the Point.parse static method.
    // If the Node.location is changed, it updates the "loc" property of the node data,
    // converting back using the Point.stringify static method.
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),

    {
      // the Node.location is at the center of each node
      locationSpot: go.Spot.Center
    }
  ];
}

// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId,
// the "align" is used to determine where to position the port relative to the body of the node,
// the "spot" is used to control how links connect with the port and whether the port
// stretches along the side of the node,
// and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
function makePort(name, align, spot, output, input) {
  let vertical = align.equals(go.Spot.Left) || align.equals(go.Spot.Right);
  let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
  let width, height, stretch;

  width = !horizontal ? NaN : 8;
  height = horizontal ? NaN : 8;
  stretch = go.GraphObject.Vertical;

  // the port is basically just a transparent rectangle that stretches along the side of the node,
  // and becomes colored when the mouse passes over it
  return $(go.Shape, {
    fill: 'transparent', // changed to a color in the mouseEnter event handler
    strokeWidth: 0, // no stroke
    width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
    height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
    alignment: align, // align the port on the main Shape
    stretch: go.GraphObject.Vertical,
    portId: name, // declare this object to be a "port"
    fromSpot: spot, // declare where links may connect at this port
    fromLinkable: output, // declare whether the user may draw links from here
    toSpot: spot, // declare where links may connect at this port
    toLinkable: input, // declare whether the user may draw links to here
    cursor: 'pointer', // show a different cursor to indicate potential link point
    mouseEnter: function(e, port) {
      // the PORT argument will be this Shape
      if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)';
    },
    mouseLeave: function(e, port) {
      port.fill = 'transparent';
    }
  });
}

function addActivityNodeBoundaryEvent(evType, evDim) {
  myDiagram.startTransaction('addBoundaryEvent');
  myDiagram.selection.each(function (node) {
    // skip any selected Links
    if (!(node instanceof go.Node)) return;
    if (node.data && (node.data.category === 'activity' || node.data.category === 'subprocess')) {
      // compute the next available index number for the side
      let i = 0;
      const defaultPort = node.findPort('');
      while (node.findPort('be' + i.toString()) !== defaultPort) i++;           // now this new port name is unique within the whole Node because of the side prefix
      const name = 'be' + i.toString();
      if (!node.data.boundaryEventArray) { myDiagram.model.setDataProperty(node.data, 'boundaryEventArray', []); }       // initialize the Array of port data if necessary
      // create a new port data object
      const newportdata = {
        portId: name,
        eventType: evType,
        eventDimension: evDim,
        color: 'white',
        alignmentIndex: i
        // if you add port data properties here, you should copy them in copyPortData above  ** BUG...  we don't do that.
      };
      // and add it to the Array of port data
      myDiagram.model.insertArrayItem(node.data.boundaryEventArray, -1, newportdata);
    }
  });
  myDiagram.commitTransaction('addBoundaryEvent');
}

function rename(obj) {
  if (obj === null || obj.part === null || obj.part.data === null) return;
  myDiagram.startTransaction('rename');
  const newName = prompt('Rename ' + obj.part.data.item + ' to:');
  myDiagram.model.setDataProperty(obj.part.data, 'item', newName);
  myDiagram.commitTransaction('rename');
}

let rainbow = $(go.Brush, 'Linear', {
  0.0: 'rgba(255, 0, 0, 1)',
  0.15: 'rgba(255, 255, 0, 1)',
  0.3: 'rgba(0, 255, 0, 1)',
  0.5: 'rgba(0, 255, 255, 1)',
  0.65: 'rgba(0, 0, 255, 1)',
  0.8: 'rgba(255, 0, 255, 1)',
  1: 'rgba(255, 0, 0, 1)'
});

// let gradient = $(go.Brush, "Linear", {
//     0.0: "#dce4ef",
//     1: "#6c8ebf"
// });

let gradient = '#629bf7';

function textStyle() {
  return {
    font: 'bold 8pt Helvetica, Arial, sans-serif',
    stroke: 'black',
    wrap: go.TextBlock.WrapFit
  };
}

let teams;
let action = component.get('c.getProcessTeams');
action.setParams({ processId: component.get('v.recordId') });
action.setCallback(this, function(response) {
  let state = response.getState();
  if (state === 'SUCCESS') {
    component.set('v.processTeams', response.getReturnValue());
    teams = component.get('v.processTeams');
    console.log(teams);
    for (let i = 0; i < teams.length; i++) {
      myDiagram.model.addNodeData({
        key: teams[i].Id,
        text: teams[i].Name,
        isGroup: true
      });
    }
  }
});
$A.enqueueAction(action);

relayoutLanes();
let steps;
let action = component.get('c.getProcessSteps');
action.setParams({ processId: component.get('v.recordId') });
action.setCallback(this, function(response) {
  let state = response.getState();
  if (state === 'SUCCESS') {
    steps = response.getReturnValue();
    console.log(steps);

    for (let i = 0; i < steps.length; i++) {
      myDiagram.model.addNodeData({
        key: steps[i].Id,
        loc: steps[i].X_Position__c + ' ' + steps[i].Y_Position__c,
        width: steps[i].Width__c,
        height: steps[i].Height__c,
        prop1: steps[i].Description__c,
        text: steps[i].Name,
        category: steps[i].Step_Type__c,
        group: steps[i].Process_Team__c
      });
    }
  }
});
$A.enqueueAction(action);

myDiagram.layoutDiagram();

let tool = myDiagram.toolManager.draggingTool;
tool.dragsLink = true;
let paths;
let action = component.get('c.getProcessPaths');
action.setParams({ processId: component.get('v.recordId') });
action.setCallback(this, function(response) {
  let state = response.getState();
  if (state === 'SUCCESS') {
    paths = response.getReturnValue();
    //console.log(paths);
    for (let i = 0; i < paths.length; i++) {
      //console.log(paths[i].Parent_Step__c);
      //console.log(paths[i].Child_Step__c);
      myDiagram.model.addLinkData({
        from: paths[i].Parent_Step__c,
        to: paths[i].Child_Step__c,
        text: paths[i].Name,
        key: paths[i].Id,
        sfid: paths[i].Id
      });
      // console.log('its in');
    }
  }
});
$A.enqueueAction(action);

function nodeDoubleClick(e, obj) {
  console.log(e);
  console.log(obj);

  let clicked = obj.part;
  if (clicked !== null) {
    let thisStep = clicked.data;
    console.log(thisStep);
    //helper.updateCaseStatusAction(component);
    //window.location.href = '/'+thisStep.key;

    let getStep = component.get('c.stepDBlClick');
    getStep.setParams({
      key: thisStep.key
    });
    getStep.setCallback(this, function(response) {
      let state = response.getState();
      console.log(state);
      if (state === 'SUCCESS') {
        component.set('v.processStep', response.getReturnValue());
      }
    });
    $A.enqueueAction(getStep);
    component.set('v.isOpen', true);
  }
}

function swimlaneDoubleClick(e, obj) {
  component.set('v.isOpenSwimLane', true);

  let clicked = obj.part;
  console.log(clicked);
  if (clicked !== null) {
    let thisStep = clicked.data;
    console.log(thisStep);
    //helper.updateCaseStatusAction(component);
    //window.location.href = '/'+thisStep.key;

    let getStep = component.get('c.stepDBlClick');
    getStep.setParams({
      key: thisStep.key
    });
    getStep.setCallback(this, function(response) {
      let state = response.getState();
      console.log(state);
      if (state === 'SUCCESS') {
        component.set('v.processStep', response.getReturnValue());
      }
    });
    $A.enqueueAction(getStep);
    component.set('v.isOpen', true);
  }
}

myDiagram =
  $(go.Diagram, 'myDiagramDiv',
    {
      nodeTemplateMap: nodeTemplateMap,
      linkTemplateMap: linkTemplateMap,
      groupTemplateMap: groupTemplateMap,

      commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
      // default to having arrow keys move selected nodes
      'commandHandler.arrowKeyBehavior': 'move',

      mouseDrop: function (e) {
        // when the selection is dropped in the diagram's background,
        // make sure the selected Parts no longer belong to any Group
        const ok = myDiagram.commandHandler.addTopLevelParts(myDiagram.selection, true);
        if (!ok) myDiagram.currentTool.doCancel();
      },
      linkingTool: new BPMNLinkingTool(), // defined in BPMNClasses.js
      relinkingTool: new BPMNRelinkingTool(), // defined in BPMNClasses.js
      'SelectionMoved': relayoutDiagram,  // defined below
      'SelectionCopied': relayoutDiagram
    });

myDiagram.toolManager.mouseDownTools.insertAt(0, new LaneResizingTool());

myDiagram.model.addChangedListener(function(e) {
  if (e.isTransactionFinished === true) {
    let tx = e.object;
    //console.log(tx);
    if (tx instanceof go.Transaction && window.console) {
      //window.console.log(tx.toString());
      tx.changes.each(function(c) {
        //if (c.model) window.console.log(c.toString());
        //console.log(c.Eo);

        //if (c.model) window.console.log(c.Eo.key);
        //if (c.model) window.console.log(c.Eo.loc);
        //if (c.model) window.console.log(c.Eo.group);
        //if (c.model) window.console.log(c.model.toString());

        if (c.model) {
          if (c.change === go.ChangedEvent.Insert) {
            console.log('This is the new item');
            console.log(
              e.propertyName + ' added node with key: ' + c.newValue.key
            );
            console.log(c.newValue);

            if (
              (c.newValue.category == 'process' ||
                c.newValue.category == 'decision' ||
                c.newValue.category == 'Start') &&
              (c.newValue.key == '-1' ||
                c.newValue.key == '-2' ||
                c.newValue.key == '-3' ||
                c.newValue.key == '-4' ||
                c.newValue.key == '-5')
            ) {
              console.log('Entered');

              let newStep = component.get('c.createNewStep');
              newStep.setParams({
                process: component.get('v.recordId'),
                team: c.newValue.group,
                stepType: c.newValue.category
              });
              newStep.setCallback(this, function(response) {
                let state = response.getState();

                if (state === 'SUCCESS') {
                  let data = myDiagram.model.findNodeDataForKey(c.newValue.key);

                  console.log('The data');
                  console.log(data);

                  myDiagram.model.startTransaction('modified property');

                  console.log('The New Id');
                  console.log(response.getReturnValue());

                  myDiagram.model.commit(function(m) {
                    m.set(data, 'key', response.getReturnValue());
                  }, 'New');

                  // ... maybe modify other properties and/or other data objects
                  myDiagram.model.commitTransaction('modified property');
                }
              });
              $A.enqueueAction(newStep);
            }
          }

          //console.log(c);
          let UpdateAction = component.get('c.updateNodes');
          UpdateAction.setParams({
            key: c.Go.key,
            loc: c.Go.loc,
            grp: c.Go.group
          });
          UpdateAction.setCallback(this, function(response) {
            let state = response.getState();
            //console.log(state);
            //console.log(response.getReturnValue());
          });
          $A.enqueueAction(UpdateAction);

          if (typeof c.Co !== 'undefined') {
            //console.log('C Set');
            if (
              typeof c.Co.from !== 'undefined' &&
              typeof c.Co.to !== 'undefined'
            ) {
              if (
                typeof c.change.Ua !== 'undefined' &&
                c.change.Ua == 'Insert'
              ) {
                console.log('All good');

                let newPath = component.get('c.createNewPath');
                newPath.setParams({
                  parent: c.Co.from,
                  child: c.Co.to
                });
                newPath.setCallback(this, function(response) {
                  let state = response.getState();
                  //console.log(state);
                  //console.log(response.getReturnValue());
                });
                $A.enqueueAction(newPath);
              }
            }
          }
        } else {
          //console.log(c.Eo.part);
          try {
            if (
              typeof c.Go.part !== 'undefined' &&
              typeof c.Go.part.jb.key !== 'undefined'
            ) {
              //console.log(c.Eo.part.jb.key);
              //console.log(c.Ao);

              if (c.Go.part.jb.key.substring(0, 3) == 'a03') {
                let UpdateAction = component.get('c.updatePathName');
                UpdateAction.setParams({
                  key: c.Go.part.jb.key,
                  name: c.Ao
                });
                UpdateAction.setCallback(this, function(response) {
                  let state = response.getState();
                  //console.log(state);
                });
                $A.enqueueAction(UpdateAction);
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  }
});

function keyCompare(a, b) {
  const at = a.data.key;
  const bt = b.data.key;
  if (at < bt) return -1;
  if (at > bt) return 1;
  return 0;
}

// initialize the first Palette, BPMN Spec Level 1
const myPaletteLevel1 =
  $(go.Palette, 'myPaletteDiv1',
    { // share the templates with the main Diagram
      nodeTemplateMap: palNodeTemplateMap,
      groupTemplateMap: palGroupTemplateMap,
      layout: $(go.GridLayout,
        {
          cellSize: new go.Size(1, 1),
          spacing: new go.Size(5, 5),
          comparer: keyCompare
        })
    });

// initialize the second Palette, BPMN Spec Level 2
const myPaletteLevel2 =
  $(go.Palette, 'myPaletteDiv2',
    { // share the templates with the main Diagram
      nodeTemplateMap: palNodeTemplateMap,
      groupTemplateMap: palGroupTemplateMap,
      layout: $(go.GridLayout,
        {
          cellSize: new go.Size(1, 1),
          spacing: new go.Size(5, 5),
          comparer: keyCompare
        })
    });

// initialize the third Palette, random other stuff
const myPaletteLevel3 =
  $(go.Palette, 'myPaletteDiv3',
    { // share the templates with the main Diagram
      nodeTemplateMap: palNodeTemplateMap,
      groupTemplateMap: palGroupTemplateMap,
      layout: $(go.GridLayout,
        {
          cellSize: new go.Size(1, 1),
          spacing: new go.Size(5, 5),
          comparer: keyCompare
        })
    });

myPaletteLevel1.model = $(go.GraphLinksModel,
  {
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: [
      // -------------------------- Event Nodes
      { key: 101, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
      { key: 102, category: 'event', text: 'Message', eventType: 2, eventDimension: 2, item: 'Message' }, // BpmnTaskMessage
      { key: 103, category: 'event', text: 'Timer', eventType: 3, eventDimension: 3, item: 'Timer' },
      { key: 104, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'End' },
      { key: 107, category: 'event', text: 'Message', eventType: 2, eventDimension: 8, item: 'Message' }, // BpmnTaskMessage
      { key: 108, category: 'event', text: 'Terminate', eventType: 13, eventDimension: 8, item: 'Terminate' },
      // -------------------------- Task/Activity Nodes
      { key: 131, category: 'activity', text: 'Task', item: 'generic task', taskType: 0 },
      { key: 132, category: 'activity', text: 'User Task', item: 'User task', taskType: 2 },
      { key: 133, category: 'activity', text: 'Service\nTask', item: 'service task', taskType: 6 },
      // subprocess and start and end
      { key: 134, category: 'subprocess', loc: '0 0', text: 'Subprocess', isGroup: true, isSubProcess: true, taskType: 0 },
      { key: -802, category: 'event', loc: '0 0', group: 134, text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
      { key: -803, category: 'event', loc: '350 0', group: 134, text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },
      // -------------------------- Gateway Nodes, Data, Pool and Annotation
      { key: 201, category: 'gateway', text: 'Parallel', gatewayType: 1 },
      { key: 204, category: 'gateway', text: 'Exclusive', gatewayType: 4 },
      { key: 301, category: 'dataobject', text: 'Data\nObject' },
      { key: 302, category: 'datastore', text: 'Data\nStorage' },
      { key: 401, category: 'privateProcess', text: 'Black Box' },
      { key: '501', 'text': 'Pool 1', 'isGroup': 'true', 'category': 'Pool' },
      { key: 'Lane5', 'text': 'Lane 1', 'isGroup': 'true', 'group': '501', 'color': 'lightyellow', 'category': 'Lane' },
      { key: 'Lane6', 'text': 'Lane 2', 'isGroup': 'true', 'group': '501', 'color': 'lightgreen', 'category': 'Lane' },
      { key: 701, category: 'annotation', text: 'note' }
    ]  // end nodeDataArray
  });  // end model

myPaletteLevel2.model = $(go.GraphLinksModel,
  {
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: [
      { key: 1, category: 'activity', taskType: 1, text: 'Receive Task', item: 'Receive Task' },
      { key: 2, category: 'activity', taskType: 5, text: 'Send Task', item: 'Send Task' },
      { key: 3, category: 'activity', taskType: 7, text: 'Business\nRule Task', item: 'Business Rule Task' },
      { key: 4, category: 'activity', taskType: 2, text: 'User Task', item: 'User Task', isCall: true },

      { key: 101, text: 'Adhoc\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isAdHoc: true, taskType: 0, loc: '0 0' },
      { key: -812, group: 101, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
      { key: -813, group: 101, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },

      { key: 102, text: 'Transactional\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isTransaction: true, taskType: 0, loc: '0 0' },
      { key: -822, group: 102, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
      { key: -823, group: 102, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },

      { key: 103, text: 'Looping\nActivity', isGroup: true, isLoop: true, isSubProcess: true, category: 'subprocess', taskType: 0, loc: '0 0' },
      { key: -831, group: 103, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
      { key: -832, group: 103, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },

      { key: 104, text: 'Multi-Instance\nActivity', isGroup: true, isSubProcess: true, isParallel: true, category: 'subprocess', taskType: 0, loc: '0 0' },
      { key: -841, group: 104, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
      { key: -842, group: 104, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },

      { key: 105, text: 'Call\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isCall: true, taskType: 0, loc: '0 0' },
      { key: -861, group: 105, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
      { key: -862, group: 105, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },

      // gateway nodes
      { key: 301, category: 'gateway', gatewayType: 2, text: 'Inclusive' },
      { key: 302, category: 'gateway', gatewayType: 5, text: 'Event\nGateway' },

      // events
      { key: 401, category: 'event', eventType: 5, eventDimension: 1, text: 'Conditional\nStart', item: 'BpmnEventConditional' },
      { key: 402, category: 'event', eventType: 10, eventDimension: 1, text: 'Signal\nStart', item: 'BpmnEventSignal' },  // start signal
      { key: 403, category: 'event', eventType: 10, eventDimension: 8, text: 'Signal\nEnd', item: 'end signal' },
      { key: 404, category: 'event', eventType: 7, eventDimension: 8, text: 'Error', item: 'BpmnEventError' },
      { key: 405, category: 'event', eventType: 4, eventDimension: 8, text: 'Escalation', item: 'BpmnEventEscalation' },
      // throwing / catching intermedicate events
      { key: 502, category: 'event', eventType: 6, eventDimension: 4, text: 'Catch\nLink', item: 'BpmnEventOffPage' },
      { key: 503, category: 'event', eventType: 6, eventDimension: 7, text: 'Throw\nLink', item: 'BpmnEventOffPage' },
      { key: 504, category: 'event', eventType: 2, eventDimension: 4, text: 'Catch\nMessage', item: 'Message' },
      { key: 505, category: 'event', eventType: 2, eventDimension: 7, text: 'Throw\nMessage', item: 'Message' },
      { key: 506, category: 'event', eventType: 5, eventDimension: 4, text: 'Catch\nConditional', item: '' },
      { key: 507, category: 'event', eventType: 3, eventDimension: 4, text: 'Catch\nTimer', item: '' },
      { key: 508, category: 'event', eventType: 4, eventDimension: 7, text: 'Throw\nEscalation', item: 'Escalation' },
      { key: 509, category: 'event', eventType: 10, eventDimension: 4, text: 'Catch\nSignal', item: '' },
      { key: 510, category: 'event', eventType: 10, eventDimension: 7, text: 'Throw\nSignal', item: '' }
    ]  // end nodeDataArray
  });  // end model

myPaletteLevel3.model = $(go.GraphLinksModel,
  {
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: [
      { key: 108, category: 'event', eventType: 8, eventDimension: 5, text: 'Cancel', item: 'BpmnEventCancel' },
      { key: 109, category: 'event', eventType: 9, eventDimension: 5, text: 'Compensation', item: 'BpmnEventCompensation' },

      { key: 111, category: 'event', eventType: 11, eventDimension: 1, text: 'Multiple', item: 'Multiple' },
      { key: 112, category: 'event', eventType: 12, eventDimension: 1, text: 'Parallel', item: 'Parallel' },
      // activity nodes
      { key: 203, category: 'activity', taskType: 3, isAdHoc: true, text: 'Manual', item: 'Manual Task' },
      { key: 204, category: 'activity', taskType: 4, isSequential: true, text: 'Script', item: 'Script Task' },
      { key: 205, category: 'activity', taskType: 5, isParallel: true, text: 'Send Msg', item: 'Send Msg Task' },
      { key: 206, category: 'activity', taskType: 6, isLoop: true, isSubProcess: true, isTransaction: true, text: 'Service', item: 'service task' },

      // gateway nodes not in Level 1 or Level 2
      { key: 603, category: 'gateway', text: 'Complex', gatewayType: 3 },
      { key: 606, category: 'gateway', text: 'Exclusive Start', gatewayType: 6 },
      { key: 607, category: 'gateway', text: 'Parallel Start', gatewayType: 7 },

      {
        key: 4, category: 'activity', taskType: 2, text: 'User Task', item: 'User Task',
        isCall: true, isLoop: true, isParallel: true, isSequential: true
      }
    ]  // end nodeDataArray
  }); 