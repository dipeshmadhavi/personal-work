const CryptoJS = require("crypto-js");
let key = CryptoJS.enc.Utf8.parse('M@h1ndra$1234567');
let iv = CryptoJS.enc.Utf8.parse('0001000100010001');

doEncrypt = async (plainData) => {
  var encrypted = CryptoJS.AES.encrypt(plainData, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  }).toString();
  // return encrypted;
  console.log(encrypted);
}

doDecrypt = async (encData) => {
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
  console.log(decryptedText);
}

// doEncrypt({  test: 'test'});

doDecrypt("test")