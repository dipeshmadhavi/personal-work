import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public defaultViews = ['View 1', 'View 2', 'View 3'];
  public views = [
    { name: 'View 1', type: 'one' },
    { name: 'View 2', type: 'two' },
    { name: 'View 3', type: 'three' },
  ];
  public textData: string;

  constructor(private readonly router: Router) {}

  addView(inputView) {
    const result = this.views.find((view) => view.name === inputView);
    const newView = {
      name: `View ${this.views.length + 1}`,
      type: result.type,
    };
    this.views.push(newView);
    return newView;
  }
}
