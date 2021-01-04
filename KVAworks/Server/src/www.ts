import * as express from 'express';
import * as bodyParser from 'body-parser';
import { config } from './config/config';

const app = express();
const port = '3000';

app.set('port', port);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, accept-version, source,');
  next();
});

app.listen(port, () => {
  console.log('Listing on port', port);
});

app.get('/api/getdata', (req: express.Request, res: express.Response) => {
  res.send({ result: config.servergroups });
});
