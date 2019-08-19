import { WidgetUtilService } from '../../utils/widget-utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  }

  prepareData (selectedValue) {

    if(this.dashboardData){
      if (selectedValue !== 'Total') {
        this.data.target = (this.dashboardData['target' + selectedValue.name.charAt(0)]).toFixed(2)
        this.data.achievement = (this.dashboardData['achive' + selectedValue.name.charAt(0)]).toFixed(2)

      } else {
        this.data.target = (this.dashboardData['targetC']  + this.dashboardData['targetP'] + this.dashboardData['targetH'] + this.dashboardData['targetL']).toFixed(2)
        this.data.achievement = (this.dashboardData['achiveC']  + this.dashboardData['achiveP'] + this.dashboardData['achiveH'] + this.dashboardData['achiveL']).toFixed(2)
      }
      this.data.creditLimit = this.dashboardData.creditLimit ? this.dashboardData.creditLimit : 'NA'
      let temp: any = (this.data.achievement>0 && this.data.target>0) ? (this.data.achievement/this.data.target): 0;
      this.data.achievedPercentage = (temp * 100).toFixed(2);

      let tempTodo = this.data.target - this.data.achievement
      this.data.balanceToDo = (tempTodo > 0) ? (tempTodo.toFixed(2)) : 0
      
      this.data.currentOutStanding = "currentOutStanding" in this.dashboardData ? this.dashboardData.currentOutStanding : 0
      this.data.thirtyDaysOutStanding = "thirtyDaysOutStanding" in this.dashboardData ? this.dashboardData.thirtyDaysOutStanding : 0
      this.data.availableCreditLimit = this.data.creditLimit != 'NA' && this.data.currentOutStanding != 0 ? (this.data.creditLimit - this.data.currentOutStanding) : 'NA'
     
      //Preparing Data for Graph
      if(!(this.data.achievement && this.data.balanceToDo)){
        this.target = 0.1
        console.log(this.target)
      }
      else{
        this.target = this.data.balanceToDo
      }
      this.mtdAchieved = this.data.achievement
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
