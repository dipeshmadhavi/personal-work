import { IProductModel } from './products.interface';
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
class ProductsSchema {
  static get schema() {
    const schema = new Schema({
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      retail_price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      category: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: [String],
        required: true,
        enum: ['Small', 'Medium', 'Large'],
      },
      created_at: {
        type: Number,
        default: new Date(),
      },
      updated_at: {
        type: Number,
        default: new Date(),
      },
    });
    return schema;
  }
}

export const productsSchema = mongoose.model<IProductModel>(
  'Products',
  ProductsSchema.schema
);
