import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'AdminListProductPage'
})
@Component({
  selector: 'page-admin-list-product',
  templateUrl: 'admin-list-product.html',
})
export class AdminListProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListProductPage');
  }

}
