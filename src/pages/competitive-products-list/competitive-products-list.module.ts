import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompetitiveProductsListPage } from './competitive-products-list';

@NgModule({
  declarations: [
    CompetitiveProductsListPage,
  ],
  imports: [
    IonicPageModule.forChild(CompetitiveProductsListPage),
  ],
})
export class CompetitiveProductsListPageModule {}
