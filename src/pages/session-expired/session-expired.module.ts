import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionExpiredPage } from './session-expired';

@NgModule({
  declarations: [
    SessionExpiredPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionExpiredPage),
  ],
})
export class SessionExpiredPageModule {}
