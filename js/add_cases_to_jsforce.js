const jsforce = require("jsforce");
const _ = require("lodash");

// const username = "ravi937611@gmail.com";
// const password = "Ravi9376LMlUR9SCgZpoMDOKNiBXkhKu";
// const conn = new jsforce.Connection({
//   loginUrl: "https://login.salesforce.com/"
// });

const newCase = {
  Status: "New",
  Origin: "Web",
  Subject: "Rezility help request #13",
  Type: "Health"
};

const newContact = {
  FirstName: "Seema",
  LastName: "Salunkhe",
  Phone: ""
};

conn.login(username, password, function(err, result) {
  if (err) {
    return console.error(err);
  }

  conn.sobject("Contact").create(newContact, function(err, res) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Contact Created");
  });
});
