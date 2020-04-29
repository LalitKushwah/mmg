import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserStatementsPage } from './user-statements';

@NgModule({
  declarations: [
    UserStatementsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserStatementsPage),
  ],
})
export class UserStatementsPageModule {}
