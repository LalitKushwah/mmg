import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


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

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private storageService: StorageServiceProvider) {
    this.orderTotal = this.navParams.get("orderTotal")
    this.getCardItems()
  }

  async getCardItems() {
    this.cartItems = await this.storageService.getFromStorage('cart')
    console.log('cartItems', this.cartItems)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
