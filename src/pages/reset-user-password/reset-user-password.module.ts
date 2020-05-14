import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetUserPasswordPage } from './reset-user-password';

@NgModule({
  declarations: [
    ResetUserPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetUserPasswordPage),
  ],
})
export class ResetUserPasswordPageModule {}
