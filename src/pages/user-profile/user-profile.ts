import { WidgetUtilService } from '../../utils/widget-utils';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, LoadingController } from 'ionic-angular';
import { PopoverHomePage } from '../popover-home/popover-home';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { CustomerHomePage } from '../customer-home/customer-home';

import { Chart } from 'chart.js';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
//import { CustomerListOrderPage } from '../customer-list-order/customer-list-order';
//import { SelectedCustomerOrderListPage } from '../selected-customer-order-list/selected-customer-order-list';
import { UserPaymentHistoryPage } from '../user-payment-history/user-payment-history';

@IonicPage({
  name: 'UserProfilePage'
})
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  
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
  data: any = {
    target:0,
    achievement: 0,
    achievedPercentage:0,
    balanceToDo:0,
    creditLimit:0,
    currentOutStanding:0,
    thirtyDaysOutStanding:0,
    availableCreditLimit:0,
    tkPoints:0,
    tkCurrency:0,
    mtdAchieved:0,
  }
  loader: any
  externalId: string = ''
  customerDashboard: boolean = true
  colorType: any

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
      console.log(profile)
      // this.partyName = profile['name']
      if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
        let selectedCustomerprofile = await this.storageService.getFromStorage('selectedCustomer')
        this.partyName = selectedCustomerprofile['name']
        this.externalId = selectedCustomerprofile['externalId']
        this.customerDashboard = false
        this.colorType = 'salesmanColor'
      }
      else {
        this.partyName = profile['name']
        this.externalId = profile['externalId']
        this.userTypeCustomer = true
        this.colorType = 'customerColor'
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

  openPaymentModal (){
    const payModal = this.modal.create('AddPaymentModalPage')
    payModal.present();
  }

  openShopPage (){
    this.navCtrl.push(CustomerHomePage);
  }

  openCustomerPaymentHistory (){
    this.navCtrl.push(UserPaymentHistoryPage);
  }

  // toggleView(){
  //   console.log('toggle clicked!')
  // }

  targetCategorySelectionChanged (selectedValue: any){
    this.prepareData(selectedValue)
}

prepareData (selectedValue) {
  if(this.dashboardData){
    //console.log('No data found')
    //this.target = this.data.balanceToDo
    //this.target = 1
    // console.log('executing else')
    // console.log(this.dashboardData)
    if (selectedValue !== 'Total') {
      this.data.target = (this.dashboardData['target' + selectedValue.name.charAt(0)]).toFixed(2)
      this.data.achievement = (this.dashboardData['achive' + selectedValue.name.charAt(0)]).toFixed(2)

    } else {
      this.data.target = ((this.dashboardData['targetC']  + this.dashboardData['targetP'] + this.dashboardData['targetH'] + this.dashboardData['targetL'])/4).toFixed(2)
      this.data.achievement = ((this.dashboardData['achiveC']  + this.dashboardData['achiveP'] + this.dashboardData['achiveH'] + this.dashboardData['achiveL'])/4).toFixed(2)
    }
    //console.log(this.data)
    this.data.creditLimit = "creditLimit" in this.dashboardData ? this.dashboardData.creditLimit : 0
    let temp: any = (this.data.achievement>0 && this.data.target>0) ? (this.data.achievement/this.data.target): 0;
    //console.log(temp)
    this.data.achievedPercentage = (temp * 100).toFixed(2);
    this.data.balanceToDo = (this.data.target > this.data.achievement) ? (this.data.target - this.data.achievement).toFixed(2) : 0
    
    this.data.currentOutStanding = "currentOutStanding" in this.dashboardData ? this.dashboardData.currentOutStanding : 0

    this.data.thirtyDaysOutStanding = "thirtyDaysOutStanding" in this.dashboardData ? this.dashboardData.thirtyDaysOutStanding: 0

    this.data.availableCreditLimit = (this.data.creditLimit - this.data.currentOutStanding).toFixed(2)
    
    this.data.tkPoints = "tkPoints" in this.dashboardData ? this.dashboardData.tkPoints : 0
    this.data.tkCurrency = "tkCurrency" in this.dashboardData ? this.dashboardData.tkCurrency : 0

    //Preparing Data for Graph
    this.mtdAchieved = this.data.achievement
    this.target = this.data.balanceToDo  
  }
  this.displayChart()
  
}

ionViewWillUnload () {
  this.loader.dismiss()
}

}
