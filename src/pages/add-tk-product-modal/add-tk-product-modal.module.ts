import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTkProductModalPage } from './add-tk-product-modal';

@NgModule({
  declarations: [
    AddTkProductModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTkProductModalPage),
  ],
})
export class AddTkProductModalPageModule {}
