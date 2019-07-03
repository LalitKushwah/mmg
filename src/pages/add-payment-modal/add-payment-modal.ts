import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';

@IonicPage()
@Component({
  selector: 'page-add-payment-modal',
  templateUrl: 'add-payment-modal.html'
})
export class AddPaymentModalPage {

  paymentMode;
  paymentAmount:number=0;
  onlineID;
  chequeID;
  selectedSalesman: any;
  isEnabled:boolean=false;
  cashIsSelected:boolean=false;
  chequeIsSelected:boolean=false;
  onlineIsSelected:boolean=false;
  salesmanName: any;
  userTypeSalesman: boolean = false;
  salesmanCode: string
  customerCode = ''
  salesmanList = []
  paymentObj: any = {}
  amountIsZero: boolean = true

  constructor (private view:ViewController,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private loadingCtrl: LoadingController,
              private widgetUtil: WidgetUtilService) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddPaymentModalPage');
    this.getData()
  }
  async getData () {
    const loader = this.loadingCtrl.create({
      content: "Fetching data...",
    });
    loader.present()
    try{
      let profile = await this.storageService.getFromStorage('profile')
      console.log(profile['name'])
      if ((profile['userType'] === 'SALESMAN')) {
      this.salesmanName = profile['name']
      this.salesmanCode = profile['externalId']
      this.userTypeSalesman = true      
      let customer =  await this.storageService.getFromStorage('selectedCustomer')
      this.customerCode = customer['externalId']
      } else {
        this.customerCode = profile['externalId']
      }
      this.apiService.getAssociatedSalesmanListBySalesman(profile['externalId']).subscribe((res: any) => {
        this.salesmanList = res.body ? res.body : []
        if (!this.salesmanList.length) {
          this.widgetUtil.showToast('No salesman association found \n Please contact administration')
        }
        loader.dismiss()
      })
    }
    catch (err) {
      loader.dismiss()
      console.log('Error: Profile Details could not Load', err)
    }
  }

  closePayModal (){
    this.view.dismiss();
  }

  //Check if Amount is 0
  checkAmount (keyCode){
    if(this.paymentAmount > 0) {
      this.amountIsZero = false;
    }
    else {
      this.amountIsZero = true;
    }
  }

  paymentModeSelectionChanged (){
      switch (this.paymentMode) {
        case 'cash':
          this.cashIsSelected=true; 
          this.chequeIsSelected=false; 
          this.onlineIsSelected=false;
          this.isEnabled=true;
            break;
        case 'cheque':
          this.chequeIsSelected=true; 
          this.cashIsSelected=false; 
          this.onlineIsSelected=false;
          this.isEnabled=true;
            break;
        case 'bank transfer':
          this.onlineIsSelected=true;
          this.chequeIsSelected=false; 
          this.cashIsSelected=false;
          this.isEnabled=true;
            break;
        default:
            this.onlineIsSelected=false;
            this.chequeIsSelected=false; 
            this.cashIsSelected=false;
            this.isEnabled=false;
    }
  }

  submitPayment (mode,amt,chequeId,transactionId,comment,paidTo) {    
    
    //Payment Loader
    const payLoader = this.loadingCtrl.create({
      content: "Adding Payment...",
    });
    payLoader.present()

    this.paymentObj.mode = mode.value.toUpperCase()
    this.paymentObj.amount = amt ? amt.value : undefined
    transactionId ? (this.paymentObj.transactionId = transactionId.value) : undefined
    chequeId ? (this.paymentObj.chequeId = chequeId.value) : undefined

    //Adding COMMENT to Payment Obj
    this.paymentObj.comment = comment ? comment.value : undefined
    //Adding salesman Name
    this.paymentObj.paidTo = paidTo ? paidTo.value : undefined

    this.paymentObj.customerCode = this.customerCode
    this.paymentObj.lastUpdatedAt = Date.now()
    if (this.salesmanCode && this.salesmanName) {
      this.paymentObj.salesmanCode = this.salesmanCode 
      this.paymentObj.salesmanName = this.salesmanName
    }
    console.log(this.paymentObj)
    this.apiService.createPayment(this.paymentObj).subscribe((res : any)=> {
      if (res.status === 200) {
        this.widgetUtil.showToast('Payment created successfully...')
        this.onlineID = undefined;
        this.chequeID = undefined;
        // this.closePayModal()
      } else {
        this.widgetUtil.showToast('Error while creating payment...')
      }
      payLoader.dismiss()
    })
  }
}
