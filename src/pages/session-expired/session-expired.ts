import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from "../login/login";

/**
 * Generated class for the SessionExpiredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'SessionExpiredPage'
})
@Component({
  selector: 'page-session-expired',
  templateUrl: 'session-expired.html',
})
export class SessionExpiredPage {

  constructor (public navCtrl: NavController, public navParams: NavParams) {
  }

  goToLogin () {
    this.navCtrl.setRoot(LoginPage)
  }

}
