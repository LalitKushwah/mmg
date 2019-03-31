import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions';
import { TkFaqPage } from '../tk-faq/tk-faq';
import { SpecialProductsPage } from '../special-products/special-products';
import { ClubClassificationPage } from '../club-classification/club-classification';

/**
 * Generated class for the ClubPremierGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'ClubPremierGuidePage'
})
@Component({
  selector: 'page-club-premier-guide',
  templateUrl: 'club-premier-guide.html',
})
export class ClubPremierGuidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClubPremierGuidePage');
  }

  goToTNC() {
    this.navCtrl.push(TermsAndConditionsPage);
  }

  goToFAQ() {
    this.navCtrl.push(TkFaqPage);
  }

  goToProductList() {
    this.navCtrl.push(SpecialProductsPage)
  }

  goToClubClassificationt() {
    this.navCtrl.push(ClubClassificationPage)
  }
}
