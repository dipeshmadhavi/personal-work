import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductInterface, BaseResponse } from './interfaces';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  public selectedProduct: ProductInterface;
  constructor(private readonly http: HttpClient) {}

  createProduct(param: ProductInterface): Observable<BaseResponse> {
    const url = `${environment.APP_BASE_URL}/api/product`;
    return this.http.post<BaseResponse>(url, param);
  }

  getAllProducts(): Observable<BaseResponse> {
    const url = `${environment.APP_BASE_URL}/api/product/all`;
    return this.http.post<BaseResponse>(url, this.httpOptions);
  }

  deleteProduct(param): Observable<any> {
    const url = `${environment.APP_BASE_URL}/api/product/delete`;
    return this.http.post<any>(url, param);
  }

  updateProduct(param: ProductInterface): Observable<any> {
    const url = `${environment.APP_BASE_URL}/api/product/update`;
    return this.http.post<any>(url, param);
  }

  getProducts(param): Observable<any> {
    const url = `${environment.APP_BASE_URL}/api/product/getproducts`;
    return this.http.post<any>(url, param);
  }

  getStreamData() {
    const url = `${environment.APP_BASE_URL}/gettimeoutdata`;
    return this.http.get<any>(url);
  }
}
