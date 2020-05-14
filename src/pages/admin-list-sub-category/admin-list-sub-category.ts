import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { AdminListProductPage } from '../admin-list-product/admin-list-product';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

@IonicPage()
@Component({
  selector: 'page-admin-list-sub-category',
  templateUrl: 'admin-list-sub-category.html',
})
export class AdminListSubCategoryPage {
  parentCategoryId: string = ''
  categoryObj: any = {}
  categoryListAvailable: Boolean = false
  childCategoryList: Array<any> = []
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  searchQuery: string = ''  

  constructor (public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private widgetUtil: WidgetUtilService,
              private storageService: StorageServiceProvider) {
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.categoryObj = this.navParams.get("category")
    this.categoryListAvailable = false
    this.childCategoryList = []
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
  }

  getList () {
    this.apiService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      this.childCategoryList = result.body
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

  async getProducts (category) {
    const categoryObj = {
      'categoryId' : category['_id'],
      'category' : category
    }
    this.navCtrl.push(AdminListProductPage, categoryObj)
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getChildCategoryList(this.parentCategoryId, this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.childCategoryList.push(value)
        })
      }else {
        this.skipValue = this.limit
      }
      infiniteScroll.complete();
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      infiniteScroll.complete();
    })
  }

  doRefresh (refresher) : void {
    this.getList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getItems (ev: any) {
    let val = ev.target.value
    this.searchQuery = val
    if (ev.type === "mousedown"){
    }
  }

  async submitSearch (ev: any) {
    if (this.searchQuery && this.searchQuery.trim() != '') {
      let data = {
        'keyword': this.searchQuery,
        'parentCategoryId': this.parentCategoryId,
        'isSearch': true,
        'category': this.categoryObj
      };
      this.searchQuery  = ''
      this.navCtrl.push(AdminListProductPage, data)
    }
  }
}
