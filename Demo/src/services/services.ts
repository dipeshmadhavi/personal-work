import { Injectable } from '@angular/core';

@Injectable()
export class RouteService {
  public navLinksArray: string[];

  constructor() {
    this.navLinksArray = ['/houses/*'];
  }

  public getPreviousUrl() {
    if (this.navLinksArray.length > 1) {
      this.navLinksArray.pop();
      const index = this.navLinksArray.length - 1;
      const url = this.navLinksArray[index];
      return url;
    } else {
      return this.navLinksArray[0];
    }
  }
}
