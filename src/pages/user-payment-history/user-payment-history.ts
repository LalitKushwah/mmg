import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'UserPaymentHistoryPage'
})
@Component({
  selector: 'page-user-payment-history',
  templateUrl: 'user-payment-history.html',
})
export class UserPaymentHistoryPage {

  modeIsCash: boolean = false;
  modeIsOnline: boolean = false;
  modeIsCheque: boolean = false;
  paymentDate: any = '12/06/2019';
  paymentAmt: any = '1234.56';
  paymentMode: any = 'cash';
  salesmanName: any = 'John Doe';
  onlineId: any = '12QWERTY34'; 
  chequeId: any = '12345';


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPaymentHistoryPage');
    this.getData()
  }
  async getData(){
    //Fetch Data here
    //..
    if(this.paymentMode==='cash'){
      this.modeIsCash = true
    }
    else{
      if(this.paymentMode==='online'){
        this.modeIsOnline = true
      }
      else{
        this.modeIsCheque = true
      }
    }
  }

}
