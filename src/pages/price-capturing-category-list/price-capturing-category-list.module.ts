import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PriceCapturingCategoryListPage } from './price-capturing-category-list';

@NgModule({
  declarations: [
    PriceCapturingCategoryListPage,
  ],
  imports: [
    IonicPageModule.forChild(PriceCapturingCategoryListPage),
  ],
})
export class PriceCapturingCategoryListPageModule {}
