import { CustomerReviewSubmitOrderPage } from './../customer-review-submit-order/customer-review-submit-order';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
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
  keyword: string = ''
  parentCategoryId: string = ''
  categoryObj: any = {}
  productListAvailable: Boolean = false
  isSearch: Boolean = false
  productList: Array<any> = [];
  cartQuantity: any = 0;
  orderTotal: any = 0;
  cartDetail:any = []
  cart: any = []
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService
  , private storageService: StorageServiceProvider) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.categoryId = this.navParams.get("categoryId")
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.categoryObj = this.navParams.get("category")
    this.isSearch = this.navParams.get("isSearch")
    this.keyword = this.navParams.get("keyword")
    this.productListAvailable = false
    this.productList = []
    this.getList()
  }

  ionViewDidEnter(){
    this.getCartItems()
  }

  getList() {
    if(!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
        })
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

  async getCartItems() {
    this.cart = await this.storageService.getFromStorage('cart')
    if(this.cart.length > 0) {
      let updatedTotal = 0, updatedQuantity = 0;
      this.cart.map((value) => {
        updatedTotal = updatedTotal + (value.price * parseInt(value.quantity))
        updatedQuantity = updatedQuantity + parseInt(value.quantity)
      })
      this.orderTotal = updatedTotal
      this.cartQuantity = updatedQuantity
    } else {
      this.cartQuantity = 0
      this.orderTotal = 0
    }
    let result = await this.storageService.setToStorage('orderTotal', this.orderTotal)
  }

  reviewAndSubmitOrder() {
    if (this.cart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    }else {
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal' : this.orderTotal
      })
    }
  }

  async addToCart(product, qty) {
    if(parseInt(qty) > 0) {
      this.widgetUtil.showToast(`${product.name} added to cart!`)
      delete product['categoryId']
      delete product['productCode']
      /* product['quantity'] = parseInt(qty) */
      let presentInCart = false;
      const productsInCart = this.cart.map((value)=> {
        if (value['_id'] === product['_id']) {
          presentInCart = true
          value.quantity = value.quantity + product.quantity
        }
        return value
      })
      if(!presentInCart) {
        let obj ={}
        Object.assign(obj, product)
        obj['quantity'] = parseInt(qty)
        this.cart.push(obj)
      } else {
        this.cart = productsInCart
      }
      this.cartDetail = await this.storageService.setToStorage('cart', this.cart)
      let updatedTotal = 0, updatedQuantity = 0;
      this.cartDetail.map((value) => {
        updatedTotal = updatedTotal + (parseFloat(value.price) * parseInt(value.quantity))
        updatedQuantity = updatedQuantity + parseInt(value.quantity)
      })
      this.orderTotal = updatedTotal
      this.cartQuantity = updatedQuantity
      this.storageService.setToStorage('cart', this.cart)
    } else {
      this.widgetUtil.showToast(`Atleast 1 quantity is required!`)
    }
  }

  async removeFromCart(product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    if (this.cart.length > 0) {
      this.cart.map((value, index) => {
        if(value['_id'] === product['_id']) {
          this.cart.splice(index, 1)
        }
      })
      this.getCartItems()
    }
  }

  decrementQty(qty) {
    if(parseInt(qty) > 1) {
      return (parseInt(qty) - 1)
    }
    return parseInt(qty)
  }

  incrementQty(qty) {
    return (parseInt(qty) + 1)
  }

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    if(!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        if(result.body.length > 0) {
          result.body.map( (value) => {
            value.quantity = 0
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
    } else {
      this.apiService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        if(result.body.length > 0) {
          result.body.map( (value) => {
            value.quantity = 0
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
  }

  doRefresh(refresher) : void {
    this.getList()
    this.getCartItems()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
