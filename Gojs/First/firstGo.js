var $ = go.GraphObject.make;
var myDiagram = $(go.Diagram, "myDiagramDiv", {
  "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
  layout: $(go.TreeLayout, { angle: 0, layerSpacing: 30 })
});

myDiagram.linkTemplate = $(
  go.Link,
  { routing: go.Link.Orthogonal, corner: 5 },
  $(go.Shape, { strokeWidth: 3, stroke: "#555" })
); // the link shape

var myModel = $(go.TreeModel);
// in the model data, each node is represented by a JavaScript object:
myModel.nodeDataArray = [
  { key: "Alpha" },
  { key: "Beta", parent: "Alpha" },
  { key: "Cup cake", parent: "Alpha" },
  { key: "Donut", parent: "Cup cake" },
  { key: "Eclair", parent: "Beta" },
  { parent: "Beta" }
];
myDiagram.model = myModel;

var colors = {
  blue: "#00B5CB",
  orange: "#F47321",
  green: "#C8DA2B",
  gray: "#888",
  white: "#F5F5F5"
};

myDiagram.nodeTemplate = $(
  go.Node,
  "Vertical",
  {
    locationSpot: go.Spot.Center
    // background: "#44CCFF"
  },

  new go.Binding("location", "loc"),

  $(
    go.Shape,
    "Circle",
    {
      fill: "lightcoral",
      strokeWidth: 4,
      stroke: colors["gray"],
      width: 60,
      height: 60
    },
    // new go.Binding("figure", "fig")
    new go.Binding("fill", "color")
  ),
  // $(
  //   go.Picture,
  //   { margin: 10, width: 50, height: 50 },
  //   new go.Binding("source")
  // ),
  $(
    go.TextBlock,
    "Default",
    { margin: 12 },

    new go.Binding("text", "key")
  )
);
