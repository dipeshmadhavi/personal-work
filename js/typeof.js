const mongo = require("mongodb");
const newObj = {
  name: "jane",
  age: 25
};
const _id = new mongo.ObjectId("595e4037e34d361f50c3422e");
// console.log(typeof _id);
// if (!Array.isArray(newObj)) {
//   console.log(newObj);
// }

if (typeof newObj === typeof _id) {
  console.log("same");
} else {
  console.log("diffrent");
}
