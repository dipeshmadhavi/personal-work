const express = require('express')
const bodyParser =  require('body-parser');
// import express from 'express';
// import { uploadBlob, downloadBlob } from './first-blob'
const BLOB = require('./first-blob')
const app = express()
const port = 3001

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, accept-version, source,');
  next();
});

app.post('/upload', (req, res) => {
  console.log(req.body);
  // res.send('Hello World!')
  // uploadBlob(req.body)
  res.send('Done')
})

app.get('/image', (req, res) => {
  const result = BLOB.downloadBlob();
  res.send({data: result})
})

