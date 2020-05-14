import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerListOrderPage } from './customer-list-order';

@NgModule({
  declarations: [
    CustomerListOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerListOrderPage),
  ],
})
export class CustomerListOrderPageModule {}
