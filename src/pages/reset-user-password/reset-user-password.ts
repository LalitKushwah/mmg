import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { CONSTANTS } from '../../utils/constants';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { HomePage } from '../home/home';

@IonicPage({
  name: 'ResetUserPasswordPage'
})

@Component({
  selector: 'page-reset-user-password',
  templateUrl: 'reset-user-password.html',
})

export class ResetUserPasswordPage implements OnInit {

  resetPasswordForm : FormGroup;
  passwordLogin: FormControl;
  oldPassword: FormControl;
  newPasssword: FormControl;
  reEnterPassword: FormControl;
  showLoader = false

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService,
              private storageService: StorageServiceProvider, public appCtrl: App,
              private viewController: ViewController) {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.oldPassword = new FormControl('', [
      Validators.required
    ]);
    this.newPasssword = new FormControl('', [
      Validators.required
    ]);
    this.reEnterPassword = new FormControl('', [
      Validators.required
    ]);
   }

   createForm() {
    this.resetPasswordForm = new FormGroup({
      oldPassword: this.oldPassword,
      newPasssword: this.newPasssword,
      reEnterPassword: this.reEnterPassword,
    });
   }

   async changePassword() {
     if(this.reEnterPassword.value.trim() === this.newPasssword.value.trim()) {
        let user = await this.storageService.getFromStorage('profile')
        this.showLoader = true
        let data = {
          currentPassword: this.oldPassword.value.trim(),
          newPassword: this.newPasssword.value.trim(),
          userId:  user['_id']
        }
        this.apiService.changePassword(data).subscribe((result) => {
        this.widgetUtil.showToast(CONSTANTS.PASSWORD_CHANGE_SUCCESS)
        setTimeout(()=> {
          this.logout()
        }, 1500)
        this.showLoader = false
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.INCORRECT_PASSWORD)
        }
        this.showLoader = false
      })
    } else {
        this.widgetUtil.showToast(CONSTANTS.PASSWORD_MISMTACH)
     }
   }

   async logout() {
    this.storageService.clearStorage()
    localStorage.clear()
    this.widgetUtil.dismissPopover()
    this.appCtrl.getRootNav().push(HomePage)
    this.viewController.dismiss()
  }
}
