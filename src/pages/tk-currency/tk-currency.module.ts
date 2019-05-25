import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TkCurrencyPage } from './tk-currency';

@NgModule({
  declarations: [
    TkCurrencyPage,
  ],
  imports: [
    IonicPageModule.forChild(TkCurrencyPage),
  ],
})
export class TkCurrencyPageModule {}
