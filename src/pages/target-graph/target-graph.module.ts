import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetGraphPage } from './target-graph';
import { ChartsModule } from 'ng2-charts-x';

@NgModule({
  declarations: [
    TargetGraphPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetGraphPage),
    ChartsModule
  ],
  exports: [
    TargetGraphPage
  ]
})
export class TargetGraphPageModule {}
