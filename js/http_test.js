const http = require('https')
// function downLoadFile(name) {
//   const downloadURL = config.newBaseUrl + 'azure/v2/downloadBlobs';
//   let fileName = name;
//   name =
//     'https://' +
//     config.accountName +
//     '.blob.core.windows.net/documentfiles/' +
//     name;

//   const params = {
//     url: name,
//   };

//   http
//     .post(downloadURL, params, {
//       headers: new HttpHeaders({ accountname: config.accountName }),
//       responseType: 'blob',
//     })
//     .subscribe((data) => {
//       console.log(data);
//       const blob = new Blob([data], { type: 'image/jpeg' });
//       const url = window.URL.createObjectURL(blob);

//       // this.downLoadFiles(
//       //   data,
//       //   fileName,
//       //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       // );
//     });
// }

// function downLoadFiles(data, downloadFileName, type) {
//   const blob = new Blob([data], { type });
//   const url = window.URL.createObjectURL(blob);
//   const element = document.createElement('a');
//   element.href = url;
//   element.download = downloadFileName;
//   document.body.appendChild(element);
//   element.click();
// }

http.request('https://mobilitynodeservices-webapp01.azurewebsites.net/azure/v2/downloadBlobs',
{
  method: 'POST',
  body: {
    url: 'https://epcfrmstoragenew.blob.core.windows.net/epctest/Banner_11012022.jpg',
  },
  headers: { accountname: 'epcfrmstoragenew', },
  responseType: 'blob',
}, (data) => {
  console.log(data);
  const blob = new Blob([data], { type: 'image/jpeg' });
  const url = window.URL.createObjectURL(blob);
  console.log(url);

  // this.downLoadFiles(
  //   data,
  //   fileName,
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  // );
});