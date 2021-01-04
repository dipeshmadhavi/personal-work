import { IProductModel } from './products.interface';
import { productsSchema } from './products.schema';
import { BaseModel } from '../base.model';

export class ProductModel extends BaseModel<IProductModel> {
  constructor() {
    super(productsSchema);
  }
}

Object.seal(productsSchema);
