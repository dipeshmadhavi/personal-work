function getSwitch(start) {
  switch (start) {
    case "first":
    case "second":
    case "third":
    case "forth": {
      console.log("here 4th");
      return;
    }
    case "fifth": {
      console.log("here 5th");
      return;
    }
  }

  console.log("Then here");
}

getSwitch("six");
getSwitch("seven");
getSwitch("eight");
getSwitch("nine");
getSwitch("fifth");
