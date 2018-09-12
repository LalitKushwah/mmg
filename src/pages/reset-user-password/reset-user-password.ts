import { CONSTANTS } from './../utils/constants';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetUtilService } from '../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  reset() {
    if(this.newPasssword.value.trim() != this.reEnterPassword.value.trim()) {
      this.widgetUtil.showToast(CONSTANTS.PASSWORD_MISMTACH)
    }
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

}
