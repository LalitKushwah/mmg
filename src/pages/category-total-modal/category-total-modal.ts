import { WidgetUtilService } from '../../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { GenericService } from '../../providers/generic-service/generic-service';

@IonicPage({
  name: 'CategoryTotalModalPage'
})
@Component({
  selector: 'page-category-total-modal',
  templateUrl: 'category-total-modal.html',
})
export class CategoryTotalModalPage {

  cartItems: any = {}
  skipValue: number = 0
  limit: number = 1000
  categoryListAvailable: boolean = false
  parentCategoryList: Array<any> = []

  constructor (
    public viewController: ViewController,
    public navParams: NavParams,
    private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService,
    private genericService: GenericService) {
    this.categoryListAvailable = false
    this.cartItems = this.navParams.get('cartItems')
    if (this.navParams.data && this.navParams.data.cartItems) {
      this.cartItems = this.navParams.data.cartItems
    }
    this.getParenCategoryList()
  }

  getParenCategoryList () {
    /** REFACTORED PART */
    const parentCategoryList = this.genericService.parentCategories;
    if (parentCategoryList.length) {
      this.parentCategoryList = parentCategoryList
      this.calculateTotal();
      this.categoryListAvailable = true      
    } else {
      this.apiService.getParentCategoryList(this.skipValue, this.limit).subscribe((result) => {
        this.parentCategoryList = result.body
        this.calculateTotal();
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
  }

  dismissModal () {
    this.viewController.dismiss()
  }

  calculateTotal () {
    this.parentCategoryList.map(parentCategoryObj => {
        parentCategoryObj.subTotal = 0;
    });
    this.cartItems.map(cartItem => {
      this.parentCategoryList.map(parentCategoryObj => {
        if (cartItem['parentCategoryId'] === parentCategoryObj['_id']) {
          if ((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
            parentCategoryObj.subTotal = (parseFloat(parentCategoryObj.subTotal)) + (parseFloat(cartItem.subTotal))
          } else {
            parentCategoryObj.subTotal = (parseFloat(cartItem.subTotal))
          }
        }
      })
    });
    this.parentCategoryList.map(parentCategoryObj => {
      if ((parentCategoryObj.subTotal) && (parseFloat(parentCategoryObj.subTotal) > 0)) {
        parentCategoryObj.subTotal = parseFloat((Math.round(parentCategoryObj.subTotal * 100) / 100).toString()).toFixed(2)
      } else {
        parentCategoryObj.subTotal = 0
      }
    });
  }

}
