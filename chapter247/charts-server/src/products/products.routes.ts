import { Router } from 'express';
import { ProductsController } from './products.controller';

export class ProductRoutes {
  private _productsController: ProductsController;
  private _router: Router;

  constructor() {
    this._productsController = new ProductsController();
    this._router = Router();
  }

  get routes() {
    const router = this._router;
    const controller = this._productsController;
    router.get('/getgraphdata', controller.getGraphData);

    return router;
  }
}

Object.seal(ProductRoutes);
