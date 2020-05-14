import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { EditUserPage } from '../edit-user/edit-user';
import { WidgetUtilService } from '../../utils/widget-utils';

/**
 * Generated class for the AddSalesmanModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'AddSalesmanModalPage'
})
@Component({
  selector: 'page-add-salesman-modal',
  templateUrl: 'add-salesman-modal.html',
})
export class AddSalesmanModalPage {
  salesmanList = []
  filteredSalesmanList = []

  constructor (public navCtrl: NavController, 
              public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private widgetUtils: WidgetUtilService) {
              
              this.getAllSalesmanList()
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddSalesmanModalPage');
  }

  getAllSalesmanList () {
    const loader = this.loadingCtrl.create({
      content: "Fetching Salesman List...",
    });
    loader.present()
    this.apiService.getAllSalesman().subscribe(response => {
      this.salesmanList = response.body
      this.filteredSalesmanList = this.salesmanList
      loader.dismiss()
    }, error => {
      loader.dismiss()
      this.widgetUtils.showToast(`Error while fetching salesman ${error}`)
    })
  }

  searchSalesman (value) {
    this.filteredSalesmanList = this.salesmanList.filter(salesman =>
      salesman.name.toLowerCase().includes(value.toLowerCase())
    )
  }

  addSalesMan (salesman) {
    const confirm = this.alertCtrl.create({
      title: 'Add salesman to customer?',
      message: 'Are you sure to add?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.navCtrl.push(EditUserPage, {data: salesman})
          }
        }
      ]
    });
    confirm.present();
  }

  dismissModal (){
    this.navCtrl.push(EditUserPage);
  }
  
}
  