import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesmanSelectCustomerPage } from './salesman-select-customer';

@NgModule({
  declarations: [
    SalesmanSelectCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesmanSelectCustomerPage),
  ],
})
export class SalesmanSelectCustomerPageModule {}
