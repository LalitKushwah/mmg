import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CategoryTotalModalPage } from '../category-total-modal/category-total-modal';
import { CustomerHomePage } from '../customer-home/customer-home';
import { SalesmanDashboardPage } from '../salesman-dashboard/salesman-dashboard';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { CommonService } from '../../providers/common.service';
import { GenericService } from '../../providers/generic-service/generic-service';

@IonicPage({
  name: 'SmEditOrderPage'
})
@Component({
  selector: 'page-sm-edit-order',
  templateUrl: 'sm-edit-order.html',
})
export class SmEditOrderPage {
  cartItems: any = []
  orderDetail: any = {}
  showImportOrder = false
  showLoader = false
  showCsvButton = false
  showCancelOrder = false
  orderItemsAvailable =false
  csvData: any[] = [];
  headerRow: any[] = [];
  
  constructor ( public navCtrl: NavController, 
                public navParams: NavParams,
                public alertController: AlertController,
                public storageService: StorageServiceProvider,
                public widgetUtil: WidgetUtilService,
                public modalController: ModalController,
                public apiService: ApiServiceProvider,
                public genericService: GenericService,
                public commonService: CommonService) {
  }

  async ionViewWillEnter () {
    this.orderDetail = await this.storageService.getFromStorage('order')
    this.cartItems = this.orderDetail.productList
    this.addSubTotalToProducts()
  }

  async ngOnInit () {
    this.orderDetail = await this.storageService.getFromStorage('order')
    this.cartItems = this.orderDetail.productList
    this.addSubTotalToProducts()
  }

  addSubTotalToProducts () {
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
  }

  confirmSubmitOrder () {
    const alert = this.alertController.create({
      title: 'Confirmation',
      subTitle: 'Are you sure to place order?',
      buttons: [
        {
          text : 'Okay',
          handler: () => {
            this.submitOrder()
          }
        },
        {
          text : 'Close',
          handler: () => {
            // do nothing
          }
        }
      ]
    });
    alert.present();
  }

  async submitOrder () {
    this.showLoader = true
    this.orderDetail.lastUpdatedAt = Date.now()
    this.apiService.createEditedOrderToErp(this.orderDetail).subscribe(async (result) => {
      this.showLoader = false
      await this.storageService.removeFromStorage('order')

      //Removing the key-value after the order has been placed
      this.storageService.removeFromStorage('selectedCustomer')
      
      this.widgetUtil.showToast(CONSTANTS.ORDER_PLACED)
      this.navCtrl.setRoot(SalesmanDashboardPage)
    }, (error) => {
      this.showLoader = false
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  removeFromCart (product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
        if (value['productId'] === product['productId']) {
          this.cartItems.splice(index, 1)
        }
      });
      this.orderDetail.productList = this.cartItems
      const temp = this.genericService.calculateTotalNetWeightAndTotalTk(this.cartItems);
      this.orderDetail.totalTkPoints = temp.totalTKPoint;
      this.orderDetail.totalNetWeight = temp.totalNetWeight;

      // if there is any problem with total TK point calculation then visit history

      this.storageService.setToStorage('order', this.orderDetail);
      // this.getCartItems()
      this.calculateOrderTotal()

    }
  }

  async updateCart (product) {
    this.cartItems.map((value) => {
      if (value['productId'] === product['productId']) {
        let qty = parseInt(product.quantity);
        value.quantity = qty;
        value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
        return (qty)
      }
    });
    const temp = this.genericService.calculateTotalNetWeightAndTotalTk(this.cartItems);
    this.orderDetail.totalTkPoints = temp.totalTKPoint;
    this.orderDetail.totalNetWeight = temp.totalNetWeight;
    this.orderDetail.productList = this.cartItems
    await this.storageService.setToStorage('order', this.orderDetail)
    this.calculateOrderTotal();
    return (product.quantity)
  }


  async calculateOrderTotal () {
    if (this.cartItems.length > 0) {
      let updatedTotal = 0
      this.cartItems.map((value) => {
        updatedTotal = updatedTotal + (parseFloat(value.price) * parseInt(value.quantity))
      })
      this.orderDetail.orderTotal = parseFloat((Math.round(updatedTotal * 100) / 100).toString()).toFixed(2)
    } else {
      this.orderDetail.orderTotal = 0
    }
  }

  openCategoryTotalModal () {
    const modal = this.modalController.create(CategoryTotalModalPage, {cartItems: this.cartItems})
    modal.present()
  }


  expandItem (event: any) {
    if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
      event.target.parentElement.classList.toggle('expand')
      event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
    }
  }

  addNewItem () {
    this.navCtrl.push(CustomerHomePage, { isEdit: true })
  }

  moveToSMHome () {
    this.navCtrl.setRoot(SalesmanDashboardPage)
  }

}
