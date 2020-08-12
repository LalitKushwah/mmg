import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { CONSTANTS } from '../../utils/constants';
import { CustomerCategoryListPage } from '../customer-category-list/customer-category-list';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { CustomerReviewSubmitOrderPage } from '../customer-review-submit-order/customer-review-submit-order';
import { SmEditOrderPage } from '../sm-edit-order/sm-edit-order';
import { GenericService } from '../../providers/generic-service/generic-service';


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
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  cart: any = []
  tkPoint: any = 0
  isEditFlow = false
  selectedCustomer: any;
  isSalesman = false;


  constructor (public navCtrl: NavController,
              public navParams: NavParams,
              private widgetUtil: WidgetUtilService,
              private apiService: ApiServiceProvider,
              private storageService: StorageServiceProvider,
              private alertCtrl: AlertController,
              private genericService: GenericService) {

    this.categoryListAvailable = false
    this.parentCategoryList = []
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.isEditFlow = this.navParams.get('isEdit')
    this.getList()
    this.getVersion()
  }

  async ionViewDidEnter (){
    const profile = await this.storageService.getFromStorage('profile');
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
      this.isSalesman = true;
      this.selectedCustomer = await this.storageService.getSelectedCustomer();
    } 
    this.getCardItems()
  }

  async getCardItems () {
    const storedEditedOrder: any = await this.storageService.getFromStorage('order')
    // update cart count badge when edit order flow is in active state
    if (this.isEditFlow && storedEditedOrder) {
      this.cart = storedEditedOrder.productList ? storedEditedOrder.productList : []
      this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0
    } else {
      if (this.isSalesman) {
        this.cart = await this.storageService.getSelectedCartFromStorage(this.selectedCustomer._id);
        this.tkPoint = this.selectedCustomer.tkPoint;
      } else {
        this.cart = await this.storageService.getCartFromStorage();
        this.storageService.getTkPointsFromStorage().then(res => {
          this.tkPoint = res
        })
      }
    }
   }

  async reviewAndSubmitOrder () {
   if (!this.isEditFlow) {
    if (this.cart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    } else {
      let orderTotal: any;
      if (this.isSalesman) {
        orderTotal = this.selectedCustomer.orderTotal;
      } else {
        orderTotal = await this.storageService.getFromStorage('orderTotal');
      }
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal' : orderTotal
      })
    }
   } else {
      this.navCtrl.setRoot(SmEditOrderPage)
   }
  }

  getList () {
    /** REFACTORED PART */
    const parentCategoryList = this.genericService.parentCategories;
    
    if (parentCategoryList.length) {
      this.parentCategoryList = parentCategoryList
      this.categoryListAvailable = true
    } else {
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
  }

  getChildCategory (category) {
    const categoryObj = {
      'parentCategoryId' : category['_id'],
      'category' : category,
      'isEdit': this.isEditFlow
    }
    this.navCtrl.push(CustomerCategoryListPage, categoryObj)
  }

  presentPopover (myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  doRefresh (refresher) : void {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  showTkToast () {
    this.widgetUtil.showToast('TK points will convert into TK currency post target achievement of QTR')
  }

  doInfinite (infiniteScroll) {
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

  getVersion () {
    this.apiService.getVersion().subscribe(res => {
      if (res.version !== 1.4) {
        const alert = this.alertCtrl.create({
          title: 'Information',
          subTitle: 'New Version of App is Available',
          buttons: ['OK']
        });
        alert.present();
      }
      })
  }
}
