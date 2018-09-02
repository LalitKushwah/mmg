import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { WidgetUtilService } from './../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { CONSTANTS } from '../utils/constants';
import { CustomerCategoryListPage } from '../customer-category-list/customer-category-list';


@IonicPage({
  name: 'CustomerHomePage'
})
@Component({
  selector: 'page-customer-home',
  templateUrl: 'customer-home.html',
})
export class CustomerHomePage {

  parentCategoryList: Array<any> = [];
  categoryListAvailable: Boolean = false


  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService, private apiService: ApiServiceProvider) {
    this.categoryListAvailable = false
    this.parentCategoryList = []
    this.getList()
  }

  getList() {
    this.apiService.getParentCategoryList().subscribe((result) => {
      this.parentCategoryList = result.body
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

  getChildCategory(parentCategoryId) {
    const categoryObj = {
      'parentCategoryId' : parentCategoryId
    }
    this.navCtrl.push(CustomerCategoryListPage, categoryObj)
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}