import { WidgetUtilService } from './../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { CONSTANTS } from '../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CustomerOrderDetailPage } from '../customer-order-detail/customer-order-detail';
import { File } from '@ionic-native/file'
import * as json2Csv from 'json2csv'

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
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT

  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService
  , private apiService: ApiServiceProvider, private file: File) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
  }

  getList() {
    this.apiService.getOrderList(this.skipValue, this.limit).subscribe((result) => {
      this.orderList = result.body
      this.orderList.map((value) => {
        value.lastUpdatedAt = this.formatDate(value.lastUpdatedAt)
        value.orderTotal = parseFloat((Math.round(value.orderTotal * 100) / 100).toString()).toFixed(2)
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

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getOrderList(this.skipValue, this.limit).subscribe((result) => {
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

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  exportToCsv() {
    let csvList =  []
    this.orderList.map((value) => {
      value.productList.map((product, index) => {
        let lineItem = {}
        if(index === 0) {
          lineItem =  {
            OrderId: value.orderId,
            OrderDate: this.formatDate(value.lastUpdatedAt),
            customerName: value.userDetail.name,
            CustomerCode: value.userDetail.externalId,
            'Country(Province)': value.userDetail.country + "(" + value.userDetail.province  + ")",
            OrderTotal: value.orderTotal
          }
        } else {
          lineItem =  {
            OrderId: '*',
            OrderDate: '*',
            customerName: '*',
            CustomerCode: '*',
            'Country(Province)': '*',
            OrderTotal: '*'
          }
        }
        lineItem['Price'] = product.price
        lineItem['Quantity'] = product.quantity
        lineItem['SubTotal'] = (parseFloat(product.price) * parseInt(product.quantity))
        lineItem['ProductName'] = product.productDetail.name
        lineItem['ProductCode'] = product.productDetail.productCode
        lineItem['ProductSysCode'] = product.productDetail.productSysCode
        csvList.push(lineItem)
      })
    })
    const fields = ['OrderId', 'OrderDate', 'customerName', 'CustomerCode', 'Country(Province)', 'ProductName', 'ProductCode', 'ProductSysCode', 'Price', 'Quantity', 'SubTotal', 'OrderTotal'];
    const opts = { fields };
    let Json2csvParser  = json2Csv.Parser
    const parser = new Json2csvParser (opts)
    const csv = parser.parse(csvList)
    /* let fileName =  'Tradkings-'+ Math.floor(Math.random()*90000) + '.csv' */
    let fileName =  'TradkingsOrder-'+ this.getDateForCSV().trim() + '.csv'
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
  }
}
