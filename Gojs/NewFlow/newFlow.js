function init() {
  if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make; // for conciseness in defining templates

  const GradientYellow = $(go.Brush, "Linear", {
    0: "LightGoldenRodYellow",
    1: "#FFFF66"
  });
  const GradientLightGreen = $(go.Brush, "Linear", {
    0: "#E0FEE0",
    1: "PaleGreen"
  });
  const GradientLightGray = $(go.Brush, "Linear", {
    0: "White",
    1: "#DADADA"
  });

  const ActivityNodeFill = $(go.Brush, "Linear", {
    0: "OldLace",
    1: "PapayaWhip"
  });
  const ActivityNodeStroke = "#CDAA7D";
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
  const EventEndOuterFillColor = "pink";
  const EventBackgroundColor = GradientLightGreen;
  const EventSymbolLightFill = "white";
  const EventSymbolDarkFill = "dimgray";
  const EventDimensionStrokeColor = "green";
  const EventDimensionStrokeEndColor = "red";
  const EventNodeStrokeWidthIsEnd = 4;

  const GatewayNodeSize = 80;
  const GatewayNodeSymbolSize = 45;
  const GatewayNodeFill = GradientYellow;
  const GatewayNodeStroke = "darkgoldenrod";
  const GatewayNodeSymbolStroke = "darkgoldenrod";
  const GatewayNodeSymbolFill = GradientYellow;
  const GatewayNodeSymbolStrokeWidth = 3;

  const DataFill = GradientLightGray;
  const palscale = 2;
  const MINLENGTH = 400;
  const MINBREADTH = 20;

  myDiagram = $(
    go.Diagram,
    'myDiagramDiv',
    {
      LinkDrawn: showLinkLabel,
      LinkRelinked: showLinkLabel,
      "undoManager.isEnabled": true
    }
  );

  // taken from ../extensions/Figures.js:
  go.Shape.defineFigureGenerator("File", function(shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(0, 0, true); // starting point
    var fig2 = new go.PathFigure(0.75 * w, 0, false);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());

    geo.add(fig2);
    // The Fold
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
    geo.spot1 = new go.Spot(0, 0.25);
    geo.spot2 = go.Spot.BottomRight;
    return geo;
  });

  myDiagram.linkTemplate = $(
    go.Link, // the whole link panel
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      // mouse-overs subtly highlight links:
      mouseEnter: function(e, link) {
        link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
      },
      mouseLeave: function(e, link) {
        link.findObject("HIGHLIGHT").stroke = "transparent";
      },
      selectionAdorned: false
    },
    new go.Binding("points").makeTwoWay(),
    $(
      go.Shape, // the highlight shape, normally transparent
      {
        isPanelMain: true,
        strokeWidth: 8,
        stroke: "transparent",
        name: "HIGHLIGHT"
      }
    ),
    $(
      go.Shape, // the link path shape
      { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
      new go.Binding("stroke", "isSelected", function(sel) {
        return sel ? "dodgerblue" : "gray";
      }).ofObject()
    ),
    $(
      go.Shape, // the arrowhead
      { toArrow: "standard", strokeWidth: 0, fill: "gray" }
    ),
    $(
      go.Panel,
      "Auto", // the link label, normally not visible
      {
        visible: false,
        name: "LABEL",
        segmentIndex: 2,
        segmentFraction: 0.5
      },
      new go.Binding("visible", "visible").makeTwoWay(),
      $(
        go.Shape,
        "RoundedRectangle", // the label shape
        { fill: "#F8F8F8", strokeWidth: 0 }
      ),
      $(
        go.TextBlock,
        "Yes", // the label
        {
          textAlign: "center",
          font: "10pt helvetica, arial, sans-serif",
          stroke: "#333333",
          editable: true
        },
        new go.Binding("text").makeTwoWay()
      )
    )
  );

  myDiagram.toolManager.linkingTool.temporaryLink.routing =
    go.Link.Orthogonal;
  myDiagram.toolManager.relinkingTool.temporaryLink.routing =
    go.Link.Orthogonal;

  myDiagram.model = go.Model.fromJson({
    class: "go.GraphLinksModel",
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [],
    linkDataArray: []
  });

  const boundaryEventMenu =  // context menu for each boundaryEvent on Activity node
  $('ContextMenu',
    $('ContextMenuButton',
      $(go.TextBlock, 'Remove event'),
      { click: function (e, obj) { removeActivityNodeBoundaryEvent((obj.part).adornedObject); } })
  );

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
  );

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

  const tooltiptemplate =
  $('ToolTip',
    $(go.TextBlock,
      { margin: 3, editable: true },
      new go.Binding('text', '', function (data) {
        if (data.item !== undefined) return data.item;
        return '(unnamed item)';
      }))
  );
  
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
      // $(go.Shape, 'NotAllowed',
      //   { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke, fill: GatewayNodeSymbolFill },
      //   new go.Binding('figure', 'gatewayType', nodeGatewaySymbolTypeConverter),
      //   // new go.Binding("visible", "gatewayType", function(s) { return s !== 4; }),   // comment out if you want exclusive gateway to be X instead of blank.
      //   new go.Binding('strokeWidth', 'gatewayType', function (s) { return (s <= 4) ? GatewayNodeSymbolStrokeWidth : 1; }),
      //   new go.Binding('desiredSize', 'gatewayType', nodeGatewaySymbolSizeConverter)),
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
  );

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
  );

  const swimLanesGroupTemplateForPalette =
  $(go.Group, 'Vertical');

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
  );

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
        $(go.Placeholder,
          { padding: new go.Margin(5, 5) }),
        makeMarkerPanel(true, 1)  // sub-process,  loop, parallel, sequential, ad doc and compensation markers
      )  // end Vertical Panel
    )
  );

  const laneEventMenu =  // context menu for each lane
  $('ContextMenu',
    $('ContextMenuButton',
      $(go.TextBlock, 'Add Lane'),
      // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
      { click: function (e, obj) { addLaneEvent((obj.part).adornedObject); } })
  );

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
    },// new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),

    $(go.Shape, 'Rectangle',  // this is the resized object
      { name: 'SHAPE', fill: 'white', stroke: null },  // need stroke null here or you gray out some of pool border.
      new go.Binding('fill', 'color'),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),

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

  const palNodeTemplateMap = new go.Map();
  palNodeTemplateMap.add("activity", activityNodeTemplateForPalette);
  palNodeTemplateMap.add("event", eventNodeTemplate);
  palNodeTemplateMap.add("gateway", gatewayNodeTemplateForPalette);
  palNodeTemplateMap.add("annotation", annotationNodeTemplate);
  palNodeTemplateMap.add("dataobject", dataObjectNodeTemplate);
  palNodeTemplateMap.add("datastore", dataStoreNodeTemplate);
  palNodeTemplateMap.add(
    "privateProcess",
    privateProcessNodeTemplateForPalette
  );

  const palGroupTemplateMap = new go.Map();
  palGroupTemplateMap.add("subprocess", subProcessGroupTemplateForPalette);
  palGroupTemplateMap.add("Pool", poolTemplateForPalette);
  palGroupTemplateMap.add("Lane", swimLanesGroupTemplateForPalette);

  function textStyle() {
    return {
      font: "bold 11pt Helvetica, Arial, sans-serif",
      stroke: "whitesmoke"
    };
  }

  function showLinkLabel(e) {
    var label = e.subject.findObject("LABEL");
    if (label !== null)
      label.visible = e.subject.fromNode.data.category === "Conditional";
  }

  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center
      }
    ];
  }

  function makePort(name, align, spot, output, input) {
    var horizontal =
      align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    return $(go.Shape, {
      fill: "transparent", // changed to a color in the mouseEnter event handler
      strokeWidth: 0, // no stroke
      width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
      alignment: align, // align the port on the main Shape
      stretch: horizontal
        ? go.GraphObject.Horizontal
        : go.GraphObject.Vertical,
      portId: name, // declare this object to be a "port"
      fromSpot: spot, // declare where links may connect at this port
      fromLinkable: output, // declare whether the user may draw links from here
      toSpot: spot, // declare where links may connect at this port
      toLinkable: input, // declare whether the user may draw links to here
      cursor: "pointer", // show a different cursor to indicate potential link point
      mouseEnter: function(e, port) {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
      },
      mouseLeave: function(e, port) {
        port.fill = "transparent";
      }
    });
  }

  function removeActivityNodeBoundaryEvent(obj) {
    if (obj === null || obj.panel === null || obj.panel.itemArray === null) return;
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

  function keyCompare(a, b) {
    const at = a.data.key;
    const bt = b.data.key;
    if (at < bt) return -1;
    if (at > bt) return 1;
    return 0;
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

  function nodeActivityBESpotConverter(s) {
    const x = 10 + (EventNodeSize / 2);
    if (s === 0) return new go.Spot(0, 1, x, 0);    // bottom left
    if (s === 1) return new go.Spot(1, 1, -x, 0);   // bottom right
    if (s === 2) return new go.Spot(1, 0, -x, 0);   // top right
    return new go.Spot(1, 0, -x - (s - 2) * EventNodeSize, 0);    // top ... right-to-left-ish spread
  }

  function nodeEventTypeConverter(s) {  // order here from BPMN 2.0 poster
    const tasks = ['NotAllowed',
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
      'Circle'];
    if (s < tasks.length) return tasks[s];
    return 'NotAllowed'; // error
  }

  function nodeActivityTaskTypeColorConverter(s) {
    return (s === 5) ? 'dimgray' : 'white';
  }

  function nodeActivityTaskTypeConverter(s) {
    const tasks = ['Empty',
      'BpmnTaskMessage',
      'BpmnTaskUser',
      'BpmnTaskManual',   // Custom hand symbol
      'BpmnTaskScript',
      'BpmnTaskMessage',  // should be black on white
      'BpmnTaskService',  // Custom gear symbol
      'InternalStorage'];
    if (s < tasks.length) return tasks[s];
    return 'NotAllowed'; // error
  }

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

  function nodeGatewaySymbolTypeConverter(s) {
    const tasks = ['NotAllowed',
      'ThinCross',      // 1 - Parallel
      'Circle',         // 2 - Inclusive
      'AsteriskLine',   // 3 - Complex
      'ThinX',          // 4 - Exclusive  (exclusive can also be no symbol, just bind to visible=false for no symbol)
      'Pentagon',       // 5 - double cicle event based gateway
      'Pentagon',       // 6 - exclusive event gateway to start a process (single circle)
      'ThickCross'] ;   // 7 - parallel event gateway to start a process (single circle)
    if (s < tasks.length) return tasks[s];
    return 'NotAllowed'; // error
  }

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

  function nodeEventDimensionStrokeColorConverter(s) {
    if (s === 8) return EventDimensionStrokeEndColor;
    return EventDimensionStrokeColor;
  }

  function nodeEventDimensionSymbolFillConverter(s) {
    if (s <= 6) return EventSymbolLightFill;
    return EventSymbolDarkFill;
  }

  function groupStyle() {  // common settings for both Lane and Pool Groups
    return [
      {
        layerName: 'Background',  // all pools and lanes are always behind all nodes and links
        background: 'transparent',  // can grab anywhere in bounds
        movable: true, // allows users to re-order by dragging
        copyable: false,  // can't copy lanes or pools
        avoidable: false  // don't impede AvoidsNodes routed Links
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
    ];
  }

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

  function updateCrossLaneLinks(group) {
    group.findExternalLinksConnected().each((l) => {
      l.visible = (l.fromNode !== null && l.fromNode.isVisible() && l.toNode !== null && l.toNode.isVisible());
    });
  }

  function relayoutDiagram() {
    myDiagram.layout.invalidateLayout();
    myDiagram.findTopLevelGroups().each(function (g) { if (g.category === 'Pool' && g.layout !== null) g.layout.invalidateLayout(); });
    myDiagram.layoutDiagram();
  }

  function makeSubButton(sub) {
    if (sub) {
      return [$('SubGraphExpanderButton'),
      { margin: 2, visible: false },
      new go.Binding('visible', 'isSubProcess')];
    }
    return [];
  }

  const myPaletteLevel1 =
    $(go.Palette, 'myPaletteLevel1',
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
        });
} // end init
