import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-first-module',
  templateUrl: './first-module.component.html',
  styleUrls: ['./first-module.component.scss'],
})
export class FirstModuleComponent implements OnInit {
  public users;
  constructor(private UserService: UserService) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.users = this.UserService.getUsers();
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
}
