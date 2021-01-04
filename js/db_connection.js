var express = require("express");
var mongodb = require("mongodb");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var db;

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/test", function(err, database) {
  if (err) throw err;

  db = database;

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3000");
});

// Reuse database object in request handlers
/* app.get("/", function(req, res) {
  db.collection("mongo_client_collection").find({}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        console.log(doc);
      }
      else {
        res.end();
      }
    });
  });
}); */
