import * as mongoose from 'mongoose';

export class BaseModel<T extends mongoose.Document> {
  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  private toObjectId = (_id: string): mongoose.Types.ObjectId => {
    return mongoose.Types.ObjectId(_id);
  };

  async create(item: T) {
    return await this._model.create(item);
  }

  async retrieve(cond: Object) {
    return await this._model.find(cond);
  }

  async update(_id: mongoose.Types.ObjectId, item: T) {
    return await this._model.update({ _id }, item);
  }

  async updateWithOptions(cond: Object, fields: Object, options: Object) {
    return await this._model.update(cond, fields, options);
  }

  async delete(_id: string) {
    return await this._model.deleteOne({ _id: this.toObjectId(_id) });
  }

  async findById(_id: string) {
    return await this._model.findById(_id);
  }

  async findByIdAndUpdate(_id: string, update: Object) {
    return await this._model.findByIdAndUpdate(_id, update, { new: true });
  }

  async aggregate(cond: any[]) {
    return await this._model.aggregate(cond);
  }
}
