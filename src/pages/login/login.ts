import { MyApp } from './../../app/app.component';
import { HomePage } from './../home/home';
import { WidgetUtilService } from './../utils/widget-utils';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  userLoginForm : FormGroup;
  passwordLogin: FormControl;
  userLoginId: FormControl;
  showLoginLoader = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private storageService: StorageServiceProvider
  , private widgetUtil: WidgetUtilService, private menuController: MenuController) {
    this.checkData()
  }

  async checkData() {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createFormControls() {
    this.userLoginId = new FormControl('', [
      Validators.required
    ]);
    this.passwordLogin = new FormControl('', [
      Validators.required
    ]);
   }

   createForm() {
    this.userLoginForm = new FormGroup({
      userLoginId: this.userLoginId,
      passwordLogin: this.passwordLogin
    });
   }


   login() {
    this.showLoginLoader = true;
    this.apiService.login({
      userLoginId: this.userLoginId.value.trim(),
      password: this.passwordLogin.value.trim()
    }).subscribe(async (result : any) => {
      this.storageService.setToStorage('token', result.body[0].token)
      this.storageService.setToStorage('profile', result.body[0])
      this.storageService.setToStorage('userType', result.body[0].userType)
      // this.storageService.setToStorage('cart', [])
      localStorage.setItem('token', result.body[0].token)
      this.showLoginLoader = false;
      this.navCtrl.setRoot(MyApp)
    }, (error:any) => {
      this.showLoginLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.AUTH_FAIL)
      }
    })
   }
}
