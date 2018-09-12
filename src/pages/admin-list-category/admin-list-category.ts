import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'AdminListCategoryPage'
})
@Component({
  selector: 'page-admin-list-category',
  templateUrl: 'admin-list-category.html',
})
export class AdminListCategoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListCategoryPage');
  }

}
