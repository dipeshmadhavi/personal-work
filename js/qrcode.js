const QRCode = require("qrcode");
const qrCodeData = {
  user_id: "5c596a686c6f690758259e3a",
  location_id: "59255eb31d0db59f42e9b27f",
  msg: "This is test QR code"
};

QRCode.toDataURL(JSON.stringify(qrCodeData), { Type: "svg" }, function(
  err,
  url
) {
  if (err) {
    console.log(err);
  }
  console.log(url);
});
