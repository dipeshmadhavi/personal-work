const async = require("async");
var counter = 2000;

async.eachSeries(
  new Array(counter),
  (item, cb) => {
    async.parallel(
      [
        pCb => {
          console.log(counter--);
          async.setImmediate(pCb);
        }
      ],
      cb()
    );
  },
  () => console.log("done")
);
