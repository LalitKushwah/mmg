import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

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
  selectedSalesman;
  isEnabled:boolean=false;
  cashIsSelected:boolean=false;
  chequeIsSelected:boolean=false;
  onlineIsSelected:boolean=false;

  constructor(private navParams: NavParams, private view:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPaymentModalPage');
  }

  closePayModal(){
    this.view.dismiss();
  }

  paymentModeSelectionChanged(selectedValue: any){
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
  submitPayment(){
    console.log('Amount=', this.paymentAmount);
    console.log('Online ID=', this.onlineID);
    console.log('Cheque ID=', this.chequeID);
    console.log('Selected Salesman=', this.selectedSalesman);
  }

}
