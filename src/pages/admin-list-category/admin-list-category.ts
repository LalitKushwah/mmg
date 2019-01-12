import { AdminListSubCategoryPage } from './../admin-list-sub-category/admin-list-sub-category';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { PopoverHomePage } from '../popover-home/popover-home';

@IonicPage({
  name: 'AdminListCategoryPage'
})
@Component({
  selector: 'page-admin-list-category',
  templateUrl: 'admin-list-category.html',
})
export class AdminListCategoryPage {
  parentCategoryList: Array<any> = [];
  categoryListAvailable: Boolean = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT


  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService, private apiService: ApiServiceProvider) {
    this.categoryListAvailable = false
    this.parentCategoryList = []
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
  }

  getList() {
    this.apiService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
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

  getChildCategory(category) {
    const categoryObj = {
      'parentCategoryId' : category['_id'],
      'category': category
    }
    this.navCtrl.push(AdminListSubCategoryPage, categoryObj)
  }

  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.parentCategoryList.push(value)
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
}
