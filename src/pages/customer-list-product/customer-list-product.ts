import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WidgetUtilService } from '../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'CustomerListProductPage'
})
@Component({
  selector: 'page-customer-list-product',
  templateUrl: 'customer-list-product.html',
})
export class CustomerListProductPage {

  categoryId: string = ''
  productListAvailable: Boolean = false
  productList: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.categoryId = this.navParams.get("categoryId")
    this.productListAvailable = false
    this.productList = []
    this.getList()
  }

  getList() {
    this.apiService.getProductListByCategory(this.categoryId).subscribe((result) => {
      this.productList = result.body
      console.log('this.productList', this.productList)
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

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
