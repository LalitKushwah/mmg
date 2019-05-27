import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutstandingPage } from './outstanding';

@NgModule({
  declarations: [
    OutstandingPage,
  ],
  imports: [
    IonicPageModule.forChild(OutstandingPage),
  ],
})
export class OutstandingPageModule {}
