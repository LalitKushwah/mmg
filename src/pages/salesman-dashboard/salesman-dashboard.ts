import { WidgetUtilService } from '../../utils/widget-utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
// import { TargetGraphPage } from '../target-graph/target-graph';
// import { TargetPage } from '../target/target';
// import { TkCurrencyPage} from '../tk-currency/tk-currency';
// import { OutstandingPage} from '../outstanding/outstanding';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { SalesmanSelectCustomerPage } from '../salesman-select-customer/salesman-select-customer';

@IonicPage({
  name: 'SalesmanDashboardPage'
})
@Component({
  selector: 'page-salesman-dashboard',
  templateUrl: 'salesman-dashboard.html',
})
export class SalesmanDashboardPage {

  partyName: any;
  targetCategory: any = 'Total';

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private widgetUtil: WidgetUtilService, private modal:ModalController,
      private storageService: StorageServiceProvider) {
  }

  ionViewDidLoad() {
    this.getData()
  }
  async getData() {
    try{
      let profile = await this.storageService.getFromStorage('profile');
      this.partyName = profile['name']
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err)
    }
  }
  presentPopover(myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  targetCategorySelectionChanged(selectedValue: any){

      switch (this.targetCategory) {
        case 'category-1':
          console.log(selectedValue)
            break;
        case 'category-2':
          console.log(selectedValue)
            break;
        case 'category-3':
          console.log(selectedValue)
            break;
        case 'category-4':
          console.log(selectedValue)
            break;
        default:
          console.log(selectedValue) 
    }
    // console.log(selectedValue);
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

  openCustomerSelectionModal(){
    this.navCtrl.push(SalesmanSelectCustomerPage);
  }

  toggleView(){
    console.log('toggle clicked!')
  }

}
