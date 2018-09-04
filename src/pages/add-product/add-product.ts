import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'AddProductPage'
})

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})

export class AddProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }

}
