import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerCategoryListPage } from './customer-category-list';

@NgModule({
  declarations: [
    CustomerCategoryListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerCategoryListPage),
  ],
})
export class CustomerCategoryListPageModule {}
