import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminListSalesmanPage } from './admin-list-salesman';

@NgModule({
  declarations: [
    AdminListSalesmanPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminListSalesmanPage),
  ],
})
export class AdminListSalesmanPageModule {}
