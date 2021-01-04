import { Component } from '@angular/core';
import { nextContext } from '@angular/core/src/render3';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'poll.page.html',
  styleUrls: ['poll.page.scss']
})
export class PollPage {
  constructor(public toastController: ToastController) {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your response has been saved',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
