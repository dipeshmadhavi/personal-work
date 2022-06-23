const data = [];
const newData = [];

const fetch = require('node-fetch');
let fs = require("fs");
const converter = require("json-2-csv");
// const myHeaders = new Headers();

// myHeaders.append("x-city", "New%20Delhi");
// myHeaders.append("Cookie", "VISITOR-ID=1545a528-9caf-4ec6-ce0a-c7c7982463d7_acce55_1637649595; _csrf=1LnRlXT3JQWc-XsFNLsFJOna");

var requestOptions = {
  method: 'GET',
  headers: {
    "x-city": "New%20Delhi",
  },
  redirect: 'follow'
};
const start = 1;
const end = 144;
const prefix = 'z';
for(i=start; i <= end; i++) {
fetch(`https://www.1mg.com/pwa-api/api/v4/drug_skus/by_prefix?prefix_term=${prefix}&page=${i}&per_page=50`, requestOptions)
  .then(response => response.text())
  .then(result => {
    const data = JSON.parse(result)
    data.data.skus.forEach((elem) => {
      const product = {
        id: elem.id,
        name: elem.name,
        price: elem.price,
        available: elem.available ? 1 : 0,
        images: elem.image_url.replace('a_ignore,w_380,h_380,c_fit,q_auto,f_auto/', ''),
        type: elem.type,
        manufacturer_name: elem.manufacturer_name,
      };
      newData.push(product);
    });
    if(newData.length === 7165) {
      converter.json2csv(newData, (err, csv) => {
        if (err) {
          throw err;
        }
        fs.writeFile("z.csv", csv, (err) => {
          if (err) throw err;
          console.log("File created");
        });
      });
    }
  })
  .catch(error => {
    console.log('error', error)
  });
}

