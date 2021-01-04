import * as express from 'express';
import * as bodyParser from 'body-parser';

import { DbConnect } from './dbconnect';
import { ProductRoutes } from './products/products.routes';

const app = express();
const dbconnect = new DbConnect();
const port = '3000';

app.set('port', port);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, accept-version, source,');
  next();
});
app.use('/', new ProductRoutes().routes);

app.listen(port, () => {
  console.log('Listing on port', port);
});
