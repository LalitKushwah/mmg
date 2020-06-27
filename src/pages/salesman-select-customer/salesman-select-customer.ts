import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { UserProfilePage } from '../user-profile/user-profile';

@IonicPage()
@Component({
  selector: 'page-salesman-select-customer',
  templateUrl: 'salesman-select-customer.html',
})
export class SalesmanSelectCustomerPage {

  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userList: Array<any> = [];
  filteredUserList: Array<any> = [];
  userListAvailable: Boolean = false
  searchQuery: string
  allCustomers = []
  abc: any;

   constructor (public navCtrl: NavController, 
                public navParams: NavParams,
                private apiService: ApiServiceProvider,
                private widgetUtil: WidgetUtilService,
                private storageService: StorageServiceProvider,
                private widgetService: WidgetUtilService) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT

    // fix asked in release-1.5
    this.clearCart();
    this.getUserList()
  }

  async clearCart () {
    // fix asked in release-1.5
    const agree = await this.widgetService.showConfirm('Cart Exists!', 'Do you want to clear existing cart?');
    if (agree === 'Yes') {
      this.storageService.clearCart().then(() => {
        this.widgetUtil.showToast('Existing cart has been cleared successfully...');
      }).catch(err => {
          this.widgetUtil.showToast(`Error whlile clearing existing cart ${err}`);
      })
    }
  }

  async getUserList () {
    let profile: any = await this.storageService.getFromStorage('profile')
    this.apiService.getAssociatedCustomersListBySalesman(profile.externalId).subscribe((result: any) => {
      this.userList = result.body
      this.allCustomers = this.userList
      this.filteredUserList = this.userList
      this.userListAvailable = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.userListAvailable = true
    })
  }

  doRefresh (refresher) : void {
    this.getUserList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  selectCustomer (user) {
    this.customerSelected(user)
  } 
  customerSelected (user) {
    //Set the Selected Customer to Storage
    //this.storageService.setToStorage('selectedCustomer', user)

    this.storageService.setToStorage('selectedCustomer', user)

    //Setting a flag to indicated that Customer Dashboard has been Navigated from Salesman Dashboard
    //this.storageService.setToStorage('navigatedFromSalesman','true')
    //console.log(user)
    this.navCtrl.push(UserProfilePage)
  }

  searchCustomers (searchQuery) {
      this.filteredUserList = this.allCustomers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )}
}
