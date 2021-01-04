import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { RouteService } from 'src/services/services';

@Component({
  selector: 'app-houses',
  templateUrl: 'spartan.page.html',
})
export class SpartanPage {
  private nav = new RouteService();
  public names;
  constructor(public alertController: AlertController, public loadingController: LoadingController) {
    this.names = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
  }

  back() {
    this.nav.getPreviousUrl();
    return;
  }
}
