const moment = require("moment");
// const today = new Date();
// const yesterday = new Date();
// const dayBeforeYesterday = new Date();
// yesterday.setDate(today.getDate() - 1);
// dayBeforeYesterday.setDate(today.getDate() - 2);
// console.log("Today ==>", today);
// console.log("yesterday", yesterday);
// console.log("dayBeforeYesterday ==>", dayBeforeYesterday);

// const first_date = "2019-06-20T09:01:27.719Z";
// const second_date = "2019-06-20T04:30:42.000Z";

// if( first_date > second_date) {
//   console.log("Greter");
// } else {
//   console.log("Small")
// }

const date = moment("01/01/91", "MM-DD-YYYY");
console.log(moment(date).format());
