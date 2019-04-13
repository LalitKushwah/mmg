import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";

/**
 * Generated class for the GiftCheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-checkout',
  templateUrl: 'gift-checkout.html',
})
export class GiftCheckoutPage {

  totalTkCurrency = 0
  giftCartProducts = []

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider) {
    this.giftCartProducts = this.navParams.get('cart')
    console.log('====== 26 =====', this.giftCartProducts)
    if (this.giftCartProducts.length) {
      this.giftCartProducts.map(product => {
        this.totalTkCurrency = this.totalTkCurrency + (parseFloat(product.tkCurrencyValue) * parseInt(product.quantity))
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftCheckoutPage');
  }

  expandItem(event: any) {
    if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
      event.target.parentElement.classList.toggle('expand')
      event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
    }
  }

  removeFromCart(product) {

  }

  clearCart() {
    this.giftCartProducts = []
    this.totalTkCurrency = 0
    this.storageService.setGiftProductCart(this.giftCartProducts)
  }

  confirmSubmitOrder() {

  }

}
