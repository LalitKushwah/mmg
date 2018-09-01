import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { WidgetUtilService } from './../utils/widget-utils';
import { PopoverHomePage } from './../popover-home/popover-home';
import { Component } from '@angular/core';
import { NavController, MenuController, PopoverController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  constructor(public navCtrl: NavController, private menuController: MenuController, private popoverController: PopoverController
  ,private storageService: StorageServiceProvider, private widgetUtil: WidgetUtilService) {
    this.checkData()
  }

  async checkData() {
    try {
      let token = await this.storageService.getFromStorage('token')
      if(!token) {
        this.menuController.swipeEnable(false, 'main_menu')
        this.navCtrl.setRoot(LoginPage)
      } else {
        this.menuController.swipeEnable(true, 'main_menu')
      }
    } catch(err) {
      console.log('Error: Home Page Component:', err)
    }
  }

  presentPopover(myEvent) {
    const popover = this.popoverController.create(PopoverHomePage);
    popover.present({
      ev: myEvent
    });
  }
}
