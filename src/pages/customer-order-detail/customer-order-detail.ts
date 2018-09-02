import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'CustomerOrderDetailPage'
})

@Component({
  selector: 'page-customer-order-detail',
  templateUrl: 'customer-order-detail.html',
})
export class CustomerOrderDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
