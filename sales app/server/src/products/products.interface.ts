import * as mongoose from 'mongoose';

export interface IProductModel extends mongoose.Document {
  name: string;
  price: number;
  retail_price: number;
  description: string;
  category: string;
  brand: string;
  color: string;
  size: string[];
}
