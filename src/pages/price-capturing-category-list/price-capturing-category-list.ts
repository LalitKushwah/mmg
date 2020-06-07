import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { WidgetUtilService } from '../../utils/widget-utils';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { PriceCapturingSubCategoryListPage } from '../price-capturing-sub-category-list/price-capturing-sub-category-list';

/**
 * Generated class for the PriceCapturingCategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-capturing-category-list',
  templateUrl: 'price-capturing-category-list.html',
})
export class PriceCapturingCategoryListPage {
  parentCategoryList: Array<any> = [];
  categoryListAvailable: Boolean = false
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  cart: any = []
  tkPoint: any = 0
  isEditFlow = false

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    private widgetUtil: WidgetUtilService,
    private apiService: ApiServiceProvider,
    private storageService: StorageServiceProvider,
    private alertCtrl: AlertController) {
      this.categoryListAvailable = false
      this.parentCategoryList = []
      this.skipValue = 0
      this.limit = CONSTANTS.PAGINATION_LIMIT
      this.isEditFlow = this.navParams.get('isEdit')
      this.getList()
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingCategoryListPage');
  }

  getList () {
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

  getChildCategory (category) {
    const categoryObj = {
      'parentCategoryId' : category['_id'],
      'category' : category,
      'isEdit': this.isEditFlow
    }
    this.navCtrl.push(PriceCapturingSubCategoryListPage, categoryObj)
  }

}
