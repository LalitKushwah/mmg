import { WidgetUtilService } from './../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { CONSTANTS } from '../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CustomerOrderDetailPage } from '../customer-order-detail/customer-order-detail';
import { File } from '@ionic-native/file'
import * as json2Csv from 'json2csv'
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

@IonicPage({
  name: 'AdminHomePage'
})

@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})

export class AdminHomePage {

  orderList: Array<any> = [];
  orderListAvailable: Boolean = false
  showLoader = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT

  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService
  , private apiService: ApiServiceProvider, private file: File, private alertCtrl: AlertController,
  private storageService: StorageServiceProvider) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
  }

  async getList() {
    let profile = await this.storageService.getFromStorage('profile')
    this.apiService.getProvinceOrderList(profile['province'], this.skipValue, this.limit).subscribe((result) => {
      this.orderList = result.body
      this.orderList.map((value) => {
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
        value.orderTotal = parseFloat((Math.round(value.orderTotal * 100) / 100).toString()).toFixed(2)
        if((value.status != CONSTANTS.ORDER_STATUS_RECEIVED) && (value.status != CONSTANTS.ORDER_STATUS_CANCEL)) {
          value.showImport = true
        } else {
          value.showImport = false
        }
      })
      this.orderListAvailable = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.orderListAvailable = true
    })
  }

  getOrderDetial(order) {
    let orderObj = {
      order: order
    }
    this.navCtrl.push(CustomerOrderDetailPage, orderObj)
  }

  async doInfinite(infiniteScroll) {
    let profile = await this.storageService.getFromStorage('profile')
    this.skipValue = this.skipValue + this.limit
    this.apiService.getProvinceOrderList(profile['province'], this.skipValue, this.limit).subscribe((result) => {
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

  doRefresh(refresher) : void {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
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

  getDateForCSV() {
    var d = new Date,
    dformat = [d.getMonth()+1,
      d.getDate(),
      d.getFullYear()].join('-')+'-'+
     [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join('-');
      return dformat
  }

  importOrder(order) {
    this.changeOrderStatus(CONSTANTS.ORDER_STATUS_RECEIVED, CONSTANTS.ORDER_IMPORTED, order)
  }

  changeOrderStatus(newStatus, message, order) {
    this.showLoader = true
    this.apiService.changeOrderStatus(order['_id'], {status: newStatus}).subscribe((result) => {
      this.getList()
      this.widgetUtil.showToast(message)
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

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  filterOrderToExport() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Order Status');
    alert.addInput({
      type: 'checkbox',
      label: 'Recieved',
      value: 'recieved',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Cancel',
      value: 'cancel',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'In Progress',
      value: 'in-progress',
      checked: true
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.exportToCsv(data)
      }
    })
    alert.present();
  }

  exportToCsv(selectedStatus) {
    let csvList =  []
    this.orderList.map((value) => {
      if(selectedStatus.indexOf(value.status) >=0) {
        value.productList.map((product, index) => {
          let lineItem = {}
          if(index === 0) {
            lineItem =  {
              OrderId: value.orderId,
              OrderDate: this.formatDate(value.lastUpdatedAt),
              CustomerName: value.userDetail.name,
              CustomerCode: value.userDetail.externalId,
              'Country(Province)': value.userDetail.country + "(" + value.userDetail.province  + ")",
              OrderTotal: (parseFloat((value.orderTotal).toString()).toFixed(2))
            }
          } else {
            lineItem =  {
              OrderId: '*',
              OrderDate: '*',
              CustomerName: '*',
              CustomerCode: '*',
              'Country(Province)': '*',
              OrderTotal: '*'
            }
          }
          lineItem['Price'] = (parseFloat((product.price).toString()).toFixed(2))
          lineItem['Quantity'] = product.quantity
          lineItem['SubTotal'] = (parseFloat((Math.round((parseFloat(product.price) * parseInt(product.quantity) * 100) / 100)).toString()).toFixed(2))
          lineItem['ProductName'] = product.productDetail.name
          lineItem['ProductCode'] = product.productDetail.productCode
          lineItem['ProductSysCode'] = product.productDetail.productSysCode
          csvList.push(lineItem)
        })
      }
    })
    const fields = ['OrderId', 'OrderDate', 'CustomerName', 'CustomerCode', 'Country(Province)', 'ProductName', 'ProductCode', 'ProductSysCode', 'Price', 'Quantity', 'SubTotal', 'OrderTotal']
    const opts = { fields }
    let Json2csvParser  = json2Csv.Parser
    const parser = new Json2csvParser (opts)
    const csv = parser.parse(csvList)
    /* let fileName =  'Tradkings-'+ Math.floor(Math.random()*90000) + '.csv' */
    let fileName =  'TKO-'+ this.getDateForCSV().trim() + '.csv'

    if((window['cordova'])) {
      this.file.writeFile(this.file.externalRootDirectory, fileName, csv)
      .then(() => {
        this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOADED + '! FileName: ' + fileName)
      }).catch(err => {
          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv).then(() => {
            this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOADED + '! FileName: ' + fileName)
          }).catch(err => {
            this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOAD_FAIL)
          })
      })
    } else{
      var blob = new Blob([csv]);
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
