import { WidgetUtilService } from '../../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PopoverHomePage } from '../popover-home/popover-home';

import { TargetGraphPage } from '../target-graph/target-graph';
import { TargetPage } from '../target/target';
import { TkCurrencyPage} from '../tk-currency/tk-currency';
import { OutstandingPage} from '../outstanding/outstanding';



/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'UserProfilePage'
})
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  opened: boolean = false;
  TKopened: boolean = false;
  Outopened: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad UserProfilePage');
  // }
  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  // openGraph() {
  //   this.navCtrl.push('TargetGraphPage');
  // }

  // openTarget() {
  //   this.navCtrl.push('TargetPage');
  // }

  // openOutstanding() {
  //   this.navCtrl.push('OutstandingPage');
  // }

  // openTkCurrency() {
  //   this.navCtrl.push('TkCurrencyPage');
  // }

  toggleFunc() {
    this.opened = !this.opened;
    if(this.TKopened){
      this.TKopened = !this.TKopened 
    }
    if(this.Outopened){
      this.Outopened = !this.Outopened 
    }
  }

  toggleFuncTK() {
    this.TKopened = !this.TKopened;
    if(this.opened){
      this.opened = !this.opened 
    }
    if(this.Outopened){
      this.Outopened = !this.Outopened 
    }
  }

  toggleFuncOut() {
    this.Outopened = !this.Outopened;
    if(this.opened){
      this.opened = !this.opened 
    }
    if(this.TKopened){
      this.TKopened = !this.TKopened 
    }
  }

}
