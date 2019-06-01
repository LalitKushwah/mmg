import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Navbar, NavParams, ModalController, AlertController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider} from '../../providers/api-service/api-service'
import { WidgetUtilService} from '../../utils/widget-utils'
import { AddSalesmanModalPage } from '../add-salesman-modal/add-salesman-modal';
import { AdminListUserPage } from '../admin-list-user/admin-list-user';
 /**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'EditUserPage'
})
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  @ViewChild(Navbar) navBar: Navbar;
  showLoader = false;
  provinceList: Array<any> =  [ 'BOTSWANA', 'COPPERBELT', 'DRC', 'EASTERN', 'KENYA', 'LUAPULA', 'LUSAKA', 'MALAWI', 'MOZAMBIQUE', 'NORTH WESTERN', 'NORTHERN'
  ,'SOUTH AFRICA', 'SOUTHERN', 'TANZANIA', 'WESTERN', 'ZIMBABWE' ]
  selectedUserType : string = 'CUSTOMER'
  selectedCountry : string = 'ZAMBIA'
  selectedProvince : string = 'BOTSWANA'
  showCustomerForm: string = 'CUSTOMER'
  custName: string;
  custCode:string='';
  tkPoint: string='';
  tkCurrency: string='';
  salesmanList = []
  updatedUserObject: any = {}

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private apiService: ApiServiceProvider, 
              private widgetUtil: WidgetUtilService,
              private strorageService: StorageServiceProvider,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.showCustomerForm = this.selectedUserType
    const toBeAddSalesMan = this.navParams.get('data')
    
    this.prepareEditCustomerData()

    if (toBeAddSalesMan) {
      this.addSalesman(toBeAddSalesMan)
    }
  }

  async prepareEditCustomerData() {
    const customer: any = await this.strorageService.getFromStorage('editCustomerInfo')
    if (customer) {
      this.custName = customer.name
      this.custCode = customer.externalId
      this.tkPoint = customer.tkPoints
      this.tkCurrency = customer.tkCurrency
      this.salesmanList = customer.salesManList ? customer.salesManList : []
    }
  }

  addSalesman(salesman) {
    this.strorageService.getFromStorage('editCustomerInfo').then(async (custInfoObj: any) => {
      const salesmanList = custInfoObj.salesManList ? custInfoObj.salesManList : []
      salesmanList.push(salesman)
      custInfoObj.salesManList = salesmanList;
      this.strorageService.setToStorage('editCustomerInfo', custInfoObj).then(res => {
        this.salesmanList = res.salesManList
      })
    })
  }

  opneSalesmanModalPage() {
    const modal = this.modalCtrl.create(AddSalesmanModalPage);
    modal.present();
  }

  updateUser() {
    this.updatedUserObject.name = this.custName
    this.updatedUserObject.province = this.selectedProvince
    this.updatedUserObject.tkPoints = this.tkPoint
    this.updatedUserObject.tkCurrency = this.tkCurrency
    this.updatedUserObject.salesManList = this.salesmanList
    console.log('======= 82 =======', this.updatedUserObject)
  }

  removeSalesman(salesman) {

    const confirm = this.alertCtrl.create({
      title: 'Remove salesman?',
      message: 'Are you sure to remove this salesman association to customer?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree Clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            const updatedSalesmanList = this.salesmanList.filter(data => {
              return (data.userLoginId !== salesman.userLoginId)
            })

            this.strorageService.getFromStorage('editCustomerInfo').then(async (custInfoObj: any) => {
              custInfoObj.salesManList = updatedSalesmanList;
              this.strorageService.setToStorage('editCustomerInfo', custInfoObj).then(res => {
                this.salesmanList = res.salesManList
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
	    this.navCtrl.setRoot(AdminListUserPage);
	}
}

}
