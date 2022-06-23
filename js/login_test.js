const CryptoJS = require('crypto-js')

const encrypt = (username, password) => {
  try {
    let str = 'usr=' + username + '===pwd=' + password;
    console.log(str);
    var key = CryptoJS.enc.Utf8.parse('M@h1ndra$1234567');
    var iv = CryptoJS.enc.Utf8.parse('0001000100010001');
    var encrypted = CryptoJS.AES.encrypt(str, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return encrypted;
  } catch (error) {
    console.log(error);
  }
};

console.log(encrypt('jadhpu-cont@mahindra.com', 'Say&Raj@0824'));
// axios.post('https://mapps.mahindra.com/OAuthEPMobile/client/tokenRequest', {
//   tokenid: token,
// });
