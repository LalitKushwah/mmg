import { WidgetUtilService } from './../utils/widget-utils';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../utils/constants';
import { CustomerListProductPage } from '../customer-list-product/customer-list-product';

@IonicPage({
  name: 'CustomerCategoryListPage'
})

@Component({
  selector: 'page-customer-category-list',
  templateUrl: 'customer-category-list.html',
})
export class CustomerCategoryListPage {

  parentCategoryId: string = ''
  categoryListAvailable: Boolean = false
  childCategoryList: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.categoryListAvailable = false
    this.childCategoryList = []
    this.getList()
  }

  getList() {
    this.apiService.getChildCategoryList(this.parentCategoryId).subscribe((result) => {
      this.childCategoryList = result.body
      console.log('this.childCategoryList', this.childCategoryList)
      this.categoryListAvailable = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.categoryListAvailable = true
    })
  }

  getProducts(categoryId) {
    const categoryObj = {
      'categoryId' : categoryId
    }
    this.navCtrl.push(CustomerListProductPage, categoryObj)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}


