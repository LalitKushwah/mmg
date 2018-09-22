import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../utils/constants';
import { WidgetUtilService } from '../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage({
  name: 'AdminListCategoryPage'
})
@Component({
  selector: 'page-admin-list-category',
  templateUrl: 'admin-list-category.html',
})
export class AdminListCategoryPage {

  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  categoryList: Array<any> = [];
  categoryListAvailable: Boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getCategoryList()
  }

  getCategoryList() {
    this.apiService.getAllCategoryList(this.skipValue, this.limit).subscribe((result) => {
      this.categoryList = result.body
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

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getAllCategoryList(this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.categoryList.push(value)
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
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
