import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPaymentHistoryPage } from './user-payment-history';

@NgModule({
  declarations: [
    UserPaymentHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPaymentHistoryPage),
  ],
})
export class UserPaymentHistoryPageModule {}
