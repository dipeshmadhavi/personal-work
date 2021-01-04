const jsforce = require("jsforce");
const express = require("express");

var conn = new jsforce.Connection({
  oauth2: {
    clientId:
      "3MVG9pe2TCoA1Pf4BNBKwx8Xf_b8Jtbd5E0kTJJZM4ef2QhGSFJQT6PhXpOcVmBLwCAAPMOMd2PRTTZDSctFZ",
    clientSecret:
      "B739952B5141C05703C0C460526BCD26EB1159CF767C7993CE2F9B091C8A471A",
    redirectUri: "https://ap8.salesforce.com"
  },
  instanceUrl: "https://login.salesforce.com/",
  accessToken:
    "6Cel800D0o000001QysB8880o000001RyNZ85GWgWXW6WCyTveH4NMqgwf3w6kFIfGmI5lkQeCqtXFJUZ3MOifDq7zBXjqW89EpQmkzNDC7",
  refreshToken:
    "6Cel800D0o000001QysB8880o000001RyNZKsnfsX9O11RpP5gvq0MAFbTMXtL1ZOdrHh1bvy8kQIVZtpCjwxldh3rmPhZMthIRW2saEPer"
});
conn.on("refresh", function(refreshToken, res) {
  console.log("logged in");
});
