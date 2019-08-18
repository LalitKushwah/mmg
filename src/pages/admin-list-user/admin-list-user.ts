import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, AlertController, Searchbar, ModalController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CONSTANTS } from '../../utils/constants';
import { EditUserPage } from '../edit-user/edit-user';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AdminDashboardPage } from '../admin-dashboard/admin-dashboard';

@IonicPage({
  name: 'AdminListUserPage'
})
@Component({
  selector: 'page-admin-list-user',
  templateUrl: 'admin-list-user.html',
})
export class AdminListUserPage {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('searchbar') searchbar : Searchbar;
  
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userList: Array<any> = [];
  filteredUserList: Array<any> = [];
  userListAvailable: Boolean = false
  searchQuery: string
  allCustomers = []
  searchKeyword = ''

  constructor (public navCtrl: NavController, public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private widgetUtil: WidgetUtilService,
              private alertCtrl: AlertController,
              private storageService: StorageServiceProvider,
              private modal: ModalController) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.searchKeyword = navParams.get('searchedKeyword')
    if (!this.searchKeyword) {
      this.getUserList()
    }
  }

  ionViewWillEnter () {
    this.apiService.getAllCustomers().subscribe((result) => {
      if (result.body && result.body.length > 0) {
        this.allCustomers = result.body
        if (this.searchKeyword) {
          // this.userListAvailable = true
          this.searchCustomers(this.searchKeyword)
        }
      }
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
  getUserList () {
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

  doInfinite (infiniteScroll) {
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

  doRefresh (refresher) : void {
    this.getUserList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  resetPasswordModel (user) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Reset Password!')
    alert.setMessage('Are you sure you want to reset password for ' +  user.name)
    alert.addButton({
      text: 'No',
      role: 'cancel',
      handler: () => {}
    });
    alert.addButton({
      text: 'Yes',
      cssClass: 'secondary',
      handler: () => {
        this.resetPassword(user)
      }
    })
    alert.present(alert)
  }

  resetPassword (user) {
    console.log(user)
    this.apiService.resetUserPassowrd(user['_id']).subscribe((result) => {
      console.log(result)
      this.widgetUtil.showToast(`Password reset successfully. New password: ${CONSTANTS.DEFUALT_PASSWORD}`)
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  searchCustomers (searchQuery) {
      this.filteredUserList = this.allCustomers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      this.userList = this.filteredUserList
      this.userListAvailable = true
  }

   async editCustomer (user) {
      const res = await this.storageService.setToStorage('editCustomerInfo', user)
      this.navCtrl.push(EditUserPage, {searchedKeyword: this.searchbar.value})
    }

    ionViewDidLoad () {
      this.navBar.backButtonClick = () => {
        this.navCtrl.setRoot(AdminDashboardPage)
      }
      if (this.searchKeyword) {
        this.searchbar.value = this.searchKeyword
      }
    }

  ionViewDidEnter () {
    this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(AdminDashboardPage)
    }
    if (this.searchKeyword) {
      this.searchbar.value = this.searchKeyword
    }
  }

async openCustomerDashboardModel (user) {
    const res = await this.storageService.setToStorage('editCustomerInfo', user)
    const payModal = this.modal.create('ViewCustomerDataPage')
    payModal.present();
  }
}
