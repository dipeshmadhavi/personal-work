import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-houses',
  templateUrl: 'houses.page.html',
})
export class HousesPage {
  constructor(public alertController: AlertController, public loadingController: LoadingController) {}
}
