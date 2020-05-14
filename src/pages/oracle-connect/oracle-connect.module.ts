import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OracleConnectPage } from './oracle-connect';

@NgModule({
  declarations: [
    OracleConnectPage,
  ],
  imports: [
    IonicPageModule.forChild(OracleConnectPage),
  ],
})
export class OracleConnectPageModule {}
