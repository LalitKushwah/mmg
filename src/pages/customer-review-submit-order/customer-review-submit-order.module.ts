import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerReviewSubmitOrderPage } from './customer-review-submit-order';

@NgModule({
  declarations: [
    CustomerReviewSubmitOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerReviewSubmitOrderPage),
  ],
})
export class CustomerReviewSubmitOrderPageModule {}
