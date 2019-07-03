import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectedCustomerOrderListPage } from './selected-customer-order-list';

@NgModule({
  declarations: [
    SelectedCustomerOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectedCustomerOrderListPage),
  ],
})
export class SelectedCustomerOrderListPageModule {}
