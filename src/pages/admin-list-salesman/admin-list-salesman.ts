import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, ModalController, Searchbar } from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { EditUserPage } from '../edit-user/edit-user';
import { AdminDashboardPage } from '../admin-dashboard/admin-dashboard';

@IonicPage({
  name: 'AdminListSalesmanPage'
})
@Component({
  selector: 'page-admin-list-salesman',
  templateUrl: 'admin-list-salesman.html',
})
export class AdminListSalesmanPage {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('searchbar') searchbar: Searchbar;


  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  salesmanList: Array<any> = [];
  filteredSalesmanList: Array<any> = [];
  salesmanListAvailable: Boolean = false
  searchQuery: string
  allSalesman = []
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
    this.getUserList()
  }

  ionViewWillEnter () {
    this.apiService.getAllSalesman().subscribe((result) => {
      if (result.body && result.body.length > 0) {
        this.allSalesman = result.body
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
    this.apiService.getAllSalesman().subscribe((result) => {
      this.salesmanList = result.body
      this.filteredSalesmanList = this.salesmanList
      this.salesmanListAvailable = true
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.salesmanListAvailable = true
    })
  }

  async editCustomer (user) {

    await this.storageService.setToStorage('editCustomerInfo', user)
    this.navCtrl.push(EditUserPage, { searchedKeyword: this.searchbar.value })
  }

  searchSalesman (searchQuery) {
    this.filteredSalesmanList = this.allSalesman.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  async editSalesman (salesman) {
    const confirm = this.alertCtrl.create({
      title: 'Edit Salesman Information',
      message: 'Are you sure to edit?',
      buttons: [
        {
          text: 'Dismiss',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.storageService.setToStorage('editCustomerInfo', salesman).then(() => {
              this.navCtrl.push(EditUserPage)
            })
          }
        }
      ]
    });
    confirm.present();
  }

  async openCustomerDashboardModel (user) {
    await this.storageService.setToStorage('editCustomerInfo', user)
    const payModal = this.modal.create('ViewCustomerDataPage')
    payModal.present();
  }

  ionViewDidLoad () {
    this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(AdminDashboardPage);
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
}
