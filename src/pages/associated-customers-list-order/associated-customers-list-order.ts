import { CONSTANTS } from '../../utils/constants';
import { CustomerOrderDetailPage } from './../customer-order-detail/customer-order-detail';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
//import { _ } from 'underscore';

@IonicPage({
  name: 'AssociatedCustomersListOrderPage'
})

@Component({
  selector: 'page-associated-customers-list-order',
  templateUrl: 'associated-customers-list-order.html',
})
export class AssociatedCustomersListOrderPage {

  orderList: any = []
  sortedOrderList: any = []
  orderListAvailable: Boolean = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userId: string = ''
  slice: number = 20

  constructor (public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService) {
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.orderListAvailable = false
      this.getUserOrderList()
  }

  async getUserOrderList () {
    const profile = await this.storageService.getFromStorage('profile')
    this.userId = (profile['userType'] === 'SALESMAN' || profile['userType'] === 'SALESMANAGER') ? profile['externalId'] : profile['_id']
    const isSalesman = ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) ? true : false
    this.apiService.getOrdersForSalesmanByAssociatedCustomers(this.userId, this.skipValue, this.limit).subscribe((result) => {
      this.orderList = result.body

      //Sorting Order List - Desc
        this.orderList.sort((a, b) => {
          return <any>new Date(b.lastUpdatedAt) - <any>new Date(a.lastUpdatedAt);
        })

      this.orderList.map((value) => {
        value.orderTotal = parseFloat((Math.round(value.orderTotal * 100) / 100).toString()).toFixed(2)
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
      })
      // var sorted = _.sortBy(this.orderList,function (node){
      //   return - (new Date(node.created_at).getTime());
      // });
      // console.log(sorted.reverse())
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

  // async doInfinite (infiniteScroll) {
  //   this.skipValue = this.skipValue + this.limit
  //   const profile = await this.storageService.getFromStorage('profile')
  //   const isSalesman = ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) ? true : false
  //   this.apiService.getOrdersForSalesmanByAssociatedCustomers(this.userId, this.skipValue, this.limit).subscribe((result) => {
  //     if(result.body.length > 0) {
  //       result.body.map( (value) => {
  //         this.orderList.push(value)
  //       })
  //     } else {
  //       this.skipValue = this.limit
  //     }
  //     infiniteScroll.complete();
  //   }, (error) => {
  //     infiniteScroll.complete();
  //     if (error.statusText === 'Unknown Error') {
  //       this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
  //     } else {
  //       this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
  //     }
  //   })
  // }

  //Client Side Pagination
  async doInfinite (infiniteScroll) {
    setTimeout(() => {
      this.slice += 20;
      infiniteScroll.complete();
    }, 200);  
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

