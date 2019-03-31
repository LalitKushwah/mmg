import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomeKitPage } from './welcome-kit';

@NgModule({
  declarations: [
    WelcomeKitPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomeKitPage),
  ],
})
export class WelcomeKitPageModule {}
