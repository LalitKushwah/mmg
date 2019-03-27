import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides  } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  @ViewChild(Slides) slides: Slides;
  slideOpts = {
    effect: 'flip'
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftRewardsPage');
  }

  slidePrev() {
    this.slides.slidePrev();
  }

  slideNext() {
    this.slides.slideNext();
  }

}
