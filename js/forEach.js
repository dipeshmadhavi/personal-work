const words = ["one", "two", "three", "four"];

function logArrayElements(element, index, array) {
  log(element);
}

function log(elem) {
  console.log(elem);
}
words.forEach(logArrayElements);
