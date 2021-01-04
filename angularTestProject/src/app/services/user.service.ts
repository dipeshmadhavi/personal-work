import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users = [
    { _id: 1, name: 'Jack' },
    { _id: 2, name: 'Jill' },
    { _id: 3, name: 'John' },
  ];

  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec'];
  constructor() {}

  getUsers() {
    return this.users;
  }

  getMonths() {
    return this.months;
  }
}
