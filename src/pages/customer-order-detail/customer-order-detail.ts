import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { CONSTANTS } from './../utils/constants';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabButton } from 'ionic-angular';
import { WidgetUtilService } from '../utils/widget-utils';

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
  showImportOrder = false
  showLoader = false

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
  private widgetUtil: WidgetUtilService) {
    this.orderDetail = this.navParams.get('order')
    this.orderItems = this.orderDetail.productList
    this.showImportOrder = false
    console.log(this.orderDetail)
  }

  ionViewDidEnter(){
    this.checkData()
  }

  async checkData() {
    let profile = await this.storageService.getFromStorage('profile')
    if ((profile['userType'] === 'admin') && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED) && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL)) {
      this.showImportOrder = true
    }else{
      this.showImportOrder = false
    }
    console.log('showImportOrder', this.showImportOrder)
  }

  importOrder() {
    this.showLoader = true
    this.apiService.importOrder(this.orderDetail['_id'], {status: CONSTANTS.ORDER_STATUS_RECEIVED}).subscribe((result) => {
      this.getOrderDetail()
      this.showLoader = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.showLoader = false
    })
  }

  getOrderDetail() {
    this.apiService.getOrderDetail(this.orderDetail['_id']).subscribe((result) => {
      this.orderDetail = result.body[0]
      this.checkData()
      this.widgetUtil.showToast(CONSTANTS.ORDER_IMPORTED)
      this.showLoader = false
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.showLoader = false
    })
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
