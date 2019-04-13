import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftCheckoutPage } from './gift-checkout';

@NgModule({
  declarations: [
    GiftCheckoutPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftCheckoutPage),
  ],
})
export class GiftCheckoutPageModule {}
