import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { EditUserPage } from '../edit-user/edit-user';

@IonicPage({
  name: 'AdminListSalesmanPage'
})
@Component({
  selector: 'page-admin-list-salesman',
  templateUrl: 'admin-list-salesman.html',
})
export class AdminListSalesmanPage {
  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  salesmanList: Array<any> = [];
  filteredSalesmanList: Array<any> = [];
  salesmanListAvailable: Boolean = false
  searchQuery: string
  allSalesman = []

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
  getUserList() {
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

  // doInfinite(infiniteScroll) {
  //   this.skipValue = this.skipValue + this.limit
  //   this.apiService.getCustomerList(this.skipValue, this.limit).subscribe((result) => {
  //     if(result.body.length > 0) {
  //       result.body.map( (value) => {
  //         this.salesmanList.push(value)
  //       })
  //     } else {
  //       this.skipValue = this.limit
  //     }
  //     infiniteScroll.complete();
  //   }, (error) => {
  //     infiniteScroll.complete();
  //     if (error.statusText === 'Unknown Error') {
  //       this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
  //     } else {
  //       this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
  //     }
  //   })
  // }

  // doRefresh(refresher) : void {
  //   this.getUserList()
  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 1000);
  // }

  resetPasswordModel(user) {
    /* const resetPasswordConfirm = this.modal.create('ResetPasswordModelPage', {message: 'Are you sure you want to reset password for ' +  customerName})
    resetPasswordConfirm.present()
    resetPasswordConfirm.onDidDismiss((result) => {
      console.log('result', result)
    }) */
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

  resetPassword(user) {
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

  searchSalesman(searchQuery) {
      this.filteredSalesmanList = this.allSalesman.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )}

 async editSalesman(salesman) {
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
    // await this.storageService.setToStorage('editCustomerInfo', user)
    // this.navCtrl.push(EditUserPage)
  

}
