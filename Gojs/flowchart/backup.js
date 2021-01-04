/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { LightningElement } from "lwc";
import golib from "@salesforce/resourceUrl/go";
import jquerylib from "@salesforce/resourceUrl/jquerylib";
import { loadScript } from "lightning/platformResourceLoader";
// import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class FirstGo extends LightningElement {
  isGoInitialized = false;

  renderedCallback() {
    if (this.isGoInitialized) {
      return;
    }
    this.isGoInitialized = true;

    Promise.all([loadScript(this, golib), loadScript(this, jquerylib)]).then(() => {
      this.initializeChart();
    });
    // .catch(error => {
    //   this.dispatchEvent(
    //     new ShowToastEvent({
    //       title: "Error loading Go chart",
    //       message: error,
    //       variant: "error"
    //     })
    //   );
    // });
  }

  initializeChart() {
  let $ = go.GraphObject.make;
  // let jQuery;

  const GradientYellow = $(go.Brush, 'Linear', { 0: 'LightGoldenRodYellow', 1: '#FFFF66' });
  const GradientLightGreen = $(go.Brush, 'Linear', { 0: '#E0FEE0', 1: 'PaleGreen' });
  const GradientLightGray = $(go.Brush, 'Linear', { 0: 'White', 1: '#DADADA' });

  const ActivityNodeFill = $(go.Brush, 'Linear', { 0: 'OldLace', 1: 'PapayaWhip' });
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

    let myDiagram = $(
      go.Diagram,
      this.template.querySelector("div[data-id='myDiagramDiv']"),
      {
        LinkDrawn: showLinkLabel,
        LinkRelinked: showLinkLabel,
        "undoManager.isEnabled": true
      }
    );

    // myDiagram.addDiagramListener("Modified", function(e) {
    //   var button = this.template.querySelector("SaveButton");
    //   var idx = document.title.indexOf("*");
    //   if (button) button.disabled = !myDiagram.isModified;
    //   if (myDiagram.isModified) {
    //     if (idx < 0) document.title += "*";
    //   } else {
    //     if (idx >= 0) document.title = document.title.substr(0, idx);
    //   }
    // });

    function nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
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

    function textStyle() {
      return {
        font: "bold 11pt Helvetica, Arial, sans-serif",
        stroke: "whitesmoke"
      };
    }

    myDiagram.nodeTemplateMap.add(
      "", // the default category
      $(
        go.Node,
        "Table",
        nodeStyle(),
        $(
          go.Panel,
          "Auto",
          $(
            go.Shape,
            "Rectangle",
            { fill: "#00A9C9", strokeWidth: 0 },
            new go.Binding("figure", "figure")
          ),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        ),
        makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
        makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Conditional",
      $(
        go.Node,
        "Table",
        nodeStyle(),
        $(
          go.Panel,
          "Auto",
          $(
            go.Shape,
            "Diamond",
            { fill: "#00A9C9", strokeWidth: 0 },
            new go.Binding("figure", "figure")
          ),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        ),
        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Start",
      $(
        go.Node,
        "Table",
        nodeStyle(),
        $(
          go.Panel,
          "Auto",
          $(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            strokeWidth: 0
          }),
          $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
        ),
        makePort("L", go.Spot.Left, go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    myDiagram.nodeTemplateMap.add(
      "End",
      $(
        go.Node,
        "Table",
        nodeStyle(),
        $(
          go.Panel,
          "Auto",
          $(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#DC3C00",
            strokeWidth: 0
          }),
          $(go.TextBlock, "End", textStyle(), new go.Binding("text"))
        ),
        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, go.Spot.Right, false, true)
      )
    );

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

    myDiagram.nodeTemplateMap.add(
      "Comment",
      $(
        go.Node,
        "Auto",
        nodeStyle(),
        $(go.Shape, "File", { fill: "#DEE0A3", strokeWidth: 0 }),
        $(
          go.TextBlock,
          textStyle(),
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: "#454545"
          },
          new go.Binding("text").makeTwoWay()
        )
      )
    );

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

    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null)
        label.visible = e.subject.fromNode.data.category === "Conditional";
    }

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
  
    const nodeTemplateMap = new go.Map();
    nodeTemplateMap.add('activity', activityNodeTemplate);
    nodeTemplateMap.add('event', eventNodeTemplate);
    nodeTemplateMap.add('gateway', gatewayNodeTemplate);
    nodeTemplateMap.add('annotation', annotationNodeTemplate);
    nodeTemplateMap.add('dataobject', dataObjectNodeTemplate);
    nodeTemplateMap.add('datastore', dataStoreNodeTemplate);
    nodeTemplateMap.add('privateProcess', privateProcessNodeTemplate);
  
    const groupTemplateMap = new go.Map();
    groupTemplateMap.add('subprocess', subProcessGroupTemplate);
    groupTemplateMap.add('Lane', swimLanesGroupTemplate);
    groupTemplateMap.add('Pool', poolGroupTemplate);

    const myPaletteLevel1 =
    $(go.Palette,  this.template.querySelector("div[data-id='myPaletteLevel1']"),
      {
        nodeTemplateMap: palNodeTemplateMap,
        groupTemplateMap: palGroupTemplateMap,
        layout: $(go.GridLayout,
          {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            comparer: keyCompare
          })
      });

    const myPaletteLevel2 =
    $(go.Palette,  this.template.querySelector("div[data-id='myPaletteLevel2']"),
      { 
        nodeTemplateMap: palNodeTemplateMap,
        groupTemplateMap: palGroupTemplateMap,
        layout: $(go.GridLayout,
          {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            comparer: keyCompare
          })
      });

    const myPaletteLevel3 =
      $(go.Palette,  this.template.querySelector("div[data-id='myPaletteLevel3']"),
        { 
          nodeTemplateMap: palNodeTemplateMap,
          groupTemplateMap: palGroupTemplateMap,
          layout: $(go.GridLayout,
            {
              cellSize: new go.Size(1, 1),
              spacing: new go.Size(5, 5),
              comparer: keyCompare
            })
        });
  
    (jQuery('.accordion')).accordion({
      activate: function (event, ui) {
        myPaletteLevel1.requestUpdate();
        myPaletteLevel2.requestUpdate();
      }
    });
    
  myPaletteLevel1.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
        ] 
      });
	
  myPaletteLevel2.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
        ]  
      });
      
  myPaletteLevel3.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
        ]  
      }); 
  }

  // save() {
  //   this.template.querySelector("mySavedModel").value = myDiagram.model.toJson();
  //   myDiagram.isModified = false;
  // }
}
