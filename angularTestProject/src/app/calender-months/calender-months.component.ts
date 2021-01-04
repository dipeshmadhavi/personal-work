import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-calender-months',
  templateUrl: './calender-months.component.html',
  styleUrls: ['./calender-months.component.scss'],
})
export class CalenderMonthsComponent {
  public myDatePickerConfig = {
    dayFormat: 'EEEE',
  };
  myDateChangeHandler($event) {
    console.log($event);
  }
}
