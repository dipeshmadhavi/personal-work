import * as Mongoose from 'mongoose';
import { Constants } from './constants';

export class DbConnect {
  static mongooseInstance: any;
  static mongooseConnection: Mongoose.Connection;
  constructor() {
    DbConnect.connect();
  }

  static connect(): Mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;
    this.mongooseConnection = Mongoose.connection;

    this.mongooseConnection.once('open', () => {
      console.log('Connected to mongodb.'); // Constants.DB_CONNECTION_STRING: removed due to security reason
    });

    this.mongooseConnection.on('error', (err) => {
      console.log('Mongoose connection error');
    });
    this.mongooseInstance = Mongoose.connect(
      Constants.MONGO_DB_URL,
      DbConnect.getConnectOptions()
    );

    return this.mongooseInstance;
  }

  static getConnectOptions = () => {
    const connectOptions: Mongoose.ConnectionOptions = {};
    connectOptions.useNewUrlParser = true;
    connectOptions.useCreateIndex = true;
    connectOptions.useFindAndModify = false;
    connectOptions.useUnifiedTopology = true;
    return connectOptions;
  };
}

DbConnect.connect();
