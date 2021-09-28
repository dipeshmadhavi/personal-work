// const qrcode = require('qrcode-generator')

// var typeNumber = 1;
// var errorCorrectionLevel = 'L';
// var qr = qrcode(typeNumber, errorCorrectionLevel);
// qr.addData('22134_MH12KO4521');
// qr.make();
// console.log(qr.createImgTag());
const QRCode = require('qrcode');
const base64 = require('base64topdf');
const btoa = require('btoa');
const fs = require('fs');
const jspdf = require('jspdf');

QRCode.toDataURL('47794078_MH43AP2985').then((url) => {
  const pdf = new jspdf.jsPDF();
  pdf.addImage(url, 'png', 0, 0, 100, 100);
  pdf.save('generated.pdf');
});
