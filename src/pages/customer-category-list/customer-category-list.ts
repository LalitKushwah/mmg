import { AdminListProductPage } from './../admin-list-product/admin-list-product';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { CONSTANTS } from '../../utils/constants';
import { CustomerListProductPage } from '../customer-list-product/customer-list-product';
import { CustomerReviewSubmitOrderPage } from '../customer-review-submit-order/customer-review-submit-order';

@IonicPage({
  name: 'CustomerCategoryListPage'
})

@Component({
  selector: 'page-customer-category-list',
  templateUrl: 'customer-category-list.html',
})
export class CustomerCategoryListPage {

  parentCategoryId: string = ''
  categoryObj: any = {}
  categoryListAvailable: Boolean = false
  childCategoryList: Array<any> = []
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  cart: any = []
  tkPoint: any = 0
  searchQuery: string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService
  , private storageService: StorageServiceProvider) {
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.categoryObj = this.navParams.get("category")
    this.categoryListAvailable = false
    this.childCategoryList = []
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getList()
  }

  getList() {
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

  async getProducts(category) {
    const categoryObj = {
      'categoryId' : category['_id'],
      'category': category,
      'isSearch': false
    }
    let profile = await this.storageService.getFromStorage('profile')
    if(profile['type'] === 'admin') {
      this.navCtrl.push(AdminListProductPage, categoryObj)
    } else{
      this.navCtrl.push(CustomerListProductPage, categoryObj)
    }
  }

  ionViewDidEnter(){
    this.getCardItems()
  }

  async getCardItems() {
    this.cart = await this.storageService.getCartFromStorage()
    this.tkPoint = await this.storageService.getTkPointsFromStorage()
  }

  async reviewAndSubmitOrder() {
    if (this.cart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    }else {
      let orderTotal = await this.storageService.getFromStorage('orderTotal')
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal' : orderTotal
      })
    }
  }

  doInfinite(infiniteScroll) {
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

  doRefresh(refresher) : void {
    this.getList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getItems(ev: any) {
    let val = ev.target.value
    this.searchQuery = val
    if (ev.type === "mousedown"){
    }
  }

  async submitSearch(ev: any) {
    if (this.searchQuery && this.searchQuery.trim() != '') {
      let data = {
        'keyword': this.searchQuery,
        'parentCategoryId': this.parentCategoryId,
        'isSearch': true,
        'category': this.categoryObj
      };
      let profile = await this.storageService.getFromStorage('profile')
      this.searchQuery  = ''
      if(profile['type'] === 'admin') {
        this.navCtrl.push(AdminListProductPage, data)
      } else{
        this.navCtrl.push(CustomerListProductPage, data)
      }
    }
  }
  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }
}


