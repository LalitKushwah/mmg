import { AdminEditProductPage } from './../admin-edit-product/admin-edit-product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../utils/widget-utils';

@IonicPage({
  name: 'AdminListProductPage'
})
@Component({
  selector: 'page-admin-list-product',
  templateUrl: 'admin-list-product.html',
})
export class AdminListProductPage {
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  productList: Array<any> = [];
  productListAvailable: Boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getProducList()
  }

  getProducList() {
    this.apiService.getAllProductList(this.skipValue, this.limit).subscribe((result) => {
      result.body.map((value) => {
        value.price = parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2)
      })
      this.productList = result.body
      this.productListAvailable = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.productListAvailable = true
    })
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getAllProductList(this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.productList.push(value)
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
    this.getProducList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  editProduct(product) {
    let productInfo = {
      'product': product
    }
    console.log('@@product@@', product)
    this.navCtrl.push(AdminEditProductPage, productInfo)
  }

}
