import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'AdminListUserPage'
})
@Component({
  selector: 'page-admin-list-user',
  templateUrl: 'admin-list-user.html',
})
export class AdminListUserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListUserPage');
  }

}
