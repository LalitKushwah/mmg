import { AdminHomePage } from '../admin-home/admin-home';
import { CustomerHomePage } from '../customer-home/customer-home';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { PopoverHomePage } from '../popover-home/popover-home';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CustomerReviewSubmitOrderPage } from "../customer-review-submit-order/customer-review-submit-order";
import { CONSTANTS } from "../../utils/constants";

import { UserProfilePage } from '../user-profile/user-profile';
import { SalesmanDashboardPage } from '../salesman-dashboard/salesman-dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cart: any = [];

  constructor(public navCtrl: NavController,
              private menuController: MenuController,
              private storageService: StorageServiceProvider,
              private widgetUtil: WidgetUtilService) {

    this.checkData()
  }

  async checkData() {
    try {
      let profile = await this.storageService.getFromStorage('profile')
      if (profile) {
        if (!(profile['token'])) {
          this.gotToLogin()
        } else {
          this.menuController.swipeEnable(true, 'main_menu')
          if (profile['userType'] === 'ADMIN') {
            this.navCtrl.setRoot(AdminHomePage)
          } else {
            if (profile['userType'] === 'SALESMAN'){
              this.navCtrl.setRoot(SalesmanDashboardPage)
            } else{
              //this.navCtrl.setRoot(CustomerHomePage)
              this.navCtrl.setRoot(UserProfilePage)
            }
          }
        }
      } else {
        this.gotToLogin()
      }
    } catch (err) {
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

  async reviewAndSubmitOrder() {
    if (this.cart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    } else {
      let orderTotal = await this.storageService.getFromStorage('orderTotal')
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal': orderTotal
      })
    }
  }

  async getCardItems() {
    this.cart = await this.storageService.getCartFromStorage()
  }

  ionViewDidEnter() {
    this.getCardItems()
  }
}
