// These parameters need to be set before defining the templates.
var MINLENGTH = 200; // this controls the minimum length of any swimlane
var MINBREADTH = 20; // this controls the minimum breadth of any non-collapsed swimlane
var vertical;

function horizontalLane() {
  selection = 'Horizontal';
  init();
}

function verticalLane() {
  selection = 'Vertical';
  init();
}
// this may be called to force the lanes to be laid out again
function relayoutLanes() {
  myDiagram.nodes.each(function(lane) {
    if (!(lane instanceof go.Group)) return;
    if (lane.category === 'VerticalPool' || lane.category === 'HorizontalPool')
      return;
    lane.layout.isValidLayout = false; // force it to be invalid
  });
  myDiagram.layoutDiagram();
}

// this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
function relayoutDiagram() {
  myDiagram.layout.invalidateLayout();
  myDiagram.findTopLevelGroups().each(function(g) {
    if (g.category === 'VerticalPool' || lane.category === 'HorizontalPool')
      g.layout.invalidateLayout();
  });
  myDiagram.layoutDiagram();
}

function init() {
  var $ = go.GraphObject.make;

  var horizontal = $(
    go.Group,
    'Horizontal',
    groupStyle(),
    {
      selectionObjectName: 'SHAPE', // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true,
      resizeObjectName: 'SHAPE', // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: $(
        go.LayeredDigraphLayout, // automatically lay out the lane's subgraph
        {
          isInitial: false, // don't even do initial layout
          isOngoing: false, // don't invalidate layout when nodes or links are added or removed
          direction: 0,
          columnSpacing: 10,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
        }
      ),
      computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
      computesBoundsIncludingLinks: false, // to reduce occurrences of links going briefly outside the lane
      computesBoundsIncludingLocation: true, // to support empty space at top-left corner of lane
      handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
      mouseDrop: function(e, grp) {
        // dropping a copy of some Nodes and Links onto this Group adds them to this Group
        if (!e.shift) return; // cannot change groups with an unmodified drag-and-drop
        // don't allow drag-and-dropping a mix of regular Nodes and Groups
        if (
          !e.diagram.selection.any(function(n) {
            return n instanceof go.Group;
          })
        ) {
          var ok = grp.addMembers(grp.diagram.selection, true);
          if (ok) {
            updateCrossLaneLinks(grp);
          } else {
            grp.diagram.currentTool.doCancel();
          }
        } else {
          e.diagram.currentTool.doCancel();
        }
      },
      subGraphExpandedChanged: function(grp) {
        var shp = grp.resizeObject;
        if (grp.diagram.undoManager.isUndoingRedoing) return;
        if (grp.isSubGraphExpanded) {
          shp.height = grp._savedBreadth;
        } else {
          grp._savedBreadth = shp.height;
          shp.height = NaN;
        }
        updateCrossLaneLinks(grp);
      }
    },
    new go.Binding('isSubGraphExpanded', 'expanded').makeTwoWay(),
    // the lane header consisting of a Shape and a TextBlock
    $(
      go.Panel,
      'Horizontal',
      {
        name: 'HEADER',
        angle: 270, // maybe rotate the header to read sideways going up
        alignment: go.Spot.Center
      },
      $(
        go.Panel,
        'Horizontal', // this is hidden when the swimlane is collapsed
        new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
        $(
          go.Shape,
          'Diamond',
          { width: 8, height: 8, fill: 'white' },
          new go.Binding('fill', 'color')
        ),
        $(
          go.TextBlock, // the lane label
          {
            font: 'bold 13pt sans-serif',
            editable: true,
            margin: new go.Margin(2, 0, 0, 0)
          },
          new go.Binding('text', 'text').makeTwoWay()
        )
      ),
      $('SubGraphExpanderButton', { margin: 5 }) // but this remains always visible!
    ), // end Horizontal Panel
    $(
      go.Panel,
      'Auto', // the lane consisting of a background Shape and a Placeholder representing the subgraph
      $(
        go.Shape,
        'Rectangle', // this is the resized object
        { name: 'SHAPE', fill: 'white' },
        new go.Binding('fill', 'color'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
          go.Size.stringify
        )
      ),
      $(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft }),
      $(
        go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
        {
          name: 'LABEL',
          font: 'bold 13pt sans-serif',
          editable: true,
          angle: 0,
          alignment: go.Spot.TopLeft,
          margin: new go.Margin(2, 0, 0, 4)
        },
        new go.Binding('visible', 'isSubGraphExpanded', function(e) {
          return !e;
        }).ofObject(),
        new go.Binding('text', 'text').makeTwoWay()
      )
    ) // end Auto Panel
  ); // end Group

  var vertical = $(
    go.Group,
    'Vertical',
    groupStyle(),
    {
      selectionObjectName: 'SHAPE', // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true,
      resizeObjectName: 'SHAPE', // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: $(
        go.LayeredDigraphLayout, // automatically lay out the lane's subgraph
        {
          isInitial: false, // don't even do initial layout
          isOngoing: false, // don't invalidate layout when nodes or links are added or removed
          // direction: 90,
          columnSpacing: 10,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
        }
      ),
      computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
      computesBoundsIncludingLinks: false, // to reduce occurrences of links going briefly outside the lane
      computesBoundsIncludingLocation: true, // to support empty space at top-left corner of lane
      handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
      mouseDrop: function(e, grp) {
        // dropping a copy of some Nodes and Links onto this Group adds them to this Group
        if (!e.shift) return; // cannot change groups with an unmodified drag-and-drop
        // don't allow drag-and-dropping a mix of regular Nodes and Groups
        if (
          !e.diagram.selection.any(function(n) {
            return n instanceof go.Group;
          })
        ) {
          var ok = grp.addMembers(grp.diagram.selection, true);
          if (ok) {
            updateCrossLaneLinks(grp);
          } else {
            grp.diagram.currentTool.doCancel();
          }
        } else {
          e.diagram.currentTool.doCancel();
        }
      },
      subGraphExpandedChanged: function(grp) {
        var shp = grp.resizeObject;
        if (grp.diagram.undoManager.isUndoingRedoing) return;
        if (grp.isSubGraphExpanded) {
          shp.width = grp._savedBreadth;
        } else {
          grp._savedBreadth = shp.width;
          shp.width = NaN;
        }
        updateCrossLaneLinks(grp);
      }
    },
    new go.Binding('isSubGraphExpanded', 'expanded').makeTwoWay(),
    // the lane header consisting of a Shape and a TextBlock
    $(
      go.Panel,
      'Horizontal',
      {
        name: 'HEADER',
        angle: 0, // maybe rotate the header to read sideways going up
        alignment: go.Spot.Center
      },
      $(
        go.Panel,
        'Horizontal', // this is hidden when the swimlane is collapsed
        new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
        $(
          go.Shape,
          'Diamond',
          { width: 8, height: 8, fill: 'white' },
          new go.Binding('fill', 'color')
        ),
        $(
          go.TextBlock, // the lane label
          {
            font: 'bold 13pt sans-serif',
            editable: true,
            margin: new go.Margin(2, 0, 0, 0)
          },
          new go.Binding('text', 'text').makeTwoWay()
        )
      ),
      $('SubGraphExpanderButton', { margin: 5 }) // but this remains always visible!
    ), // end Horizontal Panel
    $(
      go.Panel,
      'Auto', // the lane consisting of a background Shape and a Placeholder representing the subgraph
      $(
        go.Shape,
        'Rectangle', // this is the resized object
        { name: 'SHAPE', fill: 'white' },
        new go.Binding('fill', 'color'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
          go.Size.stringify
        )
      ),
      $(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft }),
      $(
        go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
        {
          name: 'LABEL',
          font: 'bold 13pt sans-serif',
          editable: true,
          angle: 90,
          alignment: go.Spot.TopLeft,
          margin: new go.Margin(4, 0, 0, 2)
        },
        new go.Binding('visible', 'isSubGraphExpanded', function(e) {
          return !e;
        }).ofObject(),
        new go.Binding('text', 'text').makeTwoWay()
      )
    ) // end Auto Panel
  ); // end Group

  myDiagram = $(go.Diagram, 'myDiagramDiv', {
    // use a custom ResizingTool (along with a custom ResizeAdornment on each Group)
    resizingTool: new LaneResizingTool(),
    // use a simple layout that ignores links to stack the top-level Pool Groups next to each other
    layout: $(VerticalPoolLayout),
    layout: $(HorizontalPoolLayout),
    // don't allow dropping onto the diagram's background unless they are all Groups (lanes or pools)
    mouseDragOver: function(e) {
      if (
        !e.diagram.selection.all(function(n) {
          return n instanceof go.Group;
        })
      ) {
        e.diagram.currentCursor = 'not-allowed';
      }
    },
    mouseDrop: function(e) {
      if (
        !e.diagram.selection.all(function(n) {
          return n instanceof go.Group;
        })
      ) {
        e.diagram.currentTool.doCancel();
      }
    },
    // a clipboard copied node is pasted into the original node's group (i.e. lane).
    'commandHandler.copiesGroupKey': true,
    // automatically re-layout the swim lanes after dragging the selection
    SelectionMoved: relayoutDiagram, // this DiagramEvent listener is
    SelectionCopied: relayoutDiagram, // defined above
    'animationManager.isEnabled': false,
    // enable undo & redo
    'undoManager.isEnabled': true
  });

  // this is a Part.dragComputation function for limiting where a Node may be dragged
  function stayInGroup(part, pt, gridpt) {
    // don't constrain top-level nodes
    var grp = part.containingGroup;
    if (grp === null) return pt;
    // try to stay within the background Shape of the Group
    var back = grp.resizeObject;
    if (back === null) return pt;
    // allow dragging a Node out of a Group if the Shift key is down
    if (part.diagram.lastInput.shift) return pt;
    var p1 = back.getDocumentPoint(go.Spot.TopLeft);
    var p2 = back.getDocumentPoint(go.Spot.BottomRight);
    var b = part.actualBounds;
    var loc = part.location;
    // find the padding inside the group's placeholder that is around the member parts
    var m = grp.placeholder.padding;
    // now limit the location appropriately
    var x =
      Math.max(p1.x + m.left, Math.min(pt.x, p2.x - m.right - b.width - 1)) +
      (loc.x - b.x);
    var y =
      Math.max(p1.y + m.top, Math.min(pt.y, p2.y - m.bottom - b.height - 1)) +
      (loc.y - b.y);
    return new go.Point(x, y);
  }

  myDiagram.nodeTemplate = $(
    go.Node,
    'Auto',
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(go.Shape, 'Rectangle', {
      fill: 'white',
      portId: '',
      cursor: 'pointer',
      fromLinkable: true,
      toLinkable: true
    }),
    $(go.TextBlock, { margin: 5 }, new go.Binding('text', 'key')),
    { dragComputation: stayInGroup } // limit dragging of Nodes to stay within the containing Group, defined above
  );

  function groupStyle() {
    // common settings for both Lane and Pool Groups
    return [
      {
        layerName: 'Background', // all pools and lanes are always behind all nodes and links
        background: 'transparent', // can grab anywhere in bounds
        movable: true, // allows users to re-order by dragging
        copyable: false, // can't copy lanes or pools
        avoidable: false, // don't impede AvoidsNodes routed Links
        minLocation: new go.Point(-Infinity, -Infinity), // only allow horizontal movement
        maxLocation: new go.Point(Infinity, Infinity)
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

  // each Group is a "swimlane" with a header on the left and a resizable lane on the right
  myDiagram.groupTemplate = selection === 'Horizontal' ? horizontal : vertical;
  // define a custom resize adornment that has two resize handles if the group is expanded
  myDiagram.groupTemplate.resizeAdornmentTemplate = $(
    go.Adornment,
    'Spot',
    $(go.Placeholder),
    $(
      go.Shape, // for changing the length of a lane
      {
        alignment: go.Spot.Bottom,
        desiredSize: new go.Size(50, 7),
        fill: 'lightblue',
        stroke: 'dodgerblue',
        cursor: 'row-resize'
      },
      new go.Binding('visible', '', function(ad) {
        if (ad.adornedPart === null) return false;
        return ad.adornedPart.isSubGraphExpanded;
      }).ofObject()
    ),
    $(
      go.Shape, // for changing the breadth of a lane
      {
        alignment: go.Spot.Right,
        desiredSize: new go.Size(7, 50),
        fill: 'lightblue',
        stroke: 'dodgerblue',
        cursor: 'col-resize'
      },
      new go.Binding('visible', '', function(ad) {
        if (ad.adornedPart === null) return false;
        return ad.adornedPart.isSubGraphExpanded;
      }).ofObject()
    )
  );

  myDiagram.groupTemplateMap.add(
    'VerticalPool',
    $(
      go.Group,
      'Auto',
      groupStyle(),
      {
        // use a simple layout that ignores links to stack the "lane" Groups next to each other
        layout: $(VerticalPoolLayout, { spacing: new go.Size(0, 0) }) // no space between lanes
      },
      $(go.Shape, { fill: 'white' }, new go.Binding('fill', 'color')),
      $(
        go.Panel,
        'Table',
        { defaultRowSeparatorStroke: 'black' },
        $(
          go.Panel,
          'Horizontal',
          { row: 0, angle: 0 },
          $(
            go.TextBlock,
            {
              font: 'bold 16pt sans-serif',
              editable: true,
              margin: new go.Margin(2, 0, 0, 0)
            },
            new go.Binding('text').makeTwoWay()
          )
        ),
        $(go.Placeholder, { row: 1 })
      )
    )
  );

  myDiagram.groupTemplateMap.add(
    'HorizontalPool',
    $(
      go.Group,
      'Auto',
      groupStyle(),
      {
        // use a simple layout that ignores links to stack the "lane" Groups on top of each other
        layout: $(HorizontalPoolLayout, { spacing: new go.Size(0, 0) }) // no space between lanes
      },
      $(go.Shape, { fill: 'white' }, new go.Binding('fill', 'color')),
      $(
        go.Panel,
        'Table',
        { defaultColumnSeparatorStroke: 'black' },
        $(
          go.Panel,
          'Horizontal',
          { column: 0, angle: 270 },
          $(
            go.TextBlock,
            {
              font: 'bold 16pt sans-serif',
              editable: true,
              margin: new go.Margin(2, 0, 0, 0)
            },
            new go.Binding('text').makeTwoWay()
          )
        ),
        $(go.Placeholder, { column: 1 })
      )
    )
  );

  myDiagram.linkTemplate = $(
    go.Link,
    { routing: go.Link.AvoidsNodes, corner: 5 },
    { relinkableFrom: true, relinkableTo: true },
    $(go.Shape),
    $(go.Shape, { toArrow: 'Standard' })
  );

  // define some sample graphs in some of the lanes
  myDiagram.model = new go.GraphLinksModel(
    [
      // node data
      { key: 'Pool1', text: 'Pool1', isGroup: true, category: 'VerticalPool' },
      {
        key: 'Pool2',
        text: 'Pool2',
        isGroup: true,
        category: 'HorizontalPool'
      },
      {
        key: 'Lane1',
        text: 'Lane1',
        isGroup: true,
        group: 'Pool1',
        color: 'lightblue'
      },
      {
        key: 'Lane2',
        text: 'Lane2',
        isGroup: true,
        group: 'Pool1',
        color: 'lightgreen'
      },
      {
        key: 'Lane3',
        text: 'Lane3',
        isGroup: true,
        group: 'Pool1',
        color: 'lightyellow'
      },
      {
        key: 'Lane4',
        text: 'Lane4',
        isGroup: true,
        group: 'Pool1',
        color: 'orange'
      },
      {
        key: 'Lane5',
        text: 'Lane5',
        isGroup: true,
        group: 'Pool2',
        color: 'lightyellow'
      },
      {
        key: 'Lane6',
        text: 'Lane6',
        isGroup: true,
        group: 'Pool2',
        color: 'lightgreen'
      },
      { key: 'fiveA', group: 'Lane5' },
      { key: 'sixA', group: 'Lane6' }
    ],
    [
      // link data
      { from: 'oneA', to: 'oneB' },
      { from: 'oneA', to: 'oneC' },
      { from: 'oneB', to: 'oneD' },
      { from: 'oneC', to: 'oneD' },
      { from: 'twoA', to: 'twoB' },
      { from: 'twoA', to: 'twoC' },
      { from: 'twoA', to: 'twoF' },
      { from: 'twoB', to: 'twoD' },
      { from: 'twoC', to: 'twoD' },
      { from: 'twoD', to: 'twoG' },
      { from: 'twoE', to: 'twoG' },
      { from: 'twoF', to: 'twoG' },
      { from: 'fourA', to: 'fourB' },
      { from: 'fourB', to: 'fourC' },
      { from: 'fourC', to: 'fourD' }
    ]
  );
  // force all lanes' layouts to be performed
  relayoutLanes();
} // end init

// Show the diagram's model in JSON format
function save() {
  document.getElementById('mySavedModel').value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}
function load() {
  myDiagram.model = go.Model.fromJson(
    document.getElementById('mySavedModel').value
  );
  myDiagram.delayInitialization(relayoutDiagram);
}
