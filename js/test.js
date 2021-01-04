/* function greeting(name) {
  console.log("Hello " + name);
}

function processUserInput(callback) {
  var name = "Jack";
  if (name) {
    callback(name);
  } else {
    callback("Jill");
  }
}

processUserInput(greeting);
 */
function add(a, b) {
  console.log(a + b);
}
function sub(a, b) {
  console.log(a - b);
}

function calc(num1, num2, callback) {
  callback(num1, num2);
}

calc(5, 7, add);
calc(7, 5, sub);
