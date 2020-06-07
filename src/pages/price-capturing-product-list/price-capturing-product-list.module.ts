import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PriceCapturingProductListPage } from './price-capturing-product-list';

@NgModule({
  declarations: [
    PriceCapturingProductListPage,
  ],
  imports: [
    IonicPageModule.forChild(PriceCapturingProductListPage),
  ],
})
export class PriceCapturingProductListPageModule {}
