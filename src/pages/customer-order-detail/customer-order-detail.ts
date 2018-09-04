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

  orderItems: any = []
  orderDetail: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.orderDetail = this.navParams.get('order')
    this.orderItems = this.orderDetail.productList
    console.log(this.orderDetail)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
