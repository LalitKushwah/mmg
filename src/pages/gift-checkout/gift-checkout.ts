import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {HomePage} from "../home/home";
import {CONSTANTS} from "../../utils/constants";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {WidgetUtilService} from "../../utils/widget-utils";
import { DatePipe } from '@angular/common'


@IonicPage()
@Component({
  selector: 'page-gift-checkout',
  templateUrl: 'gift-checkout.html',
})
export class GiftCheckoutPage {

  totalTkCurrency = 0
  giftCartProducts = []
  showLoader: boolean = false
  customerCode

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storageService: StorageServiceProvider,
              private apiService: ApiServiceProvider,
              public widgetUtil: WidgetUtilService,
              private datePipe: DatePipe,
              private alertController: AlertController) {
    this.showLoader = false
    this.giftCartProducts = this.navParams.get('cart')
    this.calculateTotalTkCurrency()
  }

  async ionViewWillEnter() {
    let profile = await this.storageService.getFromStorage('profile')
    this.apiService.getUserDetails(profile['userLoginId']).subscribe(res => {
      this.customerCode = res.body[0].externalId
    })
  }

  calculateTotalTkCurrency() {
    this.totalTkCurrency = 0
    if (this.giftCartProducts.length) {

      this.giftCartProducts.map(product => {
        this.totalTkCurrency = this.totalTkCurrency + (parseFloat(product.tkCurrencyValue) * parseInt(product.quantity))
      })
    }
  }

  expandItem(event: any) {
    if (event.target.parentElement && event.target.parentElement.nextElementSibling) {
      event.target.parentElement.classList.toggle('expand')
      event.target.parentElement.nextElementSibling.classList.toggle('expand-wrapper')
    }
  }

  removeFromCart(product) {
    this.widgetUtil.showToast(`${product.name} removed from cart`)
    if (this.giftCartProducts.length > 0) {
      this.giftCartProducts.map((value, index) => {
        if (value['_id'] === product['_id']) {
          this.giftCartProducts.splice(index, 1)
        }
      });
      this.storageService.setGiftProductCart(this.giftCartProducts)
      this.calculateTotalTkCurrency()
    }
  }

  async clearCart() {
    this.giftCartProducts = []
    this.totalTkCurrency = 0
    this.storageService.setGiftProductCart(this.giftCartProducts)
    const totalCurrency = await this.storageService.getFromStorage('totalTkCurrency')
    await this.storageService.setToStorage('leftTkCurrency', totalCurrency)
  }

  async confirmSubmitOrder() {
    const alert = this.alertController.create({
      title: 'Disclaimer',
      subTitle: 'Gift Rewards shown in images may differ from actual products.',
      buttons: [
        {
          text : 'Okay',
          handler: () => {
            this.submitGiftOrder()
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

  async submitGiftOrder() {
    this.showLoader = true
    let profile = await this.storageService.getFromStorage('profile')
    let orderObj: any = {
      productList: this.giftCartProducts.map((value) => {
        return {
          giftProductId: value['_id'],
          productName: value['name'],
          quantity: value['quantity'],
          tkCurrency: value['tkCurrencyValue']
        }
      }),
      userId: profile['_id'],
      userName: profile['name'],
      userLoginId: profile['userLoginId'],
      orderId: 'GRD' + Math.floor(Math.random() * 90000) + Math.floor(Math.random() * 90000),
      totalTkCurrency: this.totalTkCurrency,
      lastUpdatedAt: Date.now()
    }

    orderObj.emailContent = `<!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="utf-8">                                                               
                                <style>
                                #customers {
                                  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                                  border-collapse: collapse;
                                  width: 100%;
                                }
                                
                                #customers td, #customers th {
                                  border: 1px solid #ddd;
                                  padding: 8px;
                                }
                                
                                #customers tr:nth-child(even){background-color: #f2f2f2;}
                                
                                #customers tr:hover {background-color: #ddd;}
                                
                                #customers th {
                                  padding-top: 12px;
                                  padding-bottom: 12px;
                                  text-align: left;
                                  background-color: #4CAF50;
                                  color: white;
                                }
                                </style>    
                              </head>
                              <body style="padding:30px">
                                <p>Dear TK Management Team,</p>
                                <table id="customers" border="1px">
                                  <tr>
                                    <td>Order Number</td>
                                    <td>${orderObj.orderId}</td>
                                  </tr>
                                  <tr>
                                    <td>Date</td>
                                    <td>${this.datePipe.transform(orderObj.lastUpdatedAt, 'MM/dd/yyyy')}</td>
                                  </tr>
                                  <tr>
                                    <td>Dealer Name</td>
                                    <td>${orderObj.userName}</td>
                                  </tr>
                                  <tr>
                                    <td>Dealer Code</td>
                                    <td>${this.customerCode}</td>
                                  </tr>
                                  <tr>
                                    <td>Currency Used</td>
                                    <td>${orderObj.totalTkCurrency}</td>
                                </table>
                                <br/>
                                <table border="1" id="customers">
                                  <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                ${orderObj.productList.map(product => {
      return (
        `<tr>
                                      <td>${product.productName}</td>
                                      <td>${product.quantity}</td>
                                    </tr>`
      )
    }).join('')}                       
                                </tbody>
                                </table>
                              </body>
                            </html>
                            `

    this.apiService.submitGiftOrder(orderObj).subscribe((result) => {
      this.showLoader = false
      this.storageService.setGiftProductCart([])
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

}
