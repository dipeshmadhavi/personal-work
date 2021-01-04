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
    router.post('/api/product', controller.create);
    router.put('/api/product', controller.update);
    router.post('/api/product/delete', controller.delete);
    router.post('/api/product/all', controller.retrieve);
    router.post('/api/product/update', controller.update);
    router.post('/api/product/getproducts', controller.getProducts);

    return router;
  }
}

Object.seal(ProductRoutes);
