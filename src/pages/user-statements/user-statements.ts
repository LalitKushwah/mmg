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
      debit: '100.00',
      credit: '',
      balance: '1000.00'
    },
    {
      transDate: 1588171263223,
      desc: 'Sales Invoice',
      ref: 'SI0001',
      debit: '',
      credit: '200.00',
      balance: '1200.00'
    },
    {
      transDate: 1588171263223,
      desc: 'Long Description of Sales Invoice',
      ref: 'SI0001',
      debit: '99100.00',
      credit: '',
      balance: '98900.00'
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
      debit: '10000',
      credit: '',
      balance: '1000000'
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
