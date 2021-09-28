const fetch = require('node-fetch');
fetch('https://azure-storage.herokuapp.com/azure/getBlob', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    // containername: 'testupload',
    accountname: 'dipeshmahindra',
    accountkey: 's7qx81uEIMvES9d9ke3oIYWnaTZe9mjhbkGl1PIXegSS1LxpFzbfe0mazaKggkY4HqwnSAMffV9PixQkdJg5NA==',
  },
  body: JSON.stringify({
    containerName: 'testupload',
  }),
})
  .then((res) => res.json())
  .then((body) => {
    console.log(body);
  })
  .catch((err) => {
    console.log(err);
  });
