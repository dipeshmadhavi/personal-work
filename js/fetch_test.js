
const axios = require('axios');
const fs = require('fs');
const Blob = require('buffer');

const downloadBlob = (token) => {
  axios({
    method: 'post',
    url: 'https://mobilitynodeservices-webapp01.azurewebsites.net/azure/v2/downloadBlobs',
    data: {
      url: 'https://epcfrmstoragenew.blob.core.windows.net/epctest/Banner_11012022.jpg',
    },
    headers: {
      accountname: 'epcfrmstoragenew',
    },
    responseType: 'blob',
  })
    .then(function (response) {
      const data = response.data;
      const blob = new Blob.Blob([data], { type: 'image/jpeg' });
      const file = fs.read(blob)
      // const url = window.URL.createObjectURL(blob);
      console.log(file);
      //   var data = Buffer.from(response.data, 'utf-16');
      //  console.log(data);
      //  const image = 'data:image/jpeg;base64,'+data.toString('base64');
      //  console.log(image);
    })
    .catch(function (error) {
      // setLoading(false);
      console.log('error', error);
      // alert("Server error occured !");
    });
};

downloadBlob();
