import { Injectable } from '@angular/core';
import { AlertController, ToastController, PopoverController } from 'ionic-angular';

@Injectable()
export class WidgetUtilService {

  popoverInstance : any = {}

  constructor(public alertController: AlertController, public toastController: ToastController
    , private popoverController: PopoverController) {
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
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  dismissPopover() {
    this.popoverInstance.dismiss()
  }

  presentPopover(myEvent, page) {
    this.popoverInstance = this.popoverController.create(page);
    this.popoverInstance.present({
      ev: myEvent
    });
  }
}
