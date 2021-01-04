import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdePopoverTrigger } from '@material-extended/mde';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MdePopoverTrigger, { static: true }) trigger: MdePopoverTrigger;
  public title = 'view-controller';
  public selectedView: { name: string; type: string };
  constructor(public appService: AppService) {
    this.selectedView = this.appService.views[0];
  }

  navigate(view: { name: string; type: string }) {
    this.selectedView = view;
  }

  add(view: { name: string; type: string }) {
    const newView = this.appService.addView(view);
    this.selectedView = newView;
  }

  togglePopover() {
    this.trigger.togglePopover();
  }
}
