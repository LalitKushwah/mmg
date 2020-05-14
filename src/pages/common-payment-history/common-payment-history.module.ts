import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonPaymentHistoryPage } from './common-payment-history';

@NgModule({
  declarations: [
    CommonPaymentHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonPaymentHistoryPage),
  ],
})
export class CommonPaymentHistoryPageModule {}
