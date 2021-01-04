import * as mongoose from 'mongoose';
import { ProductModel } from './products.model';
import { IProductModel } from './products.interface';

export class ProductModule {
  private _productModel: ProductModel;

  constructor() {
    this._productModel = new ProductModel();
  }

  async create(item: IProductModel) {
    return await this._productModel.create(item);
  }

  async retrieve(cond: Object) {
    return await this._productModel.retrieve(cond);
  }

  async update(_id: mongoose.Types.ObjectId, item: IProductModel) {
    return await this._productModel.update(_id, item);
  }

  async updateWithOptions(cond: Object, fields: Object, options: Object) {
    return await this._productModel.updateWithOptions(cond, fields, options);
  }

  async delete(_id: string) {
    return await this._productModel.delete(_id);
  }

  async findById(_id: string) {
    return await this._productModel.findById(_id);
  }

  async findByIdAndUpdate(_id: string, update: Object) {
    return await this._productModel.findByIdAndUpdate(_id, update);
  }

  async aggregate(cond: any[]) {
    return await this._productModel.aggregate(cond);
  }
}

Object.seal(ProductModule);
