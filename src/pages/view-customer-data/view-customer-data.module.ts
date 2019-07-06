import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerDataPage } from './view-customer-data';

@NgModule({
  declarations: [
    ViewCustomerDataPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerDataPage),
  ],
})
export class ViewCustomerDataPageModule {}
