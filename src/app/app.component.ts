import { AdminListCategoryPage } from '../pages/admin-list-category/admin-list-category';
import { AdminListUserPage } from '../pages/admin-list-user/admin-list-user';
import { StorageServiceProvider } from '../providers/storage-service/storage-service';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, MenuController, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserProfilePage } from '../pages/user-profile/user-profile';
import { CustomerHomePage } from '../pages/customer-home/customer-home';
import { SalesmanSelectCustomerPage } from '../pages/salesman-select-customer/salesman-select-customer';


import { HomePage } from '../pages/home/home';
import { HeaderColor } from "@ionic-native/header-color";
import { CustomerListOrderPage } from '../pages/customer-list-order/customer-list-order';
import { ClubPremierPage } from '../pages/club-premier/club-premier';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  partyName: string = ''

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen
  , private headerColor : HeaderColor, private menuController: MenuController, private storageService: StorageServiceProvider,
  private zone: NgZone,  public events: Events, private app: App) {
    this.pages = [{ title: 'Home', component: HomePage, icon :'home'}]
    this.menuController.swipeEnable(true)
    this.initializeApp();
    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => { })
    })
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    try {
      /* { title: 'Categories', component: AdminListCategoryPage, icon :'list-box'}, */
      let profile = await this.storageService.getFromStorage('profile')
      if(profile['userLoginId'] !== 'R0001') {
        if ((profile['userType'] === 'ADMIN')) {
          this.pages = [
            {title: 'Home', component: HomePage, icon: 'home'},
            {title: 'Customers', component: AdminListUserPage, icon: 'customer'},
            {title: 'Products', component: AdminListCategoryPage, icon: 'products'},
          ]
        } else {
          if ((profile['userType'] === 'SALESMAN')) {
            this.pages = [
              {title: 'Shop', component: SalesmanSelectCustomerPage, icon: 'shopping-bag'},
              {title: 'Profile', component: UserProfilePage, icon: 'customer'},
              {title: 'Your Orders', component: CustomerListOrderPage, icon: 'cart'},
              {title: 'Club Premier', component: ClubPremierPage, icon: 'loan'},
            ]
          }else{
            this.pages = [
              {title: 'Shop', component: CustomerHomePage, icon: 'shopping-bag'},
              {title: 'Profile', component: UserProfilePage, icon: 'customer'},
              {title: 'Your Orders', component: CustomerListOrderPage, icon: 'cart'},
              {title: 'Club Premier', component: ClubPremierPage, icon: 'loan'}
            ]
          }   
        }
      } else {
        this.app.getRootNav().setRoot('OracleConnectPage')
      }
      if(profile) {
        this.partyName = profile['name']
      }
    } catch (err) {
      console.log('Error: Home Page Component:', err)
    }
    this.events.publish('updateScreen')
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#1A4D76');
      this.headerColor.tint('#FD367E');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.component.name === 'HomePage') {
      this.app.getRootNav().setRoot(page.component)
    } else {
      this.nav.push(page.component)
    }
  }
}
