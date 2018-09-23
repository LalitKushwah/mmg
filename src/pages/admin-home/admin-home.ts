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

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  exportToCsv() {
    const fields = ['orderId', 'orderTotal', 'userDetail'];
    const opts = { fields };
    let Json2csvParser  = json2Csv.Parser
    const parser = new Json2csvParser (opts);
    const csv = parser.parse(this.orderList);
    let fileName =  'CSV' + Math.floor(Math.random()*90000) + '.csv'
    this.file.writeFile(this.file.externalRootDirectory, fileName, csv)
      .then(() => {
        this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOADED)
      }).catch(err => {
          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv).then(() => {
            this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOADED)
          }).catch(err => {
            this.widgetUtil.showToast(CONSTANTS.CSV_DOWNLOAD_FAIL)
          })
      })
  }
}
