import { AdminListProductPage } from './../pages/admin-list-product/admin-list-product';
import { AdminListCategoryPage } from './../pages/admin-list-category/admin-list-category';
import { AdminListUserPage } from './../pages/admin-list-user/admin-list-user';
import { StorageServiceProvider } from './../providers/storage-service/storage-service';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {HeaderColor} from "@ionic-native/header-color";
import { LoginPage } from '../pages/login/login';
import { CustomerListOrderPage } from '../pages/customer-list-order/customer-list-order';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  partyName: string = ''

  pages: Array<{title: string, component: any, icon : string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen
  , private headerColor : HeaderColor, private menuController: MenuController, private storageService: StorageServiceProvider,
  private zone: NgZone,  public events: Events,) {
    this.pages = [{ title: 'Home', component: HomePage, icon :'md-home'}]
    this.menuController.swipeEnable(true)
    this.initializeApp();
    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => {})
    })
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    try {
      let profile = await this.storageService.getFromStorage('profile')
      if ((profile['userType'] === 'admin')) {
        this.pages = [
          { title: 'Home', component: HomePage, icon :'md-home'},
          { title: 'List User', component: AdminListUserPage, icon :'md-happy'},
          { title: 'List Category', component: AdminListCategoryPage, icon :'list-box'},
          { title: 'List Product', component: AdminListProductPage, icon :'list-box'},
        ]
      } else {
        this.pages = [
          { title: 'Home', component: HomePage, icon :'md-home'},
          { title: 'Your Orders', component: CustomerListOrderPage, icon : 'cart'}
        ]
      }
      if(profile) {
        this.partyName = profile['name']
      }
    } catch(err) {
      console.log('Error: Home Page Component:', err)
    }
    this.events.publish('updateScreen')
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#488aff');
      this.headerColor.tint('#FD367E');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
