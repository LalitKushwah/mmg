import { Component, ViewChild  } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {WidgetUtilService} from "../../utils/widget-utils";
import {GiftCheckoutPage} from "../gift-checkout/gift-checkout";

/**
 * Generated class for the GiftRewardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-rewards',
  templateUrl: 'gift-rewards.html',
})
export class GiftRewardsPage {

  giftProducts = []
  totalTkPoints
  totalTkCurrency
  giftProductsCart = []
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private storageService: StorageServiceProvider,
              private widgetService: WidgetUtilService,
              private loadingCtrl: LoadingController) {

    this.getGiftProducts()
  }

  ionViewWillEnter() {
    this.giftProductsCart = this.storageService.getGiftProductCart()
    this.getTKCurrency()
  }

  getTKCurrency() {
    this.storageService.getFromStorage('profile').then((res: any) => {
      this.apiService.getUserDetails(res.userLoginId).subscribe(data => {
        this.totalTkPoints = data.body[0].tkPoints
        this.totalTkCurrency = data.body[0].tkCurrency
      })
    })
  }

  getGiftProducts() {
      const loader = this.loadingCtrl.create({
        content: "Fetching Products Please Wait...",
      });
      loader.present();
    this.apiService.getGiftProducts().subscribe(res => {
      this.giftProducts = res.body
      loader.dismiss()
      // schema of the received gift products
      // {_id: "5ca8ad0a45d7402c15f989c1", name: "32 Inch LED", brand: "Hisense", tkCurrencyValue: "2000"}
    })
  }

  addItemToGiftCart(product) {
    let currencyLeft = parseFloat(this.totalTkCurrency) - parseFloat(product.tkCurrencyValue);
    if (currencyLeft > 0) {
      this.totalTkCurrency = this.totalTkCurrency - product.tkCurrencyValue;
      let flag = false
      this.giftProductsCart.map(existingProduct => {
        if (product._id === existingProduct._id) {
            product.quantity = product.quantity  + 1;
            flag = true
        }
      })
      if (!flag) {
        product.quantity = 1
        this.giftProductsCart.push(product)
        this.storageService.setGiftProductCart(this.giftProductsCart)
      }
      this.widgetService.showToast('Gift Item Added Successfully...')
    } else {
      this.widgetService.showToast('You Do not have sufficient TK-Currency')
    }
  }

  moveToGiftCheckoutPage() {
    this.navCtrl.push(GiftCheckoutPage, { cart: this.giftProductsCart })
  }

}
