import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'myapp.page.html'
})
export class MyappPage {
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['Cancel', 'Open Modal', 'Delete']
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }

  insertLog(message) {
    console.log(message);
    const el = document.querySelector('#log');
    const oldHTML = el.innerHTML;
    el.innerHTML = oldHTML + '\n' + message;
  }

  add() {
    const newEle = document.createElement('f');
    const ref = document.querySelector('f');
    this.insertAfter(newEle, ref);
    this.insertLog('add');
  }

  clickMainFAB(container) {
    const message = 'Clicked open social menu';
    this.insertLog(message);

    this.toggleLists(container);
  }

  openSocial(network, container) {
    const message = 'Share in ' + network;
    this.insertLog(message);

    this.toggleLists(container);
  }

  toggleLists(container) {
    const fabButton = document
      .getElementById(container)
      .querySelector('ion-fab-button');
    const fabLists = document
      .getElementById(container)
      .querySelectorAll('ion-fab-list');

    fabButton.activated = !fabButton.activated;

    for (let i = 0; i < fabLists.length; i++) {
      fabLists[i].activated = !fabLists[i].activated;
    }
  }

  closeLists() {
    const fabs = document.querySelectorAll('ion-fab');

    for (let i = 0; i < fabs.length; i++) {
      fabs[i].activated = false;
    }
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
