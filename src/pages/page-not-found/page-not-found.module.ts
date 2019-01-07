import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageNotFoundPage } from './page-not-found';

@NgModule({
  declarations: [
    PageNotFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(PageNotFoundPage),
  ],
})
export class PageNotFoundPageModule {}
