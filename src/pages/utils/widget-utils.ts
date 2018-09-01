import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class WidgetUtilService {

  constructor(public alertController: AlertController, public toastController: ToastController) {
  }

  showAlert(title, subTitle) {
    this.alertController.create({
        title: title,
        subTitle: subTitle,
        buttons: ['OK']
      }).present();
  }

  showToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
