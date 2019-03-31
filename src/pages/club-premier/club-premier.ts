import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClubPremierGuidePage } from '../club-premier-guide/club-premier-guide';
import { GiftRewardsPage } from '../gift-rewards/gift-rewards';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {WidgetUtilService} from "../../utils/widget-utils";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private widgetService :WidgetUtilService) {
  }

  ionViewDidLoad() {
    this.storageService.getFromStorage('profile').then((res: any) => {
      this.apiService.getUserDetails(res.userLoginId).subscribe(data => {
          this.tkPoints = data.body[0].tkPoints
          this.tkCurrency = data.body[0].tkCurrency
      })
    })
  }

  viewGuide() {
    this.navCtrl.push(ClubPremierGuidePage)
  }

  viewRewards() {
    this.widgetService.showToast('Work In Progress Coming Soon...')
  }
}
