import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryTotalModalPage } from './category-total-modal';

@NgModule({
  declarations: [
    CategoryTotalModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryTotalModalPage),
  ],
})
export class CategoryTotalModalPageModule {}
