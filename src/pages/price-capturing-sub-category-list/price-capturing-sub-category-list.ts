import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';

/**
 * Generated class for the PriceCapturingSubCategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-capturing-sub-category-list',
  templateUrl: 'price-capturing-sub-category-list.html',
})
export class PriceCapturingSubCategoryListPage {
  parentCategoryId: string = ''
  categoryObj: any = {}
  categoryListAvailable: Boolean = false
  childCategoryList: Array<any> = []
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  cart: any = []
  tkPoint: any = 0
  searchQuery: string = '' 
  isEditFlow = false

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private apiService: ApiServiceProvider, 
    private widgetUtil: WidgetUtilService, 
    private storageService: StorageServiceProvider) {

      this.parentCategoryId = this.navParams.get("parentCategoryId")
      this.categoryObj = this.navParams.get("category")
      this.isEditFlow = this.navParams.get("isEdit")
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
  
    ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingSubCategoryListPage');
  }


}
