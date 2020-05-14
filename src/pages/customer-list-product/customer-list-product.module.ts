import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerListProductPage } from './customer-list-product';

@NgModule({
  declarations: [
    CustomerListProductPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerListProductPage),
  ],
})
export class CustomerListProductPageModule {}
