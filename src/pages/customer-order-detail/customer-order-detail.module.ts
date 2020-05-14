import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderDetailPage } from './customer-order-detail';

@NgModule({
  declarations: [
    CustomerOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderDetailPage),
  ],
})
export class CustomerOrderDetailPageModule {}
