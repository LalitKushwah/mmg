import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CONSTANTS } from '../../utils/constants';
import { CustomerHomePage } from '../customer-home/customer-home';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';

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

   constructor(public navCtrl: NavController, public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private widgetUtil: WidgetUtilService,
              private alertCtrl: AlertController,
              private storageService: StorageServiceProvider) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getUserList()
  }

  ionViewWillEnter() {
    this.apiService.getAllCustomers().subscribe((result) => {
      if (result.body && result.body.length > 0) {
        this.allCustomers = result.body
      }
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
  getUserList() {
    this.apiService.getCustomerList(this.skipValue, this.limit).subscribe((result) => {
      this.userList = result.body
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

  doInfinite(infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    this.apiService.getCustomerList(this.skipValue, this.limit).subscribe((result) => {
      if(result.body.length > 0) {
        result.body.map( (value) => {
          this.userList.push(value)
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

  doRefresh(refresher) : void {
    this.getUserList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  selectCustomer(user) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Confirm Customer!')
    alert.setMessage('Are you sure you want to place order for ' +  user.name)
    alert.addButton({
      text: 'No',
      role: 'cancel',
      handler: () => {}
    });
    alert.addButton({
      text: 'Yes',
      cssClass: 'secondary',
      handler: () => {
        this.customerSelected(user)
      }
    })
    alert.present(alert)
  } 
  customerSelected(user) {
    //console.log(user)
    //Set the Selected Customer to Storage
    this.storageService.setToStorage('selectedCustomer', user)

    this.navCtrl.push(CustomerHomePage)
  }

  searchCustomers(searchQuery) {
      this.filteredUserList = this.allCustomers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )}
}
