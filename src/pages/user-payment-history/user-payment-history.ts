import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

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


  constructor (public navCtrl: NavController, 
               public navParams: NavParams,
               private apiService: ApiServiceProvider,
               private storageService: StorageServiceProvider) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad UserPaymentHistoryPage');
    this.getData()
  }
  async getData () {
    let profile = await this.storageService.getFromStorage('profile')
    if (profile['userType'] === 'SALESMAN') {
      profile = await this.storageService.getFromStorage('selectedCustomer')
    }
    this.apiService.getPaymentHistory(profile['externalId']).subscribe(res => {
      console.log('====== 43 ======', res)
    })
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
