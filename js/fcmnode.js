var FCM = require("fcm-node");
var serverKey =
  "AAAA7NUe7rY:APA91bEqt-Qoscafw3cRprZTb-LTAndmz3n76g6OWORg-y0-qPHIcHIiDisVOHDkbR3BRCTTCVZMslEc1pjqlfXjpFcoX0hNhVratLqAYWuPwsJiBqkdXjJ2_9nx4GXNdmVeOhQAlp5-"; //put your server key here
var fcm = new FCM(serverKey);
const notificationId = new Date().getTime();

// var message = {
//   //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//   to: "registration_token",
//   collapse_key: "your_collapse_key",

//   notification: {
//     title: "Title of your push notification",
//     body: "Body of your push notification"
//   },

//   data: {
//     //you can send only notification or only data(or include both)
//     my_key: "my value",
//     my_another_key: "my another value"
//   }
// };
var message = {
  registration_ids: "web-dev-admin1",
  data: {
    notificationId,
    expiry: Math.floor(Date.now() / 1000) + 3600,
    icon: "",
    color: "black",
    source: "Test"
    // badge:'1',
  },
  priority: "high",
  content_available: true
};

fcm.send(message, function(err, response) {
  if (err) {
    console.log("Something has gone wrong!");
  } else {
    console.log("Successfully sent with response: ", response);
  }
});
