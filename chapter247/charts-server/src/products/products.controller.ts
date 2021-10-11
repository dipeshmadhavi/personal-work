import { Request, Response } from 'express';
import { GraphData } from '../../data'

export class ProductsController {

  constructor() {
  }
  getGraphData = (req: Request, res: Response) => {
    try {
      const result = {
        populationData: GraphData.populationData,
        areaData1: GraphData.areaData1,
        areaData2: GraphData.areaData2,
      }
      res.send(result)
    } catch (error) {
      res.send({
        status: "ERROR",
        error: error.message,
      })
    }
  }
}
