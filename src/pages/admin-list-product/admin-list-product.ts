import { AdminEditProductPage } from './../admin-edit-product/admin-edit-product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CommonService } from '../../providers/common.service';

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
  categoryId: string = ''
  categoryObj: any = {}
  keyword: string = ''
  parentCategoryId: string = ''
  isSearch: Boolean = false
  filteredProductList: Array<any> = [];
  isUserAuthorized = false;
  loggedInUserStore = []
  allProducts = []
  storeList = []


  constructor (public navCtrl: NavController,
               public navParams: NavParams, 
               private apiService: 
               ApiServiceProvider, 
               private widgetUtil: WidgetUtilService,
               private commonService: CommonService) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    // this.categoryId = this.navParams.get("categoryId")
    this.categoryObj = this.navParams.get("category")
    this.categoryId = this.categoryObj._id
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.isSearch = this.navParams.get("isSearch")
    this.keyword = this.navParams.get("keyword")
    this.getProductList()
  }

  ionViewWillEnter () {
    // INFO: get All products corresponding to category
    this.apiService.getAllProductsByCategory(this.categoryId).subscribe((result) => {
      if (result.body && result.body.length) {
        this.allProducts = result.body
        this.allProducts.map((product: any) => {
          product['quantity'] = 1
        })
      }
    }, error => {
          if (error.statusText === 'Unknown Error') {
            this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
          } else {
            this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
          }
    })
  }

  getProductList () {
    if(!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
        })
        this.filteredProductList = this.productList
        this.productListAvailable = true
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
        this.productListAvailable = true
      })
    } else {
      this.apiService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
        })
        this.filteredProductList = this.productList
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
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
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

  doRefresh (refresher) : void {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getProductList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  editProduct (product) {
    let productInfo = {
      'product': product
    }
    this.navCtrl.push(AdminEditProductPage, productInfo)
  }

  async ngOnInit () {
    this.isUserAuthorized = await this.commonService.isAuthorized()
    const res: any = await this.commonService.getLoggedInUser()
    if (res.associatedStore && res.associatedStore.length) {
      this.loggedInUserStore = res.associatedStore
    }
  }

  searchProducts (searchQuery) {
    this.filteredProductList = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )}
}
