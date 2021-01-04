import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductInterface } from '../interfaces';
import { Constants } from '../app.constants';
import { Router } from '@angular/router';
// import EventSource from 'eventsource';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
  public products: ProductInterface[] = [];

  public productList: { name: string; value: string }[] = Constants.PRODUCT_HEADERS;
  public perPage: number;
  public pageNumber: number;
  public total: number;
  public streamData;
  public index;

  constructor(private readonly productService: ProductService, private readonly router: Router) {}

  ngOnInit() {
    this.pageNumber = 1;
    this.perPage = 10;
    this.getStreamData();
  }

  getProducts() {
    const params = {
      pageNumber: this.pageNumber,
      perPage: this.perPage,
    };
    this.productService.getProducts(params).subscribe((res: any) => {
      if (res.status === Constants.STATUS_SUCCESS) {
        this.products = res.result;
        this.total = res.total;
        this.products = res.products;
      } else {
        alert(res.message.message);
      }
    });
  }

  updateProduct(product: ProductInterface) {
    this.productService.selectedProduct = product;
    this.router.navigateByUrl('add-product');
  }

  deleteProduct(_id: string) {
    this.productService.deleteProduct({ _id }).subscribe((res) => {
      if (res.status === Constants.STATUS_SUCCESS) {
        this.getProducts();
      } else {
        alert(res.message.message);
      }
    });
  }

  public prev() {
    this.pageNumber--;
    this.getProducts();
  }
  public next() {
    this.pageNumber++;
    this.getProducts();
  }

  async getStreamData() {
    // this.productService.getStreamData().subscribe((event) => {
    //   this.streamData = event;
    // });
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/event-stream');
    const requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch('http://localhost:3000/home', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.streamData = result;
      })
      .catch((error) => console.log('error', error));
    // for (let index = 0; index < 10; index++) {
    //   this.index = index;
    //   await this.setTime();
    // }
    // const es = new EventSource('http://localhost:3000/home');
    // es.onmessage = (event) => {
    //   this.streamData = event.data;
    //   es.close();
    // };
  }

  setTime() {
    return new Promise((resolve) => {
      setInterval(() => {
        resolve();
      }, 500);
    });
  }
}
