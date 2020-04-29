import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UserStatementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-statements',
  templateUrl: 'user-statements.html',
})
export class UserStatementsPage {

  statements = [
    {
      transDate: 1588171263223,
      desc: 'Sales Invoice',
      ref: 'SI0001',
      debit: '100',
      credit: '',
      balance: '1000'
    },
    {
      transDate: 1588171263223,
      desc: 'Sales Invoice',
      ref: 'SI0001',
      debit: '',
      credit: '200',
      balance: '1200'
    },
    {
      transDate: 1588171263223,
      desc: 'Sales Invoice',
      ref: 'SI0001',
      debit: '100',
      credit: '',
      balance: '1000'
    },
    {
      transDate: 1588171263223,
      desc: 'Sales Invoice',
      ref: 'SI0001',
      debit: '',
      credit: '200',
      balance: '1200'
    }
  ]

  constructor (public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad UserStatementsPage');
  }

}
