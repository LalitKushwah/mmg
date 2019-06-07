import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../utils/constants';

@IonicPage({
  name: 'AddUserPage'
})
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage implements OnInit {

  addAdminForm : FormGroup;
  addCustomerForm : FormGroup;
  addSalesmanForm: FormGroup;
  name: FormControl;
  password: FormControl;
  userLoginId: FormControl;
  externalId: FormControl;
  country: FormControl;
  channel: FormControl;
  province: FormControl;
  showLoader = false;
  userTypeList: Array<any> =  [ 'CUSTOMER', 'ADMIN','SALESMAN']
  countryList: Array<any> =  [ 'ZAMBIA']
  provinceList: Array<any> =  [ 'BOTSWANA', 'COPPERBELT', 'DRC', 'EASTERN', 'KENYA', 'LUAPULA', 'LUSAKA', 'MALAWI', 'MOZAMBIQUE', 'NORTH WESTERN', 'NORTHERN'
  ,'SOUTH AFRICA', 'SOUTHERN', 'TANZANIA', 'WESTERN', 'ZIMBABWE' ]
  selectedUserType : string = 'CUSTOMER'
  selectedCountry : string = 'ZAMBIA'
  selectedProvince : string = 'BOTSWANA'
  showCustomerForm: string = 'CUSTOMER'

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.showCustomerForm = this.selectedUserType
  }

  ngOnInit(): void {
    this.createFormControls()
    this.createAdminForm()
    this.createCustomerForm()
    this.createSalesmanForm()
  }

  createFormControls() {
    this.userLoginId = new FormControl('', [
      Validators.required
    ]);
    this.password = new FormControl(CONSTANTS.DEFUALT_PASSWORD, [
      Validators.required
    ]);
    this.name = new FormControl('', [
      Validators.required
    ]);
    this.externalId = new FormControl('', [
      Validators.required
    ]);
    this.externalId = new FormControl('', [
      Validators.required
    ]);
    this.country = new FormControl('', [
      Validators.required
    ]);
    this.channel = new FormControl('', [
      Validators.required
    ]);
    this.province = new FormControl('', [
      Validators.required
    ]);
  }

  createAdminForm() {
    this.addAdminForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password
    });
  }

  createSalesmanForm() {
    this.addSalesmanForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password,
      externalId: this.externalId,
    });
  }

  createCustomerForm() {
    this.addCustomerForm = new FormGroup({
      name: this.name,
      userLoginId: this.userLoginId,
      password: this.password,
      externalId: this.externalId,
      channel: this.channel
    });
  }

  onUserTypeSelect() {
    this.showCustomerForm = this.selectedUserType
    this.addAdminForm.reset()
    this.addCustomerForm.reset()
  } 

  createUser (userType) {
    let message = ''
    this.showLoader = true
    let userDetails = {}
    userDetails['lastUpdatedAt'] = Date.now()
    if(userType === 'customer') {
      message = CONSTANTS.CUSTOMER_CREATED
      userDetails['name'] = this.name.value.trim()
      userDetails['userLoginId'] = this.userLoginId.value.trim()
      userDetails['password'] = this.password.value.trim()
      userDetails['userType'] = this.selectedUserType
      userDetails['country'] = this.selectedCountry.trim()
      userDetails['channel'] = this.channel.value.trim()
      userDetails['province'] = this.selectedProvince.trim()
      userDetails['externalId'] = this.externalId.value.trim()
    } else if(userType === 'admin') {
      message = CONSTANTS.ADMIN_CREATED
      userDetails['name'] = this.name.value.trim()
      userDetails['userLoginId'] = this.userLoginId.value.trim()
      userDetails['password'] = this.password.value.trim()
      userDetails['userType'] = this.selectedUserType
      userDetails['country'] = this.selectedCountry.trim()
      userDetails['province'] = this.selectedProvince.trim()
    } else {
      message = CONSTANTS.SALESMAN_CREATED
      userDetails['name'] = this.name.value.trim()
      userDetails['userLoginId'] = this.userLoginId.value.trim()
      userDetails['password'] = this.password.value.trim()
      userDetails['userType'] = this.selectedUserType
      userDetails['country'] = this.selectedCountry.trim()
      userDetails['province'] = this.selectedProvince.trim()  
      userDetails['externalId'] = this.externalId.value.trim()    
    }
    this.apiService.createUser(userDetails).subscribe((result) => {
      this.widgetUtil.showToast(message)
      this.showLoader = false;
      this.addAdminForm.reset()
      this.addCustomerForm.reset()
    }, (error) => {
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else if(error.error.message === 'UserLoginId already exist') {
        this.widgetUtil.showToast(CONSTANTS.USER_LOGIN_ID_ALREADY_EXIST)
      }else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
}
