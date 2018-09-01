import { WidgetUtilService } from './../utils/widget-utils';
import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, PopoverController, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'PopoverHomePage'
})
@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider
  , public appCtrl: App, private widgetUtil: WidgetUtilService ) {
  }

  async logout() {
    this.storageService.clearStorage()
    localStorage.clear()
    this.widgetUtil.dismissPopover()
    this.appCtrl.getRootNav().push(HomePage)
  }
}
