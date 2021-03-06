import { WidgetUtilService } from './../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'CategoryTotalModalPage'
})
@Component({
  selector: 'page-category-total-modal',
  templateUrl: 'category-total-modal.html',
})
export class CategoryTotalModalPage {

  cartItems :any = {}
  skipValue: number = 0
  limit: number = 1000
  categoryListAvailable: boolean = false
  parentCategoryList: Array<any> = []

  constructor(public viewController: ViewController, public navParams: NavParams,
    private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
      this.categoryListAvailable = false
    this.cartItems = this.navParams.get('cartItems')
    this.getParenCategoryList()
  }

  getParenCategoryList() {
    this.apiService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
      this.parentCategoryList = result.body
      this.cartItems.map(cartItem => {
        this.parentCategoryList.map(parentCategoryObj => {
          if(cartItem['parentCategoryId'] === parentCategoryObj['_id']) {
            if((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
              parentCategoryObj.subTotal = (parseFloat(parentCategoryObj.subTotal)) + (parseFloat(cartItem.subTotal))
            } else {
              parentCategoryObj.subTotal = (parseFloat(cartItem.subTotal))
            }
          } 
        })
      })
      this.parentCategoryList.map(parentCategoryObj => {
        if((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
          parentCategoryObj.subTotal = parseFloat((Math.round(parentCategoryObj.subTotal * 100) / 100).toString()).toFixed(2)
        } else {
          parentCategoryObj.subTotal = 0
        }
      })
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

  dismissModal() {
    this.viewController.dismiss()
  }

}
