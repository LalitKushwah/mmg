import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { EditUserPage } from '../edit-user/edit-user';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private alertCtrl: AlertController) {
              
                this.getAllSalesmanList()
  }

  ionViewWillEnter() {
    this.getAllSalesmanList()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSalesmanModalPage');
  }

  getAllSalesmanList() {
    this.apiService.getAllSalesman().subscribe(response => {
      this.salesmanList = response.body
      this.filteredSalesmanList = this.salesmanList
    })
  }

  searchProducts(value) {
    this.filteredSalesmanList = this.salesmanList.filter(salesman =>
      salesman.name.toLowerCase().includes(value.toLowerCase())
    )
  }

  addSalesMan(salesman) {
    const confirm = this.alertCtrl.create({
      title: 'Add salesman to customer?',
      message: 'Are you sure to add?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
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

  dismissModal(){
    this.navCtrl.push(EditUserPage);
  }
  
}
  