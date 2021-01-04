let jsforce = require("jsforce");
const username = "ravi937611@gmail.com";
const password = "Ravi9376LMlUR9SCgZpoMDOKNiBXkhKu";
let conn = new jsforce.Connection({
  loginUrl: "https://login.salesforce.com"
});

conn.login(username, password, function(err, userInfo) {
  if (err) {
    return console.error(err);
  }
  console.log("accessToken :", conn.accessToken);
  console.log("instanceUrl :", conn.instanceUrl);
  console.log("refreshToken :", conn.refreshToken);
  console.log("clientId :", conn.clientId);
  console.log("clientSecret :", conn.clientSecret);
  console.log("redirectUri :", conn.redirectUri);
  // logged in user property
  /* conn
    .sobject("Case")
    .select("Id")
    .limit(5)
    .execute((err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(JSON.stringify(result)); */
  // console.log("total : " + result.totalSize);
  // console.log("fetched : " + result.records.length);
  // for(let data of result.records){
  //   console.log(data.Id ,' ', data.Name);
  // }
});
