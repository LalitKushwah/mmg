import { HomePage } from './../home/home';
import { WidgetUtilService } from './../utils/widget-utils';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'CustomerReviewSubmitOrderPage'
})
@Component({
  selector: 'page-customer-review-submit-order',
  templateUrl: 'customer-review-submit-order.html',
})
export class CustomerReviewSubmitOrderPage {

  cartItems: any = []
  orderTotal: number = 0
  showLoader: boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
  private widgetUtil: WidgetUtilService) {
    this.showLoader = false
    this.orderTotal = this.navParams.get("orderTotal")
    this.getCardItems()
  }

  async getCardItems() {
    this.cartItems = await this.storageService.getFromStorage('cart')
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  async submitOrder() {
    this.showLoader = true
    let orderObj = {
      productList : this.cartItems.map((value) => {
        return {
          productId: value['_id'],
          quantity: value['quantity'],
          name: value['name'],
          price: value['price']
        }
      }),
      userId: (await this.storageService.getFromStorage('profile'))['_id'],
      orderTotal: this.orderTotal,
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      lastUpdatedAt: Date.now()
    }
    this.apiService.submitOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setToStorage('cart', [])
      this.widgetUtil.showToast('Congrats! Order Placed Successfully!')
      this.navCtrl.setRoot(HomePage)
    }, (error) => {
      this.showLoader = false
      console.log('error', error)
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
}
