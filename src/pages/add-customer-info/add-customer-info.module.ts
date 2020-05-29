import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCustomerInfoPage } from './add-customer-info';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddCustomerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCustomerInfoPage),
    ReactiveFormsModule
  ],
})
export class AddCustomerInfoPageModule {}
