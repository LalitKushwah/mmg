import { WidgetUtilService } from '../../utils/widget-utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, LoadingController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { SalesmanSelectCustomerPage } from '../salesman-select-customer/salesman-select-customer';
import { Chart } from 'chart.js';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage({
  name: 'SalesmanDashboardPage'
})
@Component({
  selector: 'page-salesman-dashboard',
  templateUrl: 'salesman-dashboard.html',
})
export class SalesmanDashboardPage {

  @ViewChild('pieCanvas') pieCanvas;
  mtdAchieved: number = 0;
  target: number = 1;
  pieChart: any;
  partyName: any;
  selectedCustomerprofile: any;
  userTypeCustomer: boolean = false;
  targetCategory: any = 'Total';
  dashboardData: any;
  categoryList: any = []
  data: any = {
    target:0,
    achievement: 0,
    achievedPercentage:0,
    balanceToDo:0,
    creditLimit:0,
    currentOutStanding:0,
    thirtyDaysOutStanding:0,
    availableCreditLimit:0,
    // tkPoints:0,
    // tkCurrency:0,
    mtdAchieved:0,
    }
  loader: any
  externalId: string = '3'

  constructor (public navCtrl: NavController, 
              public navParams: NavParams,
              private widgetUtil: WidgetUtilService, 
              private modal:ModalController,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private loadingCtrl: LoadingController) {
  }

  displayChart () {
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
          'Balance To Do'
      ]
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: false
        },
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        },
        events: []
      },
 
    });
  }

  ionViewDidLoad () {
    this.getData() 
  }
  async getData () {
    this.loader = this.loadingCtrl.create({
      content: "Fetching Data...",
    });
    this.loader.present()
    try {
      let profile = await this.storageService.getFromStorage('profile')

      this.partyName = profile['name']
      console.log('======= 99 =======', profile)

      // TODO update in argument
      this.apiService.getDashboardData(profile['externalId']).subscribe((res: any) => {
        this.dashboardData = res.body[0]
        this.apiService.getParentCategoryList(0,20).subscribe((res:any) => {
          this.categoryList = res.body
          this.prepareData('Total')
          this.loader.dismiss()
        })
      })
    }
    catch (err) {
      console.log('Error: Profile Details could not Load', err)
      this.loader.dismiss()
    }
  }
  presentPopover (myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  totalCategorySelected () {
    this.prepareData('Total')
  }

  targetCategorySelectionChanged (selectedValue: any){

    this.prepareData(selectedValue)
    switch (selectedValue.name) {
      case 'Confectionary':
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
}

prepareData (selectedValue) {

  if(this.dashboardData){
    if (selectedValue !== 'Total') {
      this.data.target = this.dashboardData['target' + selectedValue.name.charAt(0)]
      this.data.achievement = this.dashboardData['achive' + selectedValue.name.charAt(0)]

    } else {
      this.data.target = (this.dashboardData['targetC']  + this.dashboardData['targetP'] + this.dashboardData['targetH'] + this.dashboardData['targetL'])/4
      this.data.achievement = (this.dashboardData['achiveC']  + this.dashboardData['achiveP'] + this.dashboardData['achiveH'] + this.dashboardData['achiveL'])/4
    }

    this.data.achievedPercentage = (this.data.achievement/this.data.target) * 100
    this.data.balanceToDo = this.data.target - this.data.achievement
    this.data.creditLimit = this.dashboardData.creditLimit
    this.data.currentOutStanding = this.dashboardData.currentOutStanding
    this.data.thirtyDaysOutStanding = this.dashboardData.thirtyDaysOutStanding
    this.data.availableCreditLimit = this.dashboardData.creditLimit - this.data.currentOutStanding
    // this.data.tkPoints = this.dashboardData.tkPoints
    // this.data.tkCurrency = this.dashboardData.tkCurrency
    //Preparing Data for Graph
    this.mtdAchieved = this.data.achievement
    this.target = this.data.balanceToDo 
  }
    this.displayChart()
}

  openCustomerSelectionModal (){
    this.navCtrl.push(SalesmanSelectCustomerPage);
  }

  ionViewWillUnload () {
    this.loader.dismiss()
  }

}
