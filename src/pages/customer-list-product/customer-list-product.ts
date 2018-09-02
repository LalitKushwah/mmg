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
  productListAvailable: Boolean = false
  productList: Array<any> = [];
  cartQuantity: any = 0;
  orderTotal: any = 0;
  cartDetail:any = []
  cart: any = []

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService
  , private storageService: StorageServiceProvider) {
    this.categoryId = this.navParams.get("categoryId")
    this.productListAvailable = false
    this.productList = []
    this.getList()
    this.getCardItems()
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

  async getCardItems() {
    this.cart = await this.storageService.getFromStorage('cart')
    if(this.cart.length > 0) {
      let updatedTotal = 0, updatedQuantity = 0;
      this.cart.map((value) => {
        updatedTotal = updatedTotal + (value.price * parseInt(value.quantity))
        updatedQuantity = updatedQuantity + parseInt(value.quantity)
      })
      this.orderTotal = updatedTotal
      this.cartQuantity = updatedQuantity
    }
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
    delete product['categoryId']
    delete product['productCode']
    product['quantity'] = parseInt(qty)
    let presentInCart = false;
    const productsInCart = this.cart.map((value)=> {
      if (value['_id'] === product['_id']) {
        presentInCart = true
        value.quantity = value.quantity + product.quantity
      }
      return value
    })
    if(!presentInCart) {
      this.cart.push(product)
    } else {
      this.cart = productsInCart
    }
    this.cartDetail = await this.storageService.setToStorage('cart', this.cart)
    let updatedTotal = 0, updatedQuantity = 0;
    this.cartDetail.map((value) => {
      updatedTotal = updatedTotal + (value.price * parseInt(value.quantity))
      updatedQuantity = updatedQuantity + parseInt(value.quantity)
    })
    this.orderTotal = updatedTotal
    this.cartQuantity = updatedQuantity
  }

  doRefresh(refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
