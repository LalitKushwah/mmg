import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClubClassificationPage } from './club-classification';

@NgModule({
  declarations: [
    ClubClassificationPage,
  ],
  imports: [
    IonicPageModule.forChild(ClubClassificationPage),
  ],
})
export class ClubClassificationPageModule {}
