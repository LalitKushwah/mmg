import { CONSTANTS } from './../utils/constants';
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
        switch(value.status) {
          case CONSTANTS.ORDER_STATUS_RECEIVED:
            value.status = "Received"
            break
          case CONSTANTS.ORDER_STATUS_PROGRESS:
            value.status = "In-Progress"
            break
          case CONSTANTS.ORDER_STATUS_CANCEL:
            value.status = "Cancelled"
            break
        }
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
      })
      this.orderListAvailable = true
      console.log("this.orderList", this.orderList)
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

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    return [year, month, day].join('-')
  }
}
