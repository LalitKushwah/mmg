import { NgModule, Component } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSalesmanModalPage } from './add-salesman-modal';

@NgModule({
  declarations: [
    AddSalesmanModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSalesmanModalPage),
  ],
})
export class AddSalesmanModalPageModule {}
