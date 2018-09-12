import { AdminHomePage } from './../admin-home/admin-home';
import { CustomerHomePage } from './../customer-home/customer-home';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { WidgetUtilService } from './../utils/widget-utils';
import { PopoverHomePage } from './../popover-home/popover-home';
import { Component } from '@angular/core';
import { NavController, MenuController, PopoverController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';

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
      let profile = await this.storageService.getFromStorage('profile')
      console.log('profildddde', profile)
      if(profile) {
        if(!(profile['token'])) {
          this.gotToLogin()
        } else {
          this.menuController.swipeEnable(true, 'main_menu')
          if (profile['userType'] === 'admin') {
            this.navCtrl.setRoot(AdminHomePage)
          }else{
            this.navCtrl.setRoot(CustomerHomePage)
          }
        }
      } else {
        this.gotToLogin()
      }
    } catch(err) {
      console.log('Error: Home Page Component:', err)
    }
  }

  gotToLogin() {
    this.menuController.swipeEnable(false, 'main_menu')
    this.navCtrl.setRoot(LoginPage)
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }
}
