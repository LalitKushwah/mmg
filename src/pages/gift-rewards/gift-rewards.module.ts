import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftRewardsPage } from './gift-rewards';

@NgModule({
  declarations: [
    GiftRewardsPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftRewardsPage),
  ],
})
export class GiftRewardsPageModule {}
