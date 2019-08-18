import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Navbar, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider} from '../../providers/api-service/api-service'
import { WidgetUtilService} from '../../utils/widget-utils'
import { AddSalesmanModalPage } from '../add-salesman-modal/add-salesman-modal';
import { AdminListUserPage } from '../admin-list-user/admin-list-user';
import { AdminListSalesmanPage } from '../admin-list-salesman/admin-list-salesman';
import { CONSTANTS } from '../../utils/constants';

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
  userData: any = {}
  userTypeLabel: string = 'CUSTOMER'
  searchedKeyword = ''

  constructor (public navCtrl: NavController, 
              public navParams: NavParams, 
              private apiService: ApiServiceProvider, 
              private widgetUtil: WidgetUtilService,
              private strorageService: StorageServiceProvider,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private modal: ModalController) {
    this.showCustomerForm = this.selectedUserType
    const toBeAddSalesMan = this.navParams.get('data')
    this.searchedKeyword = this.navParams.get('searchedKeyword')
    this.prepareEditCustomerData()

    if (toBeAddSalesMan) {
      this.addSalesman(toBeAddSalesMan)
    }
  }

  async prepareEditCustomerData () {
    const customer: any = await this.strorageService.getFromStorage('editCustomerInfo')
    this.userData = customer
    if(this.userData['userType'] !='CUSTOMER'){
      this.userTypeLabel = "SM"
    }
    if (customer) {
      this.custName = customer.name
      this.custCode = customer.externalId
      this.tkPoint = customer.tkPoints
      this.tkCurrency = customer.tkCurrency
      this.selectedProvince = customer.province
      this.salesmanList = customer.associatedSalesmanList ? customer.associatedSalesmanList : []
    }
  }

  addSalesman (salesman) {
    this.strorageService.getFromStorage('editCustomerInfo').then(async (custInfoObj: any) => {
      const salesmanList = custInfoObj.associatedSalesmanList ? custInfoObj.associatedSalesmanList : []
      const res = salesmanList.filter(existingCust => {
        return existingCust.externalId === salesman.externalId
      })
      if (res.length === 0) {
        salesmanList.push({externalId:salesman.externalId,name:salesman.name})
        custInfoObj.associatedSalesmanList = salesmanList;
        this.strorageService.setToStorage('editCustomerInfo', custInfoObj).then(res => {
          this.salesmanList = res.associatedSalesmanList
        })
      } else {
        this.widgetUtil.showToast('Customer already exists!!!')
      }
    })
  }

  opneSalesmanModalPage () {
    const modal = this.modalCtrl.create(AddSalesmanModalPage);
    modal.present();
  }

  updateUser () {
    const loader = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    loader.present();
    this.updatedUserObject.externalId = this.custCode
    this.updatedUserObject.name = this.custName
    this.updatedUserObject.province = this.selectedProvince
    this.updatedUserObject.tkPoints = this.tkPoint
    this.updatedUserObject.tkCurrency = this.tkCurrency
    this.updatedUserObject.associatedSalesmanList = this.salesmanList
    this.apiService.updateUser(this.updatedUserObject).subscribe((res:any) => {
      if(res.body.nModified === 1) {
        this.widgetUtil.showToast('User Updated Successfully')
      } else {
        this.widgetUtil.showToast('Error while updating user')
      }
      loader.dismiss()
    }, (error) => {
      loader.dismiss()
      this.widgetUtil.showToast(`Error while updating user ${error}`)
    })
  }

  async removeSalesman (salesman) {

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
              return (data.externalId !== salesman.externalId)
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

  openCustomerDashboardModel () {
    const payModal = this.modal.create('ViewCustomerDataPage')
    payModal.present();
  }

  ionViewDidLoad () {
    this.navBar.backButtonClick = () => {
      this.userData.userType === 'CUSTOMER' ? this.navCtrl.push(AdminListUserPage, {searchedKeyword: this.searchedKeyword}) : this.navCtrl.push(AdminListSalesmanPage)
	  }
  }
  
  resetPasswordModel () {
    let alert = this.alertCtrl.create();
    alert.setTitle('Reset Password!')
    alert.setMessage('Are you sure you want to reset password for ' +  this.userData.name)
    alert.addButton({
      text: 'No',
      role: 'cancel',
      handler: () => {}
    });
    alert.addButton({
      text: 'Yes',
      cssClass: 'secondary',
      handler: () => {
        this.resetPassword(this.userData)
      }
    })
    alert.present(alert)
  }

  resetPassword (user) {
    console.log(user)
    this.apiService.resetUserPassowrd(user['_id']).subscribe((result) => {
      console.log(result)
      this.widgetUtil.showToast(`Password reset successfully. New password: ${CONSTANTS.DEFUALT_PASSWORD}`)
    }, (error) => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

}
