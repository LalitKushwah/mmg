import { CustomerOrderDetailPageModule } from './../pages/customer-order-detail/customer-order-detail.module';
import { CustomerOrderDetailPage } from './../pages/customer-order-detail/customer-order-detail';
import { CustomerListOrderPageModule } from './../pages/customer-list-order/customer-list-order.module';
import { CustomerListOrderPage } from './../pages/customer-list-order/customer-list-order';
import { CustomerReviewSubmitOrderPageModule } from './../pages/customer-review-submit-order/customer-review-submit-order.module';
import { CustomerListProductPageModule } from './../pages/customer-list-product/customer-list-product.module';
import { CustomerListProductPage } from './../pages/customer-list-product/customer-list-product';
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
import { CustomerReviewSubmitOrderPage } from '../pages/customer-review-submit-order/customer-review-submit-order';

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
    CustomerCategoryListPageModule,
    CustomerListProductPageModule,
    CustomerReviewSubmitOrderPageModule,
    CustomerListOrderPageModule,
    CustomerOrderDetailPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    CustomerCategoryListPage,
    CustomerHomePage,
    CustomerListProductPage,
    CustomerReviewSubmitOrderPage,
    CustomerListOrderPage,
    CustomerOrderDetailPage
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
