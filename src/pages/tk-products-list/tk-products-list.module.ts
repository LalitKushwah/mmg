import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TkProductsListPage } from './tk-products-list';

@NgModule({
  declarations: [
    TkProductsListPage
  ],
  imports: [
    IonicPageModule.forChild(TkProductsListPage)
    ]
})
export class TkProductsListPageModule {}
