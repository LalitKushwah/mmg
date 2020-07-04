import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerInvoiceReportPage } from './customer-invoice-report';

@NgModule({
  declarations: [
    CustomerInvoiceReportPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerInvoiceReportPage),
  ],
})
export class CustomerInvoiceReportPageModule {}
