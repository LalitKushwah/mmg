import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'PopoverHomePage'
})
@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider) {
  }

  logout() {
    this.storageService.clearStorage()
    console.log('going to login page')
    this.navCtrl.setRoot(HomePage)
  }
}
