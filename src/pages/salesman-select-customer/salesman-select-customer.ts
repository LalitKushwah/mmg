import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { UserProfilePage } from '../user-profile/user-profile';
import { CommonService } from '../../providers/common.service';

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
  updatedSelectedCustomers: Array<any> = [];

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService,
    private commonService: CommonService,
    private storageService: StorageServiceProvider) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
  }

  async ionViewDidEnter () {
    const multiCart: any = await this.storageService.getFromStorage('multiCart');
    const customers: any = await this.storageService.getFromStorage('selectedCustomers');
    if (!!customers) {
      this.updatedSelectedCustomers = [];
      for (const key in multiCart) {
        for (let i = 0; i < customers.length; i++) {
          if (customers[i]._id === key) {
            this.updatedSelectedCustomers.push(customers[i]);
            break;
          }
        }
      }
      await this.storageService.setToStorage('selectedCustomers', this.updatedSelectedCustomers);
      if (this.updatedSelectedCustomers.length === 5) {
        this.widgetUtil.showToast('You already created the 5 carts, kindly place the order for any created cart');
      }
    }
    this.getUserList()
  }

  /* To rearrange customers in which selected customers appears first */
  rearrangeCustomers (selectedCustomers: Array<any>) {
    
  }

  async clearCart () {
    // fix asked in release-1.5
    const agree = await this.widgetUtil.showConfirm('Cart Exists!', 'Do you want to clear existing cart?');
    if (agree === 'Yes') {
      this.storageService.clearCart().then(() => {
        this.widgetUtil.showToast('Existing cart has been cleared successfully...');
      }).catch(err => {
        this.widgetUtil.showToast(`Error whlile clearing existing cart ${err}`);
      })
    }
  }

  async getUserList () {
    const cachedCustomerList = this.commonService.getCustomerAssociatedSMList();
    if (cachedCustomerList.length) {
      cachedCustomerList.map(item => {
        if (item.cartExists) {
          delete item.cartExists;
        }
        return item
      });
      this.setValues(cachedCustomerList);
    } else {
      let profile: any = await this.storageService.getFromStorage('profile')
      this.apiService.getAssociatedCustomersListBySalesman(profile.externalId).subscribe((result: any) => {
        this.setValues([...result.body]);
        this.commonService.setCustomerAssociatedSMList(result.body);
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
        this.userListAvailable = true
      })
    }
  }

  setValues (list: Array<any>) {
    this.updatedSelectedCustomers.forEach(item => {
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id === item._id) {
          const customer = list[i];
          customer.cartExists = true;
          list.splice(i, 1);
          list.unshift(customer);
          break;
        }
      }
    });
    this.userList = list;
    this.allCustomers = this.userList;
    this.filteredUserList = this.userList;
    this.userListAvailable = true
  }


  doRefresh (refresher): void {
    this.getUserList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  selectCustomer (user) {
    this.customerSelected(user)
  }

  async customerSelected (user) {
    this.storageService.setToStorage('selectedCustomer', user)
    let customers: any = await this.storageService.getFromStorage('selectedCustomers');
    if (customers) {
      let customerAlreadySelected = false;
      for (let i = 0; i < customers.length; i++) {
        if (customers[i]._id === user._id) {
          customerAlreadySelected = true;
          break;
        }
      }
      if (!customerAlreadySelected) {
        if (customers && customers.length === 5) {
          this.widgetUtil.showToast('Can not select a new customer, kindly place the order first for any created cart');
          return;
        }
        customers.push(user);
      }
  
      customers.map(customer => {
        if (customer._id === user._id) {
          customer.isSelected = true;
          if (!customer.orderTotal) {
            customer.orderTotal = 0;
          }
          if (!customer.totalNetWeight) {
            customer.totalNetWeight = 0;
          }
          if (!customer.tkPoint) {
            customer.tkPoint = 0;
          }
        } else {
          customer.isSelected = false;
        }
        return customer;
      })
      this.storageService.setToStorage('selectedCustomers', customers);
    } else {
      user.isSelected = true;
      customers = [user];
      await this.storageService.setToStorage('selectedCustomers', customers);
    }

    this.navCtrl.push(UserProfilePage)
  }

  searchCustomers (searchQuery) {
    this.filteredUserList = this.allCustomers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
}
