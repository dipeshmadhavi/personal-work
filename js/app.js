var gplay = require('google-play-scraper');
var store = require('app-store-scraper');

// gplay
// .app({ appId: "com.enterprise.rezility" })
// .then(function(result) => {
//   console.log(JSON.stringify(result))
// })
//   .catch(console.log());

gplay.app({ appId: 'com.enterprise.rezility' }).then(console.log, console.log);

// store
//   .app({ appId: 'com.enterprise.rezility' })
//   .then(console.log)
//   .catch(console.log);
