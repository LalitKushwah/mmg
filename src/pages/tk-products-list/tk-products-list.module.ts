import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { TkProductsListPage } from './tk-products-list';

@NgModule({
  declarations: [
    TkProductsListPage
  ],
  imports: [
    IonicPageModule.forChild(TkProductsListPage),
    VirtualScrollerModule
  ]
})
export class TkProductsListPageModule {}
