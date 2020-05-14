import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminListUserPage } from './admin-list-user';

@NgModule({
  declarations: [
    AdminListUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminListUserPage),
  ],
})
export class AdminListUserPageModule {}
