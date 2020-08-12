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
  selectedCustomer: any;
  profile: any;
  isSalesman = false;

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
  }

  ionViewDidEnter () {
    if (this.isSalesman) {
      this.totalNetWeight = this.selectedCustomer.totalNetWeight;
      this.totalTK = this.selectedCustomer.tkPoint;
    } else {
      this.storageService.getFromStorage('totalNetWeight').then((res: any) => {
        this.totalNetWeight = res
      });
      this.storageService.getTkPointsFromStorage().then((res: any) => {
        this.totalTK = res
      });
    }
  }

  showSalesman () {
    if (this.isSalesman) {
      // let customerProfile = await this.storageService.getFromStorage('selectedCustomer');
      // let customerProfile = this.selectedCustomer;
      this.salesmanProfile = this.profile
      this.salesmanName = this.salesmanProfile['name']
      this.salesmanCode = this.salesmanProfile['externalId'],
      this.showSalesmanLabel = true
      this.customerName = this.selectedCustomer['name']
    }
  }

  async getCartItems () {
    this.profile = await this.storageService.getFromStorage('profile');
    if ((this.profile['userType'] === 'SALESMAN') || (this.profile['userType'] === 'SALESMANAGER')) {
      this.isSalesman = true;
      this.selectedCustomer = await this.storageService.getSelectedCustomer();
      this.cartItems = await this.storageService.getSelectedCartFromStorage(this.selectedCustomer._id);
    } else {
      this.cartItems = await this.storageService.getCartFromStorage()
    }
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
    //Function to show Salesman Name in Review Order Page
    this.showSalesman();
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
    let totalTkPoints;
    let totalNetWeight;
    if (this.isSalesman) {
      totalTkPoints = this.selectedCustomer.tkPoint;
      totalNetWeight = this.selectedCustomer.totalNetWeight;
    } else {
      totalTkPoints = await this.storageService.getTkPointsFromStorage()
      totalNetWeight = await this.storageService.getFromStorage('totalNetWeight')
    }
    this.showLoader = true

    //Replacing the Profile with Selected Customer Profile if userType = SALESMAN
    if (this.isSalesman) {
      this.profile = await this.storageService.getSelectedCustomer();
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
      userId: this.profile['_id'],
      salesmanName: this.salesmanName ? this.salesmanName : undefined,
      salesmanCode: this.salesmanCode ? this.salesmanCode : undefined,
      orderId: 'ORD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
      orderTotal: parseFloat(this.orderTotal.toString()),
      totalNetWeight: parseFloat(totalNetWeight.toString()),
      totalTkPoints: parseFloat(totalTkPoints.toString()),
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      province: this.profile['province'],
      lastUpdatedAt: Date.now()
    }

    this.apiService.submitOrder(orderObj).subscribe(async (result) => {
      this.showLoader = false;
      //Removing the key-value after the order has been placed
      if (this.isSalesman) {
        await this.storageService.clearSelectedCartFromStorage(this.selectedCustomer._id);
        let selectedCustomers: any = await this.storageService.getFromStorage('selectedCustomers');
        selectedCustomers = selectedCustomers.filter(customer => {
          return customer._id !== this.profile['_id'];
        });
        await this.storageService.setToStorage('selectedCustomers', selectedCustomers);
        this.navCtrl.setRoot(SalesmanDashboardPage)
      } else {
        await this.storageService.setToStorage('cart', []);
        await this.storageService.removeFromStorage('selectedCustomer');
        this.navCtrl.setRoot(HomePage)
      }
      
      this.widgetUtil.showToast(CONSTANTS.ORDER_PLACED)
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
    if (this.isSalesman) {
      await this.storageService.clearSelectedCartFromStorage(this.selectedCustomer._id);
    } else {
      await this.storageService.clearCart();
    }
    this.showClearCartLoader = true
    this.totalNetWeight = 0;
    this.orderTotal = 0
    this.totalTK = 0
    this.getCartItems()
    this.showClearCartLoader = false
    this.widgetUtil.showToast('All items removed from cart')
  }

  async removeFromCart (product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    if (this.cartItems.length > 0) {
      this.cartItems.map((value, index) => {
        if (value['_id'] === product['_id']) {
          this.cartItems.splice(index, 1)
        }
      });
      let tkpoint: any;
      if (this.isSalesman) {
        await this.storageService.updateCartForSelectedCustomer(this.selectedCustomer._id, this.cartItems);
        tkpoint = this.selectedCustomer.tkPoint - (product.quantity * product.tkPoint);
        this.totalTK = tkpoint;
        await this.storageService.updateSelectedCustomers(this.selectedCustomer._id, -1, -1, tkpoint);
      } else {
        await this.storageService.setToStorage('cart', this.cartItems);
        this.storageService.getTkPointsFromStorage().then(async (tkpoints: any) => {
          tkpoint = tkpoints - (product.quantity * product.tkPoint);
          this.totalTK = tkpoint;
          await this.storageService.setToStorage('tkpoint', tkpoint);
        });
      }
      this.getCartItems();
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
    if (this.isSalesman) {
      this.storageService.updateCartForSelectedCustomer(this.selectedCustomer._id, this.cartItems);
    } else {
      this.storageService.setToStorage('cart', this.cartItems)
    }
    return (product.quantity)
  }


  async calculateTotal () {
    const obj = this.genericService.calculateTotalNetWeightAndTotalTk(this.cartItems);
    this.totalNetWeight = obj.totalNetWeight;
    this.totalTK = obj.totalTKPoint
    this.orderTotal = obj.orderTotal;

    if (this.isSalesman) {
      await this.storageService.updateSelectedCustomers(this.selectedCustomer._id, this.orderTotal, this.totalNetWeight.toFixed(3), this.totalTK);
    } else {
      await this.storageService.setToStorage('orderTotal', this.orderTotal)
      await this.storageService.setToStorage('totalNetWeight', this.totalNetWeight.toFixed(3)) 
      await this.storageService.setToStorage('tkpoint', this.totalTK);
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
}
