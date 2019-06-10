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
  salesmanCode = ''
  customerCode = ''
  salesmanList = []

  constructor(private view:ViewController,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider) {
  }

  ionViewDidLoad() {
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

  closePayModal(){
    this.view.dismiss();
  }

  paymentModeSelectionChanged(){
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
        case 'online':
          this.onlineIsSelected=true;
          this.chequeIsSelected=false; 
          this.cashIsSelected=false; 
            break;
        default:
            this.onlineIsSelected=false;
            this.chequeIsSelected=false; 
            this.cashIsSelected=false; 
    }
    // console.log(selectedValue);
  }

  submitPayment () {
    const paymentObj: any = {}
    paymentObj.mode = this.paymentMode
    paymentObj.amount = this.paymentAmount
    this.onlineID ? paymentObj.transactionId = this.onlineID : undefined
    this.chequeID ? paymentObj.chequeID = this.chequeID : undefined
    this.paymentMode === 'cash' ? paymentObj.salesmanCode = this.salesmanCode : undefined
    paymentObj.customerCode = this.customerCode
    paymentObj.salesmanCode = this.selectedSalesman && this.selectedSalesman.externalId ? this.selectedSalesman.externalId : undefined
    this.apiService.createPayment(paymentObj).subscribe(res => {
      console.log('======= 100 =======', res)
    })
  }

  selectSalesman (salesman) {
    this.selectedSalesman = salesman
  }

}
