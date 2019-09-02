import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the CommonPaymentHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'CommonPaymentHistoryPage'
})
@Component({
  selector: 'page-common-payment-history',
  templateUrl: 'common-payment-history.html',
})
export class CommonPaymentHistoryPage {

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
               private widgetCtrl: WidgetUtilService,
               public datePipe: DatePipe) {
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
    console.log('========== 55 ========', profile)
    this.apiService.getPaymentHistoryForSM(profile['externalId']).subscribe((res: any) => {
        if (res && res.body) {
          this.data = res.body
          if (this.data.length) {
            this.data.map(item => {
              item.lastUpdatedAt = this.datePipe.transform(item.lastUpdatedAt, 'dd/MM/yyyy')
            })
          }
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
