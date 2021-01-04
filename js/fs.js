let fs = require("fs");

fs.createReadStream("textfile.txt")
  .on("data", function (chunk) {
    console.log(chunk.toString());
  })
  // this will fire if the file is not there
  .on("error", function (err) {
    console.log(err);
  });
