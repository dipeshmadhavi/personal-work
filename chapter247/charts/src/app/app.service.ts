import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(private readonly http: HttpClient) { }
  getGraphData(): Observable<any> {
    const url = `${environment.APP_BASE_URL}/getgraphdata`;
    return this.http.get(url, this.httpOptions);
  }

}