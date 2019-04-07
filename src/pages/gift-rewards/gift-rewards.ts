import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides  } from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiServiceProvider) {
    this.getGiftProducts()
  }

  getGiftProducts() {
    this.apiService.getGiftProducts().subscribe(res => {
      this.giftProducts = res.body
      // schema of the received gift products
      // {_id: "5ca8ad0a45d7402c15f989c1", name: "32 Inch LED", brand: "Hisense", tkCurrencyValue: "2000"}
    })
  }

}
