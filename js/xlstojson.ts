 const node_xj = require("xls-to-json");
// import * as node_xj from "xls-to-json";
  node_xj({
    input: "test_record.xlsx",  // input xls
    output: "output.json", // output json
    sheet: "Sheet1",  // specific sheetname
    rowsToSkip: 5 // number of rows to skip at the top of the sheet; defaults to 0
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(JSON.stringify(result));
    }
  });