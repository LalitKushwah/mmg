import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { WidgetUtilService } from "../../utils/widget-utils";

/**
 * Generated class for the OracleConnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'OracleConnectPage'
})
@Component({
  selector: 'page-oracle-connect',
  templateUrl: 'oracle-connect.html',
})
export class OracleConnectPage {
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiServiceProvider,
              private widgetUtil :WidgetUtilService,
              private loadingCtrl: LoadingController) {
  }

  updateProductInMongo() {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.updateProductInMongo().subscribe(res => {
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }

  updateProductStatInERP() {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.updateProductStatInERP().subscribe(res => {
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }

  updateCustomerInMongo() {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.updateCustomerInMongo().subscribe(res => {
      console.log('===== 62 =====', res)
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }

  updateCustomerStatInERP() {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.updateCustomerStatInERP().subscribe(res => {
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }

  createNewCustomerInMongo () {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.createNewCustomerInMongo().subscribe(res => {
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }

  createNewProductInMongo () {
    const loader = this.loadingCtrl.create({
      content: "Schedular is Running...",
    });
    loader.present();
    this.apiService.createNewProductInMongo().subscribe(res => {
      loader.dismiss()
      this.widgetUtil.showToast('Schedular completed successfully...')
    }, error => {
      this.widgetUtil.showToast(`Error while running schedular:  ${error}`)
      loader.dismiss()
    })
  }
}
