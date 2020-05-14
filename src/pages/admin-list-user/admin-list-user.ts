import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, AlertController, Searchbar, ModalController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CONSTANTS } from '../../utils/constants';
import { EditUserPage } from '../edit-user/edit-user';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AdminDashboardPage } from '../admin-dashboard/admin-dashboard';
import { SalesmanDashboardPage } from '../salesman-dashboard/salesman-dashboard';

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
  profile = {}

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

  async ngOnInit () {
    this.profile = await this.storageService.getFromStorage('profile')
  }

  ionViewWillEnter () {
    this.getUserList()
    this.getAllCustomers()
  }

  getAllCustomers () {
    this.apiService.getAllCustomers().subscribe((res:any) => {
      this.allCustomers = res.body
    }, (err: any) => {
      console.log(err);
      
    })
  }

  async getUserList () {
    if (this.profile['userType'] === 'ADMINHO') {
      this.apiService.getCustomerList(this.skipValue, this.limit).subscribe((result) => {
        if (result.body && result.body.length > 0) {
          // this.allCustomers = result.body
          this.filteredUserList = result.body
          this.userList = this.filteredUserList
          this.userListAvailable = true
          if (this.searchKeyword) {
            this.userListAvailable = true
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
    } else if (this.profile['userType'] === 'ADMIN') {
      this.apiService.getCustomersByProvince(this.profile['province']).subscribe((result: any) => {
        if (result.body && result.body.length > 0) {
          // this.allCustomers = result.body
          this.filteredUserList = result.body
          this.userList = this.filteredUserList
          this.userListAvailable = true
          if (this.searchKeyword) {
            this.userListAvailable = true
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
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    if (this.profile['userType'] === 'ADMINHO'){
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

  }

  doRefresh (refresher) : void {
    this.getUserList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  searchCustomers (searchQuery) {
      this.filteredUserList = this.allCustomers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      this.userList = this.filteredUserList
      this.userListAvailable = true
  }

   async editCustomer (user) {
      await this.storageService.setToStorage('editCustomerInfo', user)
      this.navCtrl.push(EditUserPage, {searchedKeyword: this.searchbar.value})
    }

    ionViewDidLoad () {
      const res: any = this.storageService.getFromStorage('profile')
      this.navBar.backButtonClick = () => {
        if (res.userType === 'SALESMAN' || res.userType === 'SALESMANAGER') {
          this.navCtrl.setRoot(SalesmanDashboardPage)
        } else {
          this.navCtrl.setRoot(AdminDashboardPage)
  
        }
      }
      if (this.searchKeyword) {
        this.searchbar.value = this.searchKeyword
      }
    }

    ionViewDidEnter () {
      const res: any = this.storageService.getFromStorage('profile')
      this.navBar.backButtonClick = () => {
        if (res.userType === 'SALESMAN' || res.userType === 'SALESMANAGER') {
          this.navCtrl.setRoot(SalesmanDashboardPage)
        } else {
          this.navCtrl.setRoot(AdminDashboardPage)          
        }
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
