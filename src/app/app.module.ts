import { CustomerCategoryListPageModule } from './../pages/customer-category-list/customer-category-list.module';
import { AdminHomePageModule } from './../pages/admin-home/admin-home.module';
import { CustomerHomePageModule } from './../pages/customer-home/customer-home.module';
import { WidgetUtilService } from './../pages/utils/widget-utils';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";
import {HeaderColor} from "@ionic-native/header-color";
import {LoginPageModule} from "../pages/login/login.module";
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageServiceProvider } from '../providers/storage-service/storage-service';
import { PopoverHomePageModule } from '../pages/popover-home/popover-home.module';
import { TokenInterceptorServiceProvider } from '../providers/token-interceptor-service/token-interceptor-service';
import { CustomerHomePage } from '../pages/customer-home/customer-home';
import { CustomerCategoryListPage } from '../pages/customer-category-list/customer-category-list';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(
      {
        name: '__tradeking',
        driverOrder: ['localstorage', 'sqlite', 'indexeddb']
      }
    ),
    LoginPageModule,
    HttpClientModule,
    PopoverHomePageModule,
    CustomerHomePageModule,
    AdminHomePageModule,
    CustomerCategoryListPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    CustomerCategoryListPage,
    CustomerHomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HeaderColor,
    ApiServiceProvider,
    StorageServiceProvider,
    WidgetUtilService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : TokenInterceptorServiceProvider,
      multi : true
    }
  ]
})
export class AppModule {}
