import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

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

  constructor (private view:ViewController,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider) {
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddPaymentModalPage');
    this.getData()
  }
  async getData () {
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
        this.apiService.getAssociatedSalesmanListBySalesman(profile['externalId']).subscribe((res: any) => {
          this.salesmanList = res.body
        })
        this.customerCode = profile['externalId']
      }
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err)
    }
  }

  closePayModal (){
    this.view.dismiss();
  }

  paymentModeSelectionChanged (){
    this.isEnabled=true;
      switch (this.paymentMode) {
        case 'cash':
          this.cashIsSelected=true; 
          this.chequeIsSelected=false; 
          this.onlineIsSelected=false;
            break;
        case 'cheque':
          this.chequeIsSelected=true; 
          this.cashIsSelected=false; 
          this.onlineIsSelected=false; 
            break;
        case 'bank transfer':
          this.onlineIsSelected=true;
          this.chequeIsSelected=false; 
          this.cashIsSelected=false; 
            break;
        default:
            this.onlineIsSelected=false;
            this.chequeIsSelected=false; 
            this.cashIsSelected=false; 
    }
  }

  submitPayment () {
    
    this.paymentObj.mode = this.paymentMode
    this.paymentObj.amount = this.paymentAmount
    this.onlineID ? this.paymentObj.transactionId = this.onlineID : undefined
    this.chequeID ? this.paymentObj.chequeID = this.chequeID : undefined
    this.paymentObj.customerCode = this.customerCode
    if (this.salesmanCode && this.salesmanName) {
      this.paymentObj.salesmanCode = this.salesmanCode 
      this.paymentObj.salesmanName = this.salesmanName
    }
    this.apiService.createPayment(this.paymentObj).subscribe(res => {
    })
  }

  selectSalesman (salesman) {
    this.selectedSalesman = salesman
    this.paymentObj.salesmanCode = salesman.externalId
    this.paymentObj.salesmanName = salesman.name
  }

}
