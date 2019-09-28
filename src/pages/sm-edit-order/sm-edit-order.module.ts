import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmEditOrderPage } from './sm-edit-order';

@NgModule({
  declarations: [
    SmEditOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SmEditOrderPage),
  ],
})
export class SmEditOrderPageModule {}
