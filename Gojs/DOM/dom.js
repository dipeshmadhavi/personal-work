var names = {}; // hash to keep track of what names have been used

function init() {
  if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDiagramDiv", {
    initialAutoScale: go.Diagram.UniformToFill,
    layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 })
  });

  myDiagram.linkTemplate = $(go.Link, { selectable: false }, $(go.Shape)); // the link shape

  // Define a simple node template consisting of text followed by an expand/collapse button
  myDiagram.nodeTemplate = $(
    go.Node,
    "Horizontal",
    { selectionChanged: nodeSelectionChanged }, // this event handler is defined below
    $(
      go.Panel,
      "Auto",
      $(go.Shape, { fill: "#1F4963", stroke: null }),
      $(
        go.TextBlock,
        {
          font: "bold 13px Helvetica, bold Arial, sans-serif",
          stroke: "white",
          margin: 3
        },
        new go.Binding("text", "key")
      )
    ),
    $("TreeExpanderButton")
  );

  // create the model for the DOM tree
  myDiagram.model = $(go.TreeModel, {
    isReadOnly: true, // don't allow the user to delete or copy nodes
    // build up the tree in an Array of node data
    nodeDataArray: traverseDom(document.activeElement)
  });
}

function traverseDom(node, parentName, dataArray) {
  if (parentName === undefined) {
    parentName = null;
  }
  if (dataArray === undefined) {
    dataArray = [];
  }
  if (!(node instanceof Element)) {
    return;
  }
  if (node.id === "navindex" || node.id === "navtop") {
    return;
  }
  var name = getName(node);
  var data = { key: name, name: name };
  dataArray.push(data);
  if (parentName !== null) {
    data.parent = parentName;
  }
  var l = node.childNodes.length;
  for (var i = 0; i < l; i++) {
    traverseDom(node.childNodes[i], name, dataArray);
  }
  return dataArray;
}

function getName(node) {
  var n = node.nodeName;
  if (node.id) {
    n = n + " (" + node.id + ")";
  }
  var namenum = n; // make sure the name is unique
  var i = 1;
  while (names[namenum] !== undefined) {
    namenum = n + i;
    i++;
  }
  names[namenum] = node;
  return namenum;
}

function nodeSelectionChanged(node) {
  if (node.isSelected) {
    names[node.data.name].style.backgroundColor = "lightblue";
  } else {
    names[node.data.name].style.backgroundColor = "";
  }
}
