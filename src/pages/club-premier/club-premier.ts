import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClubPremierGuidePage } from '../club-premier-guide/club-premier-guide';
import { GiftRewardsPage } from '../gift-rewards/gift-rewards';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClubPremierPage');
  }

  viewGuide() {
    this.navCtrl.push(ClubPremierGuidePage)
  }

  viewRewards() {
    this.navCtrl.push(GiftRewardsPage)
  }
}
