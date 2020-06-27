import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NgForm } from '@angular/forms';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { DatePipe } from '@angular/common';
import { WidgetUtilService } from '../../utils/widget-utils';

/**
 * Generated class for the PriceCapturingProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-capturing-product-list',
  templateUrl: 'price-capturing-product-list.html',
})
export class PriceCapturingProductListPage {
  @ViewChild('form') formData: NgForm;
  parentCategoryName = '';
  unitSize = '';
  productListAvailable = false;
  productList = [];
  // allProductList = [];
  parentCatName = '';
  childCatName = '';
  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider,
    private storageService: StorageServiceProvider,
    private datePipe: DatePipe,
    private strorageService: StorageServiceProvider,
    private loadingController: LoadingController,
    private widgetService: WidgetUtilService) {
    this.unitSize = this.navParams.get('unitSize');
    this.parentCatName = this.navParams.get('parentCategoryName');
    this.childCatName = this.navParams.get('childCategoryName');
    this.getProducts()
  }

  getProducts () {
    this.apiService.getToBeCaptureProductList(this.unitSize, this.parentCatName, this.childCatName)
      .subscribe((res: any) => {
        this.productList = res.body;
        // this.allProductList = res.body;
        this.productListAvailable = true;
        console.log(res);        
      }, err => {
        console.error(err);        
      })
  }

  async upload () {
    const loader = this.loadingController.create({
      content: "Uploading Data...",
    });
    loader.present();
    let valA: any;
    let valB: any;
    for (let i = 0; i < this.productList.length; i++) {
      valA = this.formData.value[`${i}A`];
      valB = this.formData.value[`${i}B`];
      this.productList[i].MSQ = valA === `` || typeof valA === 'undefined' ? 0 : valA;
      this.productList[i].RRP = valB === `` || typeof valB === 'undefined' ? 0 : valB;
    }
    const obj = {
      date: this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
      customerInfo: JSON.parse(<string> await this.storageService.getFromStorage('customerInfo')),
      reportType: JSON.parse(<string> await this.storageService.getFromStorage('customerInfo')).reportType,
      channel: JSON.parse(<string> await this.storageService.getFromStorage('customerInfo')).channel,
      capturedBy: await this.strorageService.getFromStorage('profile'),
      capturedProducts: this.productList,
      parentCategoryName: this.parentCatName,
      childCategoryName: this.childCatName,
      unitSize: this.unitSize
    }
    this.apiService.captureProduct(obj).subscribe(async res => {
      loader.dismiss();
        this.navCtrl.remove(this.navCtrl.length() - 3, 3);
    }, err => {
      loader.dismiss();
      this.widgetService.showToast('Error while uploading capturing....')
      console.log(err);
    });
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingProductListPage');
  }
}
