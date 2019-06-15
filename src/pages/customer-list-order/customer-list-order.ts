import { CONSTANTS } from '../../utils/constants';
import { CustomerOrderDetailPage } from './../customer-order-detail/customer-order-detail';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
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
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userId: string = ''

  constructor (public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService) {
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.orderListAvailable = false
      this.getUserOrderList()
  }

  async getUserOrderList () {
    const profile = await this.storageService.getFromStorage('profile')
    this.userId = profile['userType'] === 'SALESMAN' ? profile['externalId'] : profile['_id']
    const isSalesman = profile['userType'] === 'SALESMAN' ? true : false
    this.apiService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman).subscribe((result) => {
      this.orderList = result.body
      this.orderList.map((value) => {
        value.orderTotal = parseFloat((Math.round(value.orderTotal * 100) / 100).toString()).toFixed(2)
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
      })
      this.orderListAvailable = true
    }, (error) => {
      this.orderListAvailable = true
      console.log('error', error)
    })
  }

  getOrderDetial (order) {
    let orderObj = {
      order: order
    }
    this.navCtrl.push(CustomerOrderDetailPage, orderObj)
  }

  async doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    const profile = await this.storageService.getFromStorage('profile')
    const isSalesman = profile['userType'] === 'SALESMAN' ? true : false
    this.apiService.getOrderListByUser(this.userId, this.skipValue, this.limit, isSalesman).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.orderList.push(value)
        })
      } else {
        this.skipValue = this.limit
      }
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.complete();
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  doRefresh (refresher) : void {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getUserOrderList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  formatDate (date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    return [year, month, day].join('-')
  }


}
