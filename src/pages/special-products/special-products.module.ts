import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialProductsPage } from './special-products';

@NgModule({
  declarations: [
    SpecialProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialProductsPage),
  ],
})
export class SpecialProductsPageModule {}
