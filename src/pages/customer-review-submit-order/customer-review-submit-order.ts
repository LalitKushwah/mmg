import { CategoryTotalModalPage } from '../category-total-modal/category-total-modal';
import { HomePage } from '../home/home';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';
import { SalesmanDashboardPage } from '../salesman-dashboard/salesman-dashboard';
import { GenericService } from '../../providers/generic-service/generic-service';

@IonicPage({
  name: 'CustomerReviewSubmitOrderPage'
})

@Component({
  selector: 'page-customer-review-submit-order',
  templateUrl: 'customer-review-submit-order.html',
})
export class CustomerReviewSubmitOrderPage {

  cartItems: any = []
  orderTotal: any = 0
  totalTK = 0;
  totalNetWeight: number = 0
  showLoader: boolean = false
  showClearCartLoader: boolean = false
  salesmanProfile: any
  expanded = false;
  orderType: any = 'self';
  salesmanName: any ;
  salesmanId: any = 0;
  salesmanCode: any = 0;
  showSalesmanLabel: boolean = false;
  customerName: any;
  salesmanData: any = {};

  constructor (public navCtrl: NavController,
                public navParams: NavParams,
                private storageService: StorageServiceProvider,
                private apiService: ApiServiceProvider,
                private widgetUtil: WidgetUtilService,
                private modalController: ModalController,
                private genericService: GenericService,
                private alertController: AlertController) {

    this.showLoader = false
    this.orderTotal = (parseFloat((Math.round(this.navParams.get("orderTotal") * 100) / 100).toString()).toFixed(2))
    this.getCartItems()

    //Function to show Salesman Name in Review Order Page
    this.showSalesman()
  }

  ionViewDidEnter () {
    this.storageService.getTkPointsFromStorage().then((res: any) => {
      this.totalTK = res
    })
    this.storageService.getFromStorage('totalNetWeight').then((res: any) => {
      this.totalNetWeight = res
    })
  }

  async showSalesman () {
    let profile = await this.storageService.getFromStorage('profile')
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {

      let customerProfile = await this.storageService.getFromStorage('selectedCustomer')
      this.salesmanProfile = profile
      this.salesmanName = this.salesmanProfile['name']
      this.salesmanCode = this.salesmanProfile['externalId'],
      this.showSalesmanLabel = true
      this.customerName = customerProfile['name']
    }
  }

  async getCartItems () {
    this.cartItems = await this.storageService.getCartFromStorage()
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
  }

  doRefresh (refresher): void {
    this.getCartItems()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
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
    let profile = await this.storageService.getFromStorage('profile')
    let totalTkPoints = await this.storageService.getTkPointsFromStorage()
    let totalNetWeight = await this.storageService.getFromStorage('totalNetWeight')
    this.showLoader = true

    //Replacing the Profile with Selected Customer Profile if userType = SALESMAN
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
      profile = await this.storageService.getFromStorage('selectedCustomer')
    }


    let orderObj = {
      productList: this.cartItems.map((value) => {
        return {
          productId: value['_id'],
          quantity: value['quantity'],
          price: parseFloat(value['price']),
          tkPoint: parseFloat(value['tkPoint']),
          netWeight: parseFloat(value['netWeight']),
          parentCategoryId: value['parentCategoryId'],
          productSysCode: value['productSysCode']
        }
      }),
      userId: profile['_id'],
      salesmanName: this.salesmanName ? this.salesmanName : undefined,
      salesmanCode: this.salesmanCode ? this.salesmanCode : undefined,
      orderId: 'ORD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
      orderTotal: parseFloat(this.orderTotal.toString()),
      totalNetWeight: parseFloat(totalNetWeight.toString()),
      totalTkPoints: parseFloat(totalTkPoints.toString()),
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      province: profile['province'],
      lastUpdatedAt: Date.now()
    }

    this.apiService.submitOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setToStorage('cart', [])
      this.storageService.removeFromStorage('tkpoint')
      this.storageService.setToStorage('totalNetWeight', 0);
      
      //Removing the key-value after the order has been placed
      this.storageService.removeFromStorage('selectedCustomer')
      
      this.widgetUtil.showToast(CONSTANTS.ORDER_PLACED)
      if((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
        this.navCtrl.setRoot(SalesmanDashboardPage)
      } else {
        this.navCtrl.setRoot(HomePage)
      }
    }, (error) => {
      this.showLoader = false
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  async clearCart () {
    await this.storageService.clearCart();
    this.showClearCartLoader = true
    this.totalNetWeight = 0;
    this.orderTotal = 0
    this.totalTK = 0
    this.getCartItems()
    this.showClearCartLoader = false
    this.widgetUtil.showToast('All items removed from cart')
  }

  removeFromCart (product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
        if (value['_id'] === product['_id']) {
          this.cartItems.splice(index, 1)
        }
      });
      this.storageService.getTkPointsFromStorage().then(async (tkpoints: any) => {
        let tkpoint = tkpoints - (product.quantity * product.tkPoint);
        this.totalTK = tkpoint;
        await this.storageService.setToStorage('tkpoint', tkpoint);
      });
      this.storageService.setToStorage('cart', this.cartItems);
      this.getCartItems()
      this.calculateTotal();
    }
  }

  updateCart (product) {
    this.cartItems.map((value) => {
      if (value['_id'] === product['_id']) {
        let qty = parseInt(product.quantity);
        value.quantity = qty;
        value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
        return (qty)
      }
    });

    this.calculateTotal();
    this.storageService.setToStorage('cart', this.cartItems)
    return (product.quantity)
  }


  async calculateTotal () {
    const obj = this.genericService.calculateTotalNetWeightAndTotalTk(this.cartItems);
    this.totalNetWeight = obj.totalNetWeight;
    this.totalTK = obj.totalTKPoint
    this.orderTotal = obj.orderTotal;

    await this.storageService.setToStorage('orderTotal', this.orderTotal)
    await this.storageService.setToStorage('tkpoint', this.totalTK);
    await this.storageService.setToStorage('totalNetWeight', this.totalNetWeight.toFixed(3)) 
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
}
