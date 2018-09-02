import { CustomerOrderDetailPage } from './../customer-order-detail/customer-order-detail';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage({
  name: 'CustomerListOrderPage'
})

@Component({
  selector: 'page-customer-list-order',
  templateUrl: 'customer-list-order.html',
})
export class CustomerListOrderPage {

  orderList: any = []
  orderListAvailable: Boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService) {
      this.orderListAvailable = false
      this.getUserOrderList()
  }

  async getUserOrderList() {
    let userId = (await this.storageService.getFromStorage('profile'))['_id']
    this.apiService.getOrderListByUser(userId).subscribe((result) => {
      this.orderList = result.body
      this.orderList.map((value) => {
        if(value.status === 'n') {
          value.status = 'No'
        } else {
          value.status = 'Yes'
        }
      })
      this.orderListAvailable = true
      console.log(this.orderList)
    }, (error) => {
      this.orderListAvailable = true
      console.log('error', error)
    })
  }

  getOrderDetial(order) {
    let orderObj = {
      order: order
    }
    this.navCtrl.push(CustomerOrderDetailPage, orderObj)
  }

  
  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
