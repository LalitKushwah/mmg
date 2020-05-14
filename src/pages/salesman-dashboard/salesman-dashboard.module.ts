import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesmanDashboardPage } from './salesman-dashboard';

@NgModule({
  declarations: [
    SalesmanDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesmanDashboardPage),
  ],
})
export class SalesmanDashboardPageModule {}
