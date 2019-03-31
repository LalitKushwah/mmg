import { CategoryTotalModalPage } from '../category-total-modal/category-total-modal';
import { HomePage } from '../home/home';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { CONSTANTS } from '../../utils/constants';

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
  showLoader: boolean = false
  showClearCartLoader: boolean = false
  expanded = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              private widgetUtil: WidgetUtilService,
              private modalController: ModalController,
              private alertController: AlertController) {

    this.showLoader = false
    this.orderTotal = (parseFloat((Math.round(this.navParams.get("orderTotal") * 100) / 100).toString()).toFixed(2))
    this.getCartItems()
  }

  ionViewDidEnter(){
    this.calculateOrderTotal()
    this.storageService.getTkPointsFromStorage().then((res: any) => {
      this.totalTK = res
    })
  }

  async getCartItems() {
    this.cartItems = await this.storageService.getCartFromStorage()
    this.cartItems.map((value) => {
      value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
      value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
    })
  }

  doRefresh(refresher): void {
    this.getCartItems()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  confirmSubmitOrder() {
    const alert = this.alertController.create({
      title: 'Information',
      subTitle: 'TK points will convert into TK currency post target achievement of QTR',
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

  async submitOrder() {
    let profile = await this.storageService.getFromStorage('profile')
    let totalTkPoints = await this.storageService.getTkPointsFromStorage()
    this.showLoader = true
    let orderObj = {
      productList: this.cartItems.map((value) => {
        return {
          productId: value['_id'],
          quantity: value['quantity'],
          price: parseFloat(value['price']),
          tkPoint: parseInt(value.tkPoint)
        }
      }),
      userId: profile['_id'],
      orderId: 'ORD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
      orderTotal: parseFloat(this.orderTotal.toString()),
      totalTkPoints: parseInt(totalTkPoints.toString()),
      status: CONSTANTS.ORDER_STATUS_PROGRESS,
      province: profile['province'],
      lastUpdatedAt: Date.now()
    }
    this.apiService.submitOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setToStorage('cart', [])
      this.storageService.removeFromStorage('tkpoint')
      this.widgetUtil.showToast(CONSTANTS.ORDER_PLACED)
      this.navCtrl.setRoot(HomePage)
    }, (error) => {
      this.showLoader = false
      console.log('error', error)
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  async clearCart() {
    this.showClearCartLoader = true
    await this.storageService.setToStorage('cart', [])
    await this.storageService.removeFromStorage('tkpoint')
    this.orderTotal = 0
    this.totalTK = 0
    this.getCartItems()
    this.showClearCartLoader = false
    this.widgetUtil.showToast('All items removed from cart')
  }

  removeFromCart(product) {
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
      this.calculateOrderTotal()
    }
  }

  decrementQty(product) {
    this.cartItems.map((value) => {
      if (value['_id'] === product['_id']) {
        let qty = parseInt(value.quantity) - 1
        if (qty >= 0) {
          value.quantity = qty
          value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
        }
        return (qty)
      }
    })
    let sum = 0
    this.cartItems.map(item => {
      if (item.tkPoint) {
        sum = sum + (parseFloat(item.tkPoint) * parseInt(item.quantity))
      }
    })
    this.totalTK = sum
    this.storageService.setToStorage('tkpoint', sum)
    this.calculateOrderTotal()
    this.storageService.setToStorage('cart', this.cartItems)
    return (product.quantity)
  }

  incrementQty(product) {
    this.cartItems.map((value) => {
      if (value['_id'] === product['_id']) {
        let qty = parseInt(value.quantity) + 1
        value.quantity = qty
        value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2))
        return (qty)
      }
    })
    let sum = 0
    this.cartItems.map(item => {
      if (item.tkPoint) {
        sum = sum + (parseFloat(item.tkPoint) * parseInt(item.quantity))
      }
    })
    this.totalTK = sum
    this.storageService.setToStorage('tkpoint', sum)
    this.calculateOrderTotal()
    this.storageService.setToStorage('cart', this.cartItems)
    return (product.quantity)
  }

  updateCart(product) {
    this.cartItems.map((value) => {
      if (value['_id'] === product['_id']) {
        let qty = parseInt(product.quantity);
        value.quantity = qty;
        value['subTotal'] = (parseFloat((Math.round((value.quantity * parseFloat(value.price) * 100) / 100)).toString()).toFixed(2));
        return (qty)
      }
    });
    let sum = 0;
    this.cartItems.map(item => {
      if (item.tkPoint) {
        sum = sum + (parseFloat(item.tkPoint) * parseInt(item.quantity))
      }
    });
    this.totalTK = sum;
    this.storageService.setToStorage('tkpoint', sum);
    this.calculateOrderTotal();
    this.storageService.setToStorage('cart', this.cartItems)
    return (product.quantity)
  }


  async calculateOrderTotal() {
    if (this.cartItems.length > 0) {
      let updatedTotal = 0
      this.cartItems.map((value) => {
        updatedTotal = updatedTotal + (parseFloat(value.price) * parseInt(value.quantity))
      })
      this.orderTotal = parseFloat((Math.round(updatedTotal * 100) / 100).toString()).toFixed(2)
    } else {
      this.orderTotal = 0
    }
    await this.storageService.setToStorage('orderTotal', this.orderTotal)
  }

  openCategoryTotalModal() {
    const modal = this.modalController.create(CategoryTotalModalPage, {cartItems: this.cartItems})
    modal.present()
  }

  expandItem(event: any) {
    if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
      event.target.parentElement.classList.toggle('expand')
      event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
    }
  }
}
