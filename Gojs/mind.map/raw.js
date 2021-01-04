function init() {
  if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDiagramDiv", {
    // when the user drags a node, also move/copy/delete the whole subtree starting with that node
    "commandHandler.copiesTree": true,
    "commandHandler.copiesParentKey": true,
    "commandHandler.deletesTree": true,
    "draggingTool.dragsTree": true,
    "undoManager.isEnabled": true
  });
  // when the document is modified, add a "*" to the title and enable the "Save" button
  myDiagram.addDiagramListener("Modified", function(e) {
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });
  // a node consists of some text with a line shape underneath
  myDiagram.nodeTemplate = $(
    go.Node,
    "Vertical",
    { selectionObjectName: "TEXT" },
    $(
      go.TextBlock,
      {
        name: "TEXT",
        minSize: new go.Size(30, 15),
        editable: true
      },
      // remember not only the text string but the scale and the font in the node data
      new go.Binding("text", "text").makeTwoWay(),
      new go.Binding("scale", "scale").makeTwoWay(),
      new go.Binding("font", "font").makeTwoWay()
    ),
    $(
      go.Shape,
      "LineH",
      {
        stretch: go.GraphObject.Horizontal,
        strokeWidth: 3,
        height: 3,
        // this line shape is the port -- what links connect with
        portId: "",
        fromSpot: go.Spot.LeftRightSides,
        toSpot: go.Spot.LeftRightSides
      },
      new go.Binding("stroke", "brush"),
      // make sure links come in from the proper direction and go out appropriately
      new go.Binding("fromSpot", "dir", function(d) {
        return spotConverter(d, true);
      }),
      new go.Binding("toSpot", "dir", function(d) {
        return spotConverter(d, false);
      })
    ),
    // remember the locations of each node in the node data
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // make sure text "grows" in the desired direction
    new go.Binding("locationSpot", "dir", function(d) {
      return spotConverter(d, false);
    })
  );
  // selected nodes show a button for adding children
  myDiagram.nodeTemplate.selectionAdornmentTemplate = $(
    go.Adornment,
    "Spot",
    $(
      go.Panel,
      "Auto",
      // this Adornment has a rectangular blue Shape around the selected node
      $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
      $(go.Placeholder, { margin: new go.Margin(4, 4, 0, 4) })
    ),
    // and this Adornment has a Button to the right of the selected node
    $(
      "Button",
      {
        alignment: go.Spot.Right,
        alignmentFocus: go.Spot.Left,
        click: addNodeAndLink // define click behavior for this Button in the Adornment
      },
      $(
        go.TextBlock,
        "+", // the Button content
        { font: "bold 8pt sans-serif" }
      )
    )
  );
  // a link is just a Bezier-curved line of the same color as the node to which it is connected
  myDiagram.linkTemplate = $(
    go.Link,
    {
      curve: go.Link.Bezier,
      fromShortLength: -2,
      toShortLength: -2,
      selectable: false
    },
    $(
      go.Shape,
      { strokeWidth: 3 },
      new go.Binding("stroke", "toNode", function(n) {
        if (n.data.brush) return n.data.brush;
        return "black";
      }).ofObject()
    )
  );

  myDiagram.addDiagramListener("SelectionMoved", function(e) {
    var rootX = myDiagram.findNodeForKey(0).location.x;
    myDiagram.selection.each(function(node) {
      if (node.data.parent !== 0) return; // Only consider nodes connected to the root
      var nodeX = node.location.x;
      if (rootX < nodeX && node.data.dir !== "right") {
        updateNodeDirection(node, "right");
      } else if (rootX > nodeX && node.data.dir !== "left") {
        updateNodeDirection(node, "left");
      }
      layoutTree(node);
    });
  });
  // read in the predefined graph using the JSON format data held in the "mySavedModel" textarea
  load();
}
function spotConverter(dir, from) {
  if (dir === "left") {
    return from ? go.Spot.Left : go.Spot.Right;
  } else {
    return from ? go.Spot.Right : go.Spot.Left;
  }
}

function updateNodeDirection(node, dir) {
  myDiagram.model.setDataProperty(node.data, "dir", dir);
  // recursively update the direction of the child nodes
  var chl = node.findTreeChildrenNodes(); // gives us an iterator of the child nodes related to this particular node
  while (chl.next()) {
    updateNodeDirection(chl.value, dir);
  }
}
function addNodeAndLink(e, obj) {
  var adorn = obj.part;
  var diagram = adorn.diagram;
  diagram.startTransaction("Add Node");
  var oldnode = adorn.adornedPart;
  var olddata = oldnode.data;
  // copy the brush and direction to the new node data
  var newdata = {
    text: "idea",
    brush: olddata.brush,
    dir: olddata.dir,
    parent: olddata.key
  };
  diagram.model.addNodeData(newdata);
  layoutTree(oldnode);
  diagram.commitTransaction("Add Node");
  // if the new node is off-screen, scroll the diagram to show the new node
  var newnode = diagram.findNodeForData(newdata);
  if (newnode !== null) diagram.scrollToRect(newnode.actualBounds);
}
function layoutTree(node) {
  if (node.data.key === 0) {
    // adding to the root?
    layoutAll(); // lay out everything
  } else {
    // otherwise lay out only the subtree starting at this parent node
    var parts = node.findTreeParts();
    layoutAngle(parts, node.data.dir === "left" ? 180 : 0);
  }
}
function layoutAngle(parts, angle) {
  var layout = go.GraphObject.make(go.TreeLayout, {
    angle: angle,
    arrangement: go.TreeLayout.ArrangementFixedRoots,
    nodeSpacing: 5,
    layerSpacing: 20,
    setsPortSpot: false, // don't set port spots since we're managing them with our spotConverter function
    setsChildPortSpot: false
  });
  layout.doLayout(parts);
}
function layoutAll() {
  var root = myDiagram.findNodeForKey(0);
  if (root === null) return;
  myDiagram.startTransaction("Layout");
  // split the nodes and links into two collections
  var rightward = new go.Set(/*go.Part*/);
  var leftward = new go.Set(/*go.Part*/);
  root.findLinksConnected().each(function(link) {
    var child = link.toNode;
    if (child.data.dir === "left") {
      leftward.add(root); // the root node is in both collections
      leftward.add(link);
      leftward.addAll(child.findTreeParts());
    } else {
      rightward.add(root); // the root node is in both collections
      rightward.add(link);
      rightward.addAll(child.findTreeParts());
    }
  });
  // do one layout and then the other without moving the shared root node
  layoutAngle(rightward, 0);
  layoutAngle(leftward, 180);
  myDiagram.commitTransaction("Layout");
}
// Show the diagram's model in JSON format
function save() {
  document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}
function load() {
  myDiagram.model = go.Model.fromJson(
    document.getElementById("mySavedModel").value
  );
}
