import { Component } from '@angular/core';
import { Constants } from './app.constants';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'KAVworks';
  public servergroups = [];
  constructor(private readonly appService: AppService) {
    this.init();
  }

  init() {
    this.appService.getServerData().subscribe((res) => {
      this.servergroups = res.result;
    });
  }

  public executeServer(groups, server) {
    console.log({
      groupName: groups.groupname,
      ip: server.ip,
      pathAtServer: groups.pathatserver,
      URL: `http://${server.ip}:${groups.serverport}${groups.pathatserver}`,
    });
  }
}
