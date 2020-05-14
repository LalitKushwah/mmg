import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminListProductPage } from './admin-list-product';

@NgModule({
  declarations: [
    AdminListProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminListProductPage),
  ],
})
export class AdminListProductPageModule {}
