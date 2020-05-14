import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminEditProductPage } from './admin-edit-product';

@NgModule({
  declarations: [
    AdminEditProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminEditProductPage),
  ],
})
export class AdminEditProductPageModule {}
