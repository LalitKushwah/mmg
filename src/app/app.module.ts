import { CategoryTotalModalPageModule } from '../pages/category-total-modal/category-total-modal.module';
import { AdminEditProductPageModule } from '../pages/admin-edit-product/admin-edit-product.module';
import { AdminListSubCategoryPageModule } from '../pages/admin-list-sub-category/admin-list-sub-category.module';
import { ResetPasswordModelPage } from '../pages/reset-password-model/reset-password-model';
import { ResetUserPasswordPageModule } from '../pages/reset-user-password/reset-user-password.module';
import { ResetUserPasswordPage } from '../pages/reset-user-password/reset-user-password';
import { AdminListProductPageModule } from '../pages/admin-list-product/admin-list-product.module';
import { AdminListCategoryPageModule } from '../pages/admin-list-category/admin-list-category.module';
import { AdminListUserPageModule } from '../pages/admin-list-user/admin-list-user.module';
import { AddUserPageModule } from '../pages/add-user/add-user.module';
import { AddProductPageModule } from '../pages/add-product/add-product.module';
import { AddCategoryPageModule } from '../pages/add-category/add-category.module';
import { CustomerOrderDetailPageModule } from '../pages/customer-order-detail/customer-order-detail.module';
import { CustomerOrderDetailPage } from '../pages/customer-order-detail/customer-order-detail';
import { CustomerListOrderPageModule } from '../pages/customer-list-order/customer-list-order.module';
import { CustomerListOrderPage } from '../pages/customer-list-order/customer-list-order';
import { CustomerReviewSubmitOrderPageModule } from '../pages/customer-review-submit-order/customer-review-submit-order.module';
import { CustomerListProductPageModule } from '../pages/customer-list-product/customer-list-product.module';
import { CustomerListProductPage } from '../pages/customer-list-product/customer-list-product';
import { CustomerCategoryListPageModule } from '../pages/customer-category-list/customer-category-list.module';
import { AdminHomePageModule } from '../pages/admin-home/admin-home.module';
import { CustomerHomePageModule } from '../pages/customer-home/customer-home.module';
import { WidgetUtilService } from '../utils/widget-utils';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SalesmanSelectCustomerPage } from '../pages/salesman-select-customer/salesman-select-customer';
import { AdminDashboardPage } from '../pages/admin-dashboard/admin-dashboard';
import { SelectedCustomerOrderListPage } from '../pages/selected-customer-order-list/selected-customer-order-list';
import { AssociatedCustomersListOrderPage } from '../pages/associated-customers-list-order/associated-customers-list-order';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
import { HeaderColor } from "@ionic-native/header-color";
import { LoginPageModule } from "../pages/login/login.module";
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageServiceProvider } from '../providers/storage-service/storage-service';
import { PopoverHomePageModule } from '../pages/popover-home/popover-home.module';
import { TokenInterceptorServiceProvider } from '../providers/token-interceptor-service/token-interceptor-service';
import { CustomerHomePage } from '../pages/customer-home/customer-home';
import { CustomerCategoryListPage } from '../pages/customer-category-list/customer-category-list';
import { CustomerReviewSubmitOrderPage } from '../pages/customer-review-submit-order/customer-review-submit-order';
import { AddCategoryPage } from '../pages/add-category/add-category';
import { AddUserPage } from '../pages/add-user/add-user';
import { AddProductPage } from '../pages/add-product/add-product';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AdminListCategoryPage } from '../pages/admin-list-category/admin-list-category';
import { AdminListProductPage } from '../pages/admin-list-product/admin-list-product';
import { AdminListUserPage } from '../pages/admin-list-user/admin-list-user';
import { ResetPasswordModelPageModule } from '../pages/reset-password-model/reset-password-model.module';
import { AdminListSubCategoryPage } from '../pages/admin-list-sub-category/admin-list-sub-category';
import { AdminEditProductPage } from '../pages/admin-edit-product/admin-edit-product';
import { CategoryTotalModalPage } from '../pages/category-total-modal/category-total-modal';
import { SessionExpiredPageModule } from '../pages/session-expired/session-expired.module';
import { SessionExpiredPage } from "../pages/session-expired/session-expired";
import { ClubPremierPage } from '../pages/club-premier/club-premier';
import { ClubPremierPageModule } from '../pages/club-premier/club-premier.module';
import { ClubPremierGuidePage } from '../pages/club-premier-guide/club-premier-guide';
import { ClubPremierGuidePageModule } from '../pages/club-premier-guide/club-premier-guide.module';
import { GiftRewardsPageModule } from '../pages/gift-rewards/gift-rewards.module';
import { GiftRewardsPage } from '../pages/gift-rewards/gift-rewards';
import { TkFaqPage } from '../pages/tk-faq/tk-faq';
import { TkFaqPageModule } from '../pages/tk-faq/tk-faq.module';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions/terms-and-conditions';
import { TermsAndConditionsPageModule } from '../pages/terms-and-conditions/terms-and-conditions.module';
import { WelcomeKitPage } from '../pages/welcome-kit/welcome-kit';
import { WelcomeKitPageModule } from '../pages/welcome-kit/welcome-kit.module';
import { SpecialProductsPageModule } from '../pages/special-products/special-products.module';
import { SpecialProductsPage } from '../pages/special-products/special-products';
import { ClubClassificationPage } from '../pages/club-classification/club-classification';
import { ClubClassificationPageModule } from '../pages/club-classification/club-classification.module';
import { GiftCheckoutPage } from "../pages/gift-checkout/gift-checkout";
import { GiftCheckoutPageModule } from "../pages/gift-checkout/gift-checkout.module";
import { DatePipe, DecimalPipe } from "@angular/common";
import { EditUserPageModule } from '../pages/edit-user/edit-user.module';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { AddSalesmanModalPageModule } from '../pages/add-salesman-modal/add-salesman-modal.module';
import { AddSalesmanModalPage } from '../pages/add-salesman-modal/add-salesman-modal';
import { UserProfilePageModule } from '../pages/user-profile/user-profile.module';
import { SalesmanSelectCustomerPageModule } from '../pages/salesman-select-customer/salesman-select-customer.module';
import { AdminListSalesmanPage } from '../pages/admin-list-salesman/admin-list-salesman';
import { SalesmanDashboardPage } from '../pages/salesman-dashboard/salesman-dashboard';
import { UserPaymentHistoryPageModule } from '../pages/user-payment-history/user-payment-history.module';
import { AdminListSalesmanPageModule } from '../pages/admin-list-salesman/admin-list-salesman.module';
import { SalesmanDashboardPageModule } from '../pages/salesman-dashboard/salesman-dashboard.module';
import { AdminDashboardPageModule } from '../pages/admin-dashboard/admin-dashboard.module'
import { SelectedCustomerOrderListPageModule } from '../pages/selected-customer-order-list/selected-customer-order-list.module';
import { AssociatedCustomersListOrderPageModule } from '../pages/associated-customers-list-order/associated-customers-list-order.module';
import { ViewCustomerDataPage } from '../pages/view-customer-data/view-customer-data';
import { ViewCustomerDataPageModule } from '../pages/view-customer-data/view-customer-data.module';
import { CommonPaymentHistoryPageModule } from '../pages/common-payment-history/common-payment-history.module';
import { CommonPaymentHistoryPage } from '../pages/common-payment-history/common-payment-history';
import { CommonService } from '../providers/common.service';
import { SmEditOrderPage } from '../pages/sm-edit-order/sm-edit-order';
import { SmEditOrderPageModule } from '../pages/sm-edit-order/sm-edit-order.module';
import { UserStatementsPage } from '../pages/user-statements/user-statements';
import { UserStatementsPageModule } from '../pages/user-statements/user-statements.module';
import { FileOpener } from '@ionic-native/file-opener';
import { AddCustomerInfoPageModule } from '../pages/add-customer-info/add-customer-info.module';
import { AddCustomerInfoPage } from '../pages/add-customer-info/add-customer-info';
import { TkProductsListPageModule } from '../pages/tk-products-list/tk-products-list.module';
import { TkProductsListPage } from '../pages/tk-products-list/tk-products-list';
import { AddTkProductModalPage } from '../pages/add-tk-product-modal/add-tk-product-modal';
import { AddTkProductModalPageModule } from '../pages/add-tk-product-modal/add-tk-product-modal.module';
import { PriceCapturingCategoryListPage } from '../pages/price-capturing-category-list/price-capturing-category-list';
import { PriceCapturingSubCategoryListPage } from '../pages/price-capturing-sub-category-list/price-capturing-sub-category-list';
import { PriceCapturingCategoryListPageModule } from '../pages/price-capturing-category-list/price-capturing-category-list.module';
import { PriceCapturingSubCategoryListPageModule } from '../pages/price-capturing-sub-category-list/price-capturing-sub-category-list.module';
import { PriceCapturingUnitSizeListPageModule } from '../pages/price-capturing-unit-size-list/price-capturing-unit-size-list.module';
import { PriceCapturingUnitSizeListPage } from '../pages/price-capturing-unit-size-list/price-capturing-unit-size-list';
import { PriceCapturingProductListPageModule } from '../pages/price-capturing-product-list/price-capturing-product-list.module';
import { PriceCapturingProductListPage } from '../pages/price-capturing-product-list/price-capturing-product-list';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(
      { 
        name: '__tradekings',
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
    CustomerOrderDetailPageModule,
    AddCategoryPageModule,
    AddProductPageModule,
    AddUserPageModule,
    EditUserPageModule,
    AdminListUserPageModule,
    AdminListCategoryPageModule,
    AdminListProductPageModule,
    ResetUserPasswordPageModule,
    ResetPasswordModelPageModule,
    AdminListSubCategoryPageModule,
    AdminEditProductPageModule,
    CategoryTotalModalPageModule,
    SessionExpiredPageModule,
    ClubPremierPageModule,
    ClubPremierGuidePageModule,
    GiftRewardsPageModule,
    TkFaqPageModule,
    TermsAndConditionsPageModule,
    WelcomeKitPageModule,
    SpecialProductsPageModule,
    ClubClassificationPageModule,
    GiftCheckoutPageModule,
    AddSalesmanModalPageModule,
    UserPaymentHistoryPageModule,
    CommonPaymentHistoryPageModule,
    UserProfilePageModule,
    SalesmanSelectCustomerPageModule,
    AdminListSalesmanPageModule,
    SalesmanDashboardPageModule,
    AdminDashboardPageModule,
    SelectedCustomerOrderListPageModule,
    AssociatedCustomersListOrderPageModule,
    ViewCustomerDataPageModule,
    SmEditOrderPageModule,
    UserStatementsPageModule,
    AddCustomerInfoPageModule,
    TkProductsListPageModule,
    AddTkProductModalPageModule,
    PriceCapturingCategoryListPageModule,
    PriceCapturingSubCategoryListPageModule,
    PriceCapturingUnitSizeListPageModule,
    PriceCapturingProductListPageModule
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
    CustomerOrderDetailPage,
    AddCategoryPage,
    AddUserPage,
    EditUserPage,
    AddProductPage,
    AdminListCategoryPage,
    AdminListProductPage,
    AdminListUserPage,
    ResetUserPasswordPage,
    ResetPasswordModelPage,
    AdminListSubCategoryPage,
    AdminEditProductPage,
    CategoryTotalModalPage,
    SessionExpiredPage,
    ClubPremierPage,
    ClubPremierGuidePage,
    GiftRewardsPage,
    TkFaqPage,
    TermsAndConditionsPage,
    WelcomeKitPage,
    SpecialProductsPage,
    ClubClassificationPage,
    GiftCheckoutPage,
    AddSalesmanModalPage,
    UserProfilePage,
    SalesmanSelectCustomerPage,
    AdminListSalesmanPage,
    SalesmanDashboardPage,
    AdminDashboardPage,
    SelectedCustomerOrderListPage,
    AssociatedCustomersListOrderPage,
    ViewCustomerDataPage,
    CommonPaymentHistoryPage,
    SmEditOrderPage,
    UserStatementsPage,
    AddCustomerInfoPage,
    TkProductsListPage,
    AddTkProductModalPage,
    PriceCapturingCategoryListPage,
    PriceCapturingSubCategoryListPage,
    PriceCapturingUnitSizeListPage,
    PriceCapturingProductListPage
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
    },
    File,
    FileTransfer,
    FileTransferObject,
    FileOpener,
    DatePipe,
    DecimalPipe,
    CommonService
  ]
})
export class AppModule {}
