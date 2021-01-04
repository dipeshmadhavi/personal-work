import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.scss'],
})
export class TemplateDrivenFormComponent implements OnInit {
  public topics = ['angular', 'react', 'vue'];
  public userModel = {
    // name: '',
    // email: '',
    // phone: null,
    // topic: '',
    // timePreference: '',
    // subscribe: false,
  };
  constructor() {}

  ngOnInit() {}
}
