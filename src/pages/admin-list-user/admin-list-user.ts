import { ResetPasswordModelPage } from './../reset-password-model/reset-password-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Alert, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../utils/widget-utils';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'AdminListUserPage'
})
@Component({
  selector: 'page-admin-list-user',
  templateUrl: 'admin-list-user.html',
})
export class AdminListUserPage {

  skipValue: number = 0
  limit: number = CONSTANTS.PAGINATION_LIMIT
  userList: Array<any> = [];
  userListAvailable: Boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService
  , private modal: ModalController, private alertCtrl: AlertController) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getUserList()
  }

  getUserList() {
    this.apiService.getCustomerList(this.skipValue, this.limit).subscribe((result) => {
      this.userList = result.body
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
}
