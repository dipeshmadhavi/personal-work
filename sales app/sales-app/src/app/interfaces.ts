export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  retail_price: number;
  description: string;
  category: string;
  brand: string;
  color: string;
  size: string[];
}

export interface BaseResponse {
  status?: string;
  message?: string;
  result?: any;
}
