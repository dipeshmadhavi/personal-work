import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
})
export class CalenderComponent implements OnInit {
  public months;
  constructor(private UserService: UserService) {}

  ngOnInit() {
    this.getMonths();
  }

  getMonths() {
    this.months = this.UserService.getMonths();
  }
}
