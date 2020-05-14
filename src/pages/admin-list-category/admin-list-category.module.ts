import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminListCategoryPage } from './admin-list-category';

@NgModule({
  declarations: [
    AdminListCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminListCategoryPage),
  ],
})
export class AdminListCategoryPageModule {}
