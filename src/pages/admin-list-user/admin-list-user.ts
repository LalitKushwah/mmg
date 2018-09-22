import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.getUserList()
  }

  ionViewDidEnter(){
    this.getUserList()
  }

  getUserList() {
    console.log('****************')
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
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  getCustomerDetail() {

  }

}
