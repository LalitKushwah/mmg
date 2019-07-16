import { WidgetUtilService } from '../../utils/widget-utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

import { Chart } from 'chart.js';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage({
  name: 'ViewCustomerDataPage'
})
@Component({
  selector: 'page-view-customer-data',
  templateUrl: 'view-customer-data.html',
})
export class ViewCustomerDataPage {
  @ViewChild('pieCanvas') pieCanvas;
  mtdAchieved: number;
  target: number;
  pieChart: any;
  partyName: any;
  selectedCustomerprofile: any;
  userTypeCustomer: boolean = false;
  targetCategory: any = 'Total';
  dashboardData: any;
  categoryList: any = []
  data: any = {}
  loader: any
  externalId: string = ''
  customerDashboard: boolean = false

  constructor (public navCtrl: NavController, 
              private view: ViewController,
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
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        },
        tooltips: {
          enabled: false
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
      if ((profile['userType'] === 'ADMIN') || (profile['userType'] === 'ADMINHO')) {
        let selectedCustomerprofile = await this.storageService.getFromStorage('editCustomerInfo')
        //console.log(selectedCustomerprofile)
        if(selectedCustomerprofile['userType']==='CUSTOMER'){
          this.customerDashboard = true
        }

        this.partyName = selectedCustomerprofile['name']
        this.externalId = selectedCustomerprofile['externalId']
      }
      this.apiService.getDashboardData(this.externalId).subscribe((res: any) => {
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

  targetCategorySelectionChanged (selectedValue: any) {
    this.prepareData(selectedValue)
  }

prepareData (selectedValue) {
  if(!this.dashboardData){
    //console.log('No data found')
    this.data.target = 0
    this.data.achievement = 0

    this.data.achievedPercentage = 0
    this.data.balanceToDo = 0
    this.data.creditLimit = 0
    this.data.currentOutStanding = 0
    this.data.thirtyDaysOutStanding = 0
    this.data.availableCreditLimit = 0

    this.data.tkPoints = 0
    this.data.tkCurrency = 0
    //console.log(this.data)
    //Preparing Data for Graph
    this.mtdAchieved = this.data.achievement
    //this.target = this.data.balanceToDo
    this.target = 1
    this.displayChart()
  }

  else{
    //console.log('executing else')
    if (selectedValue !== 'Total') {
      this.data.target = (this.dashboardData['target' + selectedValue.name.charAt(0)]).toFixed(2)
      this.data.achievement =( this.dashboardData['achive' + selectedValue.name.charAt(0)]).toFixed(2)

    } else {
      this.data.target = ((this.dashboardData['targetC']  + this.dashboardData['targetP'] + this.dashboardData['targetH'] + this.dashboardData['targetL'])/4).toFixed(2)
      this.data.achievement = ((this.dashboardData['achiveC']  + this.dashboardData['achiveP'] + this.dashboardData['achiveH'] + this.dashboardData['achiveL'])/4).toFixed(2)
    }
    this.data.creditLimit = "creditLimit" in this.dashboardData ? this.dashboardData.creditLimit : 0
    let temp: any = (this.data.achievement>0 && this.data.target>0) ? (this.data.achievement/this.data.target): 0;
    this.data.achievedPercentage = (temp * 100).toFixed(2);
    console.log("Ok")
    this.data.balanceToDo = (this.data.target > this.data.achievement) ? (this.data.target - this.data.achievement).toFixed(2) : 0
    this.data.currentOutStanding = "currentOutStanding" in this.dashboardData ? this.dashboardData.currentOutStanding : 0

    this.data.thirtyDaysOutStanding = "thirtyDaysOutStanding" in this.dashboardData ? this.dashboardData.thirtyDaysOutStanding : 0

    this.data.availableCreditLimit = (this.data.creditLimit !== 0 && this.data.creditLimit !== undefined) ? ((this.data.creditLimit - this.data.currentOutStanding).toFixed(2)) : 'NA'
    
    this.data.tkPoints = "tkPoints" in this.dashboardData ? this.dashboardData.tkPoints : 0
    this.data.tkCurrency = "tkCurrency" in this.dashboardData ? this.dashboardData.tkCurrency : 0

    //Preparing Data for Graph
    this.mtdAchieved = this.data.achievement
    this.target = this.data.balanceToDo
    this.displayChart()
    //console.log(this.data)
  }
  
}

closePayModal () {
  this.view.dismiss();
}
ionViewWillUnload () {
  this.loader.dismiss()
}

}