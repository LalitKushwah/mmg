import { WidgetUtilService } from '../../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
// import { TargetGraphPage } from '../target-graph/target-graph';
// import { TargetPage } from '../target/target';
// import { TkCurrencyPage} from '../tk-currency/tk-currency';
// import { OutstandingPage} from '../outstanding/outstanding';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
// import { SalesmanSelectCustomerPage } from '../salesman-select-customer/salesman-select-customer';
import { CustomerHomePage } from '../customer-home/customer-home';

@IonicPage({
  name: 'UserProfilePage'
})
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  // opened: boolean = false;
  // TKopened: boolean = false;
  // Outopened: boolean = false;
  // btnLabel: string = '';
  partyName: any;
  selectedCustomerprofile: any;
  userTypeCustomer: boolean = false;
  
  // customerDashboard:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private widgetUtil: WidgetUtilService, private modal:ModalController, private storageService: StorageServiceProvider) {
  }

  ionViewDidLoad() {
    this.getData()
  }
  async getData() {
    try{
      let profile = await this.storageService.getFromStorage('profile')
      // this.partyName = profile['name']
      if ((profile['userType'] === 'SALESMAN')){
        let selectedCustomerprofile = await this.storageService.getFromStorage('selectedCustomer')
        this.partyName = selectedCustomerprofile['name']
      }
      else{
        this.partyName = profile['name']
        this.userTypeCustomer = true;
      }
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err)
    }
  }
  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  // openGraph() {
  //   this.navCtrl.push('TargetGraphPage');
  // }

  // openTarget() {
  //   this.navCtrl.push('TargetPage');
  // }

  // openOutstanding() {
  //   this.navCtrl.push('OutstandingPage');
  // }

  // openTkCurrency() {
  //   this.navCtrl.push('TkCurrencyPage');
  // }

  // toggleFunc() {
  //   this.opened = !this.opened;
  //   if(this.TKopened){
  //     this.TKopened = !this.TKopened 
  //   }
  //   if(this.Outopened){
  //     this.Outopened = !this.Outopened 
  //   }
  // }

  // toggleFuncTK() {
  //   this.TKopened = !this.TKopened;
  //   if(this.opened){
  //     this.opened = !this.opened 
  //   }
  //   if(this.Outopened){
  //     this.Outopened = !this.Outopened 
  //   }
  // }

  // toggleFuncOut() {
  //   this.Outopened = !this.Outopened;
  //   if(this.opened){
  //     this.opened = !this.opened 
  //   }
  //   if(this.TKopened){
  //     this.TKopened = !this.TKopened 
  //   }
  // }

  // async openBtnModal(){
  //   let profile = await this.storageService.getFromStorage('profile')
  //   //console.log(profile['userType'])
  //   if ((profile['userType'] === 'SALESMAN')){
  //     this.openSelectCustomer()
  //   }
  //   else{
  //     this.openPaymentModal()
  //   }
  // }

  openPaymentModal(){
    const payModal = this.modal.create('AddPaymentModalPage')
    payModal.present();
  }

  openShopPage(){
    this.navCtrl.push(CustomerHomePage);
  }

  toggleView(){
    console.log('toggle clicked!')
  }

}
