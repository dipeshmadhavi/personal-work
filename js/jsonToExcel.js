var fs = require("fs");

const converter = require("json-2-csv");

// declare a JSON array
const todos = [
  {
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  {
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
  },
  {
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
  },
];

// convert JSON array to CSV string
converter.json2csv(todos, (err, csv) => {
  if (err) {
    throw err;
  }
  fs.writeFile("todos.csv", csv, (err) => {
    if (err) throw err;
    console.log("File created");
  });
});
