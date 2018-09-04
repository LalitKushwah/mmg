import { WidgetUtilService } from './../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';

@IonicPage({
  name: 'AdminHomePage'
})

@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})

export class AdminHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

}
