const Crypto = require("crypto");

  const payloadAsString = {
    verification: {
      callback: 'https://veriff.com',
      person: { firstName: 'John', lastName: 'Smith' },
      document: { type: 'PASSPORT', country: 'EE' },
      vendorData: '11111111',
      timestamp: '2016-05-19T08:30:25.597Z',
    },
  };
const apiPrivateKey = 'cf572fd0-c58d-42f0-beed-febaef8267a3'

  const signature = Crypto
  .createHmac('sha256', apiPrivateKey)
  .update(Buffer.from(JSON.stringify(payloadAsString, 'utf8')))
  .digest('hex')
  .toLowerCase();

console.log(signature);