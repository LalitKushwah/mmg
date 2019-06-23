import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';

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
  data = []
  paymentHistoryAvailable: boolean = false

  constructor (public navCtrl: NavController, 
               public navParams: NavParams,
               private apiService: ApiServiceProvider,
               private storageService: StorageServiceProvider,
               private loadingCtrl: LoadingController,
               private widgetCtrl: WidgetUtilService) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad UserPaymentHistoryPage');
    this.getData()
  }
  async getData () {
    const loader = this.loadingCtrl.create({
      content: "Fetching data...",
    });
    loader.present()
    let profile = await this.storageService.getFromStorage('profile')
    if (profile['userType'] === 'SALESMAN') {
      profile = await this.storageService.getFromStorage('selectedCustomer')
    }
    this.apiService.getPaymentHistory(profile['externalId']).subscribe((res: any) => {
        if (res && res.body) {
          this.data = res.body
          this.widgetCtrl.showToast('Data Fetched Successfully...')
          this.paymentHistoryAvailable = true
        } else {
          this.widgetCtrl.showToast('Problem while fetching data')
          this.paymentHistoryAvailable = true
        }
        loader.dismiss()
    })

    if (this.paymentMode==='cash') {
      this.modeIsCash = true
    }
    else {
      if(this.paymentMode==='online'){
        this.modeIsOnline = true
      }
      else{
        this.modeIsCheque = true
      }
    }
  }

}
