import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { CONSTANTS } from './../utils/constants';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabButton } from 'ionic-angular';
import { WidgetUtilService } from '../utils/widget-utils';
import { File } from '@ionic-native/file';
import * as papa from 'papaparse'
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
  csvData: any[] = [];
  headerRow: any[] = [];
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private storageService: StorageServiceProvider, private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService, private file: File, 
    private transfer: FileTransfer) {
    this.orderDetail = this.navParams.get('order')
    this.orderItems = this.orderDetail.productList
    this.showImportOrder = false
    this.showCsvButton = false 
    console.log(this.orderDetail)
  }

  ionViewDidEnter(){
    this.checkData()
  }

  async checkData() {
    let profile = await this.storageService.getFromStorage('profile')
    if ((profile['userType'] === 'admin')) {
      this.showCsvButton = true
    }
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

  exportToCsv() {
    let csv = papa.unparse(this.orderDetail)
 
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
   /*  var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); */
    this.file.writeFile(this.file.dataDirectory, 'tradekings.csv', blob)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
