import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'ResetPasswordModelPage'
})
@Component({
  selector: 'page-reset-password-model',
  templateUrl: 'reset-password-model.html',
})
export class ResetPasswordModelPage {

  message: any = ''

  constructor(public view: ViewController, public navParams: NavParams) {
    this.message = this.navParams.get('message')
  }

  dismissModel(result) {
    this.view.dismiss(result)
  }

}
