import { ResetUserPasswordPage } from '../reset-user-password/reset-user-password';
import { AddProductPage } from '../add-product/add-product';
import { AddCategoryPage } from '../add-category/add-category';
import { AddUserPage } from '../add-user/add-user';
import { WidgetUtilService } from '../../utils/widget-utils';
import { HomePage } from '../home/home';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App} from 'ionic-angular';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';
import { TkProductsListPage } from '../tk-products-list/tk-products-list';

@IonicPage({
  name: 'PopoverHomePage'
})
@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  popoverOptions: any = []

  constructor (public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider
  , public appCtrl: App, private widgetUtil: WidgetUtilService ) {
    this.getData()
  }

  async getData () {
    let profile = await this.storageService.getFromStorage('profile')
    if (profile['userType'] === 'ADMIN' || profile['userType'] === 'ADMINHO') {
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
          name: 'Add TK Product',
          icon: 'add-circle',
        },
        {
          name: 'Add Competitive Product',
          icon: 'add-circle',
        },
        {
          name: 'Change Password',
          icon: 'key',
        },
        {
          name: 'Logout',
          icon: 'log-out',
        }
    ]
    } else{
      this.popoverOptions = [
        {
          name: 'Change Password',
          icon: 'key',
        },
        {
          name: 'Logout',
          icon: 'log-out'
        }
      ]
    }
  }

  openPage (name)  {
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
      case 'Change Password':
        this.resetPassword()
        break
      case 'Add TK Product':
        this.addTKProduct()
        break
      case 'Add Competitive Product':
        this.addCompProduct()
        break
    }
  }

  addUser (){
    this.navCtrl.push(AddUserPage)
    this.dismissPopover()
  }

  addCategory () {
    this.navCtrl.push(AddCategoryPage)
    this.dismissPopover()
  }

  addProduct () {
    this.navCtrl.push(AddProductPage)
    this.dismissPopover()
  }

  resetPassword () {
    this.navCtrl.push(ResetUserPasswordPage)
    this.dismissPopover()
  }

  async logout () {
    this.storageService.clearStorage()
    localStorage.clear()
    this.appCtrl.getRootNav().push(HomePage)
    this.widgetUtil.dismissPopover()
  }

  addTKProduct () {
    this.navCtrl.push(AddTkProductModalPage, {title: 'Add TK Product', context: 'TK', })
    this.dismissPopover();
  }

  addCompProduct () {
    this.navCtrl.push(TkProductsListPage);
    this.dismissPopover();
  }

  dismissPopover () {
    this.widgetUtil.dismissPopover()
  }
}
