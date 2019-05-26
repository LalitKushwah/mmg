import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider} from '../../providers/api-service/api-service'
import { WidgetUtilService} from '../../utils/widget-utils'
import { AddSalesmanModalPage } from '../add-salesman-modal/add-salesman-modal';
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
  updatedUserObject: any

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private apiService: ApiServiceProvider, 
              private widgetUtil: WidgetUtilService,
              private strorageService: StorageServiceProvider,
              private modalCtrl: ModalController) {
    this.showCustomerForm = this.selectedUserType
    const toBeAddSalesMan = this.navParams.get('data')
    if (toBeAddSalesMan) {
      if(this.salesmanList.length < 5) {
        this.salesmanList.push(toBeAddSalesMan)
      } else {
        console.log('===== Full =====')
      }
    }
  }

  async ngOnInit() {
    const profile: any = await this.strorageService.getFromStorage('profile')
    if (profile) {
      this.updatedUserObject = profile
      this.custName = profile.name
      this.custCode = profile.externalId
      this.tkPoint = profile.tkPoints
      this.tkCurrency = profile.tkCurrency
      this.selectedProvince = profile.province
    }
  }

  addSalesman() {
    const modal = this.modalCtrl.create(AddSalesmanModalPage);
    modal.present();
  }

  updateUser() {
    this.updatedUserObject.name = this.custName
    this.updatedUserObject.province = this.selectedProvince
    this.updatedUserObject.salesManList = []
    this.salesmanList.map((obj: any) => {
      this.updatedUserObject.salesManList.push(obj.userLoginId)
    })
    console.log('======= 73 ======', this.updatedUserObject)
  }

}
