let fs = require("fs");
let fetch = require('node-fetch')
let data = require('./data')
// fs.createReadStream("textfile.txt")
//   .on("data", function (chunk) {
//     console.log(chunk.toString());
//   })
//   // this will fire if the file is not there
//   .on("error", function (err) {
//     console.log(err);
//   });
let body = {
  startDate: '2021-08-13',
  endDate: '2021-08-30',
  presentInPremises: 'false',
  noOfWheelsMaster: { id: '2' },
  parkingStationMaster: { id: 0 },
};
let Headers = {
  Authorization:
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTAwODExNyIsImlhdCI6MTYxODAzMzI0MiwiZXhwIjoxNjI0MDMzMjQyfQ.Khm6aRBEQeSDLrcVJMufzbblxaZSndwH6DTl3Q8kEp8',
};
try {
  fs.writeFileSync('./download.xlsx', data.toString(), () => {})

// fetch('https://mapps.mahindra.com/ParkingManagement/pms/dateWise/EmpAndVisitorData/excel', {
//   body,
//   Headers,
//   method: 'post',
// }).then((data) => data.buffer())
//   .then((data) => {
//     fs.writeFileSync('./download.xlsx', data, () => {})
//     // console.log(URL.createObjectURL(JSON.stringify(data)));
//   });
} catch (error) {
  console.log(error);
}