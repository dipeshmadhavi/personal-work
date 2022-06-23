const CryptoJS = require("crypto-js");
const Moment = require('moment');
let key = CryptoJS.enc.Utf8.parse('M@h1ndra$1234567');
let iv = CryptoJS.enc.Utf8.parse('0001000100010001');
// const key = CryptoJS.enc.Utf8.parse(Moment().format("DDMMYYYY"));
// const iv = CryptoJS.enc.Utf8.parse(Moment().format("YYYYMMDD"));

doEncrypt = (plainData) => {
  var encrypted = CryptoJS.AES.encrypt(plainData, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  }).toString();
  // return encrypted;
  console.log(encrypted);
}

doDecrypt = (encData) => {
  let decryptedBytes;
  let decryptedText;
  decryptedBytes = CryptoJS.AES.decrypt(encData, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  // return decryptedText
  const data = JSON.parse(decryptedText);
  console.log(data);
}

doDecrypt("B3PkiXUsOCsgrIGga6Fp9Q==");
// doEncrypt("AFS-KM===Rise@123");


