import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WidgetUtilService } from '../../utils/widget-utils';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

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
  showCsvButton = false
  showCancelOrder = false
  orderItemsAvailable =false
  csvData: any[] = [];
  headerRow: any[] = [];
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private widgetUtil: WidgetUtilService,
              private transfer: FileTransfer) {

    this.orderDetail = this.navParams.get('order')
    this.orderItems = this.orderDetail.productList
    this.orderItems.map((value) => {
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price.toString())) * 100) / 100).toString()).toFixed(2))
      value['price'] = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
    })
    this.orderItemsAvailable = true
    this.showImportOrder = false
    this.showCsvButton = false
    this.showCancelOrder= false
  }

  ionViewDidEnter(){
    this.checkData()
  }

  async checkData() {
    let profile = await this.storageService.getFromStorage('profile')
    /* if(!(window['cordova']) && (profile['userType'] === 'admin')) {
      this.showCsvButton = true
    }else{
      this.showCsvButton = false
    } */
    if ((profile['userType'] === 'ADMIN') && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED) && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL)) {
      this.showImportOrder = true
    } else {
      this.showImportOrder = false
    }
    if ((profile['userType'] === 'CUSTOMER') && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_RECEIVED) && (this.orderDetail.status != CONSTANTS.ORDER_STATUS_CANCEL)) {
      this.showCancelOrder = true
    } else {
      this.showCancelOrder = false
    }
  }

  importOrder() {
    this.changeOrderStatus(CONSTANTS.ORDER_STATUS_RECEIVED, CONSTANTS.ORDER_IMPORTED)
  }

  cancelOrder() {
    this.changeOrderStatus(CONSTANTS.ORDER_STATUS_CANCEL, CONSTANTS.ORDER_CANCELLED)
  }

  changeOrderStatus(newStatus, message) {
    this.showLoader = true
    this.apiService.changeOrderStatus(this.orderDetail['_id'], {status: newStatus}).subscribe((result) => {
      this.getOrderDetail()
      this.widgetUtil.showToast(message)
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
      this.showLoader = false
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.showLoader = false
      this.checkData()
    })
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

}
