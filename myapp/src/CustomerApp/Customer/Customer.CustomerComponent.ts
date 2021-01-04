import { Component, Injector, OnInit } from '@angular/core';
import { Customer } from './Customer.Customer';
import { BaseLogger } from '../Utility/Utility.Loggre';
import { GradePipes } from '../Utility/Utility.GradePipes';
import { Http } from '@angular/http';
import { Subscriber } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenInterceptor } from '../Utility/Utility.token.interceptor';
import { Response } from 'selenium-webdriver/http';
import { stringify } from '@angular/compiler/src/util';

@Component({
  templateUrl: './Customer.Customer.html',
  styleUrls: ['./Customer.CustomerStyle.scss']
})
export class CustomerComponent {
  title = 'CustomerApp';
  // The text UI controls
  customerObj: Customer = new Customer();
  loggerObj: BaseLogger = null;

  // collection of customers grid
  customerObjs: Array<Customer> = new Array<Customer>();

  constructor(_injector: Injector, public _http: HttpClient) {
    this.loggerObj = _injector.get('2');
    this.loggerObj.log();
    this.find();
  }

  Add() {
    // Litral
    const custdto: any = {
      CustomerName: this.customerObj.CustomerName,
      CustomerCode: this.customerObj.CustomerCode,
      CustomerAmount: this.customerObj.CustomerAmount
    };
    this.customerObjs.push(this.customerObj);
    // First does not make a call
    // we have to liseten this obser
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const observable = this._http.post(
      'http://localhost:4000/post',
      custdto,
      httpOptions
    );
    // This is actually make a call
    observable.subscribe(res => this.Success(res), res => this.Error(res));
    // location.reload();
    this.find();
  }

  Select(_currentCust: Customer) {
    this.customerObj.CustomerCode = _currentCust.CustomerCode;
    this.customerObj.CustomerName = _currentCust.CustomerName;
    this.customerObj.CustomerAmount = _currentCust.CustomerAmount;
  }

  Error(res: Response) {
    console.log('Error');
  }
  Success(res) {
    this.customerObjs = res;
    // this.customerObj = new Customer();
  }
  Clear() {
    this.customerObj = new Customer();
  }
  Delete(_currentCust: Customer) {
    const custdto: any = {};
    custdto.CustomerName = _currentCust.CustomerName;
    custdto.CustomerCode = _currentCust.CustomerCode;
    custdto.CustomerAmount = _currentCust.CustomerAmount;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const observable = this._http.post(
      'http://localhost:4000/delete',
      custdto,
      httpOptions
    );
    // This is actully make a call
    observable.subscribe(res => this.Success(res), res => this.Error(res));
    location.reload();
  }

  async find() {
    try {
      const custdto: any = {
        CustomerName: this.customerObj.CustomerName
      };
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      if (custdto.CustomerName) {
        const observable = await this._http.post(
          'http://localhost:4000/find',
          custdto,
          httpOptions
        );
        // This is actully make a call
        observable.subscribe(res => this.Success(res), res => this.Error(res));
      } else {
        const observable = await this._http.post(
          'http://localhost:4000/findall',
          custdto,
          httpOptions
        );
        // This is actully make a call
        observable.subscribe(res => this.Success(res), res => this.Error(res));
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* async findAll() {
    // Litral
    const custdto: any = {};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const observable = await this._http.post(
      'http://localhost:4000/findall',
      custdto,
      httpOptions
    );
    // This is actully make a call
    observable.subscribe(res => this.Success(res), res => this.Error(res));
  } */

  Update(_currentCust: Customer) {
    const custdto: any = {};
    custdto.CustomerName = _currentCust.CustomerName;
    custdto.CustomerCode = _currentCust.CustomerCode;
    custdto.CustomerAmount = _currentCust.CustomerAmount;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const observable = this._http.post(
      'http://localhost:4000/update',
      custdto,
      httpOptions
    );
    // This is actully make a call
    observable.subscribe(res => this.Success(res), res => this.Error(res));
    location.reload();
  }

  /* findAll() {
    let data;
    const http: XMLHttpRequest = new XMLHttpRequest();
    http.open('POST', 'http://localhost:4000/findall', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.onreadystatechange = function() {
      data = this.responseText;
    };
    http.send();
    console.log(data);
  } */
}
