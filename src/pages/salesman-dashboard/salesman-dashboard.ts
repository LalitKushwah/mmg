import { WidgetUtilService } from '../../utils/widget-utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
// import { TargetGraphPage } from '../target-graph/target-graph';
// import { TargetPage } from '../target/target';
// import { TkCurrencyPage} from '../tk-currency/tk-currency';
// import { OutstandingPage} from '../outstanding/outstanding';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { SalesmanSelectCustomerPage } from '../salesman-select-customer/salesman-select-customer';

// import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
import { Chart } from 'chart.js';

@IonicPage({
  name: 'SalesmanDashboardPage'
})
@Component({
  selector: 'page-salesman-dashboard',
  templateUrl: 'salesman-dashboard.html',
})
export class SalesmanDashboardPage {

  @ViewChild('pieCanvas') pieCanvas;
  mtdAchieved: number;
  target: number;
  pieChart: any;
  showChart: boolean = false;
  partyName: any;
  targetCategory: any = 'Total';

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private widgetUtil: WidgetUtilService, private modal:ModalController,
      private storageService: StorageServiceProvider) {

        this.mtdAchieved = 20;
        this.target = 30;
  }

  displayChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        datasets: [{
          data: [this.mtdAchieved, this.target],
          backgroundColor: [
            '#225F93',
            '#E7ECFF'
          ]
        }],
        labels: [
          'MTD Achieved',
          'Target'
      ]
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: true
        },
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        }
      },
 
    });
  }


  ionViewDidLoad() {
    this.getData()
    this.displayChart()
    
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

  // toggleView(){
  //   console.log('toggle clicked!')
  //   console.log(this.showChart);
  //   this.showChart = !this.showChart;
  //   console.log(this.showChart);
  //   this.displayChart()
  // }

}
