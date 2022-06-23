var gplay = require('google-play-scraper');
var store = require('app-store-scraper');

// gplay
// .app({ appId: "com.enterprise.rezility" })
// .then(function(result) => {
//   console.log(JSON.stringify(result))
// })
//   .catch(console.log());

// gplay.app({ appId: 'com.mahindra.mkisan' }).then(console.log, console.log);
gplay.app({appId: 'com.mahindra.mkisan'})
  .then((data) => {
    console.log(data);
  }).catch((e) => {
    console.log(e);
  });

// store
//   .app({ appId: 'com.enterprise.rezility' })
//   .then(console.log)
//   .catch(console.log);
