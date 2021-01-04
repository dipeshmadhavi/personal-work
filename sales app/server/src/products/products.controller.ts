import { Request, Response } from 'express';
import { ProductModule } from './products.module';
import { IProductModel } from './products.interface';
import { Constants } from '../constants';

export class ProductsController {
  private _productModule: ProductModule;

  constructor() {
    this._productModule = new ProductModule();
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const product: IProductModel = req.body;
      const productResult = await this._productModule.create(product);
      const jsonData = {
        result: productResult,
        status: Constants.STATUS_SUCCESS,
      };
      res.send(jsonData);
    } catch (error) {
      res.send({
        status: Constants.STATUS_ERROR,
        message: error,
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product: IProductModel = req.body;
      const result = await this._productModule.update(product._id, product);
      const jsonData = {
        result,
        status: Constants.STATUS_SUCCESS,
      };
      res.send(jsonData);
    } catch (error) {
      res.send({
        status: Constants.STATUS_ERROR,
        message: error,
      });
    }
  };

  public retrieve = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this._productModule.retrieve({});
      const jsonData = {
        result: product,
        status: Constants.STATUS_SUCCESS,
      };
      res.send(jsonData);
    } catch (error) {
      res.send({
        status: Constants.STATUS_ERROR,
        message: error,
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const product_id: string = req.body._id;
      await this._productModule.delete(product_id);
      const jsonData = {
        status: Constants.STATUS_SUCCESS,
      };
      res.send(jsonData);
    } catch (error) {
      res.send({
        status: Constants.STATUS_ERROR,
        message: error,
      });
    }
  };

  public getProducts = async (req: Request, res: Response) => {
    try {
      const pageNumber = req.body.pageNumber || 1;
      const perPage = req.body.perPage || 10;
      const productsQuery = this.getProductsQuery(pageNumber, perPage);
      const productsResult: any = await this._productModule.aggregate(productsQuery);
      const jsonData = {
        pageNumber,
        perPage,
        total: productsResult[0].total[0].total,
        products: productsResult[0].products,
        status: Constants.STATUS_SUCCESS,
      };
      res.send(jsonData);
    } catch (error) {
      res.send({
        status: Constants.STATUS_ERROR,
        message: error,
      });
    }
  };

  private getProductsQuery(pageNumber, perPage) {
    return [
      [
        {
          $facet: {
            total: [
              {
                $count: 'total',
              },
            ],
            products: [
              {
                $sort: { _id: -1 },
              },
              {
                $skip: perPage * (pageNumber - 1),
              },
              {
                $limit: perPage,
              },
            ],
          },
        },
      ],
    ];
  }
}
