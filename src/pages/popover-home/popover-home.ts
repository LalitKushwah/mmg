import { AddProductPage } from './../add-product/add-product';
import { AddCategoryPage } from './../add-category/add-category';
import { AddUserPage } from './../add-user/add-user';
import { WidgetUtilService } from './../utils/widget-utils';
import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, PopoverController, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'PopoverHomePage'
})
@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  popoverOptions: any = []

  constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider
  , public appCtrl: App, private widgetUtil: WidgetUtilService ) {
    this.getData()
  }

  async getData() {
    let profile = await this.storageService.getFromStorage('profile')
    if (profile['userType'] === 'admin') {
      this.popoverOptions = [
        {
          name: 'Add User',
          icon: 'person-add'
        },
        {
          name: 'Add Category',
          icon: 'add-circle',
        },
        {
          name: 'Add Product',
          icon: 'add-circle',
        },
        {
          name: 'Logout',
          icon: 'log-out',
        }
    ]
    } else{
      this.popoverOptions = [{
        name: 'Logout',
        icon: 'log-out'
      }]
    }
  }

  openPage(name)  {
    switch(name) {
      case 'Add User':
      this.addUser()
      break
      case 'Add Category':
      this.addCategory()
      break
      case 'Add Product':
      this.addProduct()
      break
      case 'Logout':
      this.logout()
      break
    }
  }

  addUser(){
    this.navCtrl.push(AddUserPage)
  }
  
  addCategory() {
    this.navCtrl.push(AddCategoryPage)
  }

  addProduct() {
    this.navCtrl.push(AddProductPage)
  }

  async logout() {
    this.storageService.clearStorage()
    localStorage.clear()
    this.widgetUtil.dismissPopover()
    this.appCtrl.getRootNav().push(HomePage)
  }
}
