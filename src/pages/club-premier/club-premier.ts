import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { ClubPremierGuidePage } from '../club-premier-guide/club-premier-guide';
import { GiftRewardsPage } from '../gift-rewards/gift-rewards';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {ApiServiceProvider} from "../../providers/api-service/api-service";

/**
 * Generated class for the ClubPremierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-club-premier',
  templateUrl: 'club-premier.html',
})
export class ClubPremierPage {

  tkPoints = 0
  tkCurrency = 0

  constructor (public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad () {
    const loader = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    loader.present();
    this.storageService.getFromStorage('profile').then((res: any) => {
      this.apiService.getDashboardData(res.externalId).subscribe((data:any) => {
          loader.dismiss()
          this.tkPoints = data.body[0] && data.body[0].tkPoints ? data.body[0].tkPoints : 0
          this.tkCurrency = data.body[0] && data.body[0].tkCurrency ? data.body[0].tkCurrency: 0
      })
    })
  }

  viewGuide () {
    this.navCtrl.push(ClubPremierGuidePage)
  }

  viewRewards () {
    this.navCtrl.push(GiftRewardsPage)
  }

  provideInfo () {
    const alert = this.alertCtrl.create({
      title: 'Information',
      subTitle: 'TK points will convert into TK currency post target achievement',
      buttons: ['OK']
    });
    alert.present();
  }
}
