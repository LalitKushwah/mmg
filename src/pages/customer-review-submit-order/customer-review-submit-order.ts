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
  orderTotal: any = 0
  showLoader: boolean = false
  showClearCartLoader: boolean = false
  

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
  private widgetUtil: WidgetUtilService) {
    this.showLoader = false
    this.orderTotal = (parseFloat((Math.round(this.navParams.get("orderTotal") * 100) / 100).toString()).toFixed(2))
    this.getCartItems()
  }

  async getCartItems() {
    this.cartItems = await this.storageService.getFromStorage('cart')
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
    console.log(this.cartItems)
    console.log(this.orderTotal)
  }

  doRefresh(refresher) : void {
    this.getCartItems()
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
          price: parseFloat(value['price'])
        }
      }),
      userId: (await this.storageService.getFromStorage('profile'))['_id'],
      orderId: 'ORD' + Math.floor(Math.random()*90000) + 10000,
      orderTotal: parseFloat(this.orderTotal.toString()),
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      lastUpdatedAt: Date.now()
    }
    this.apiService.submitOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setToStorage('cart', [])
      this.widgetUtil.showToast(CONSTANTS.ORDER_PLACED)
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

  async clearCart() {
    this.showClearCartLoader = true
    await this.storageService.setToStorage('cart', [])
    this.orderTotal = 0
    this.getCartItems()
    this.showClearCartLoader = false
    this.widgetUtil.showToast('All items removed from cart')
  }
  
  removeFromCart(product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    console.log('this.cart' ,this.cartItems)
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
        if(value['_id'] === product['_id']) {
          this.cartItems.splice(index, 1)
        }
      })
      this.storageService.setToStorage('cart', this.cartItems)
      this.getCartItems()
    }
  }
}
