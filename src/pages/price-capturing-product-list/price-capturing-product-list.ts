import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NgForm } from '@angular/forms';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { DatePipe } from '@angular/common';

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
  parentCatName = '';
  childCatName = '';
  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider,
    private storageService: StorageServiceProvider,
    private datePipe: DatePipe) {
    this.unitSize = this.navParams.get('unitSize');
    this.parentCatName = this.navParams.get('parentCategoryName');
    this.childCatName = this.navParams.get('childCategoryName');
    this.getProducts()
  }

  getProducts () {
    console.log('================= 41 =================');    
    this.apiService.getToBeCaptureProductList(this.unitSize)
      .subscribe((res: any) => {
        this.productList = res.body;
        this.productListAvailable = true;
        console.log(res);        
      }, err => {
        console.error(err);        
      })
  }

  async upload () {
    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].MSQ = this.formData.value[`${i}A`] === `` ? 0 : this.formData.value[`${i}A`];
      this.productList[i].RRP = this.formData.value[`${i}B`] === `` ? 0 : this.formData.value[`${i}B`];
    }
    const obj = {
      date: this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
      customerInfo: JSON.parse(<string> await this.storageService.getFromStorage('customerInfo')),
      capturedProducts: this.productList,
      parentCategoryName: this.parentCatName,
      childCategoryName: this.childCatName,
      unitSize: this.unitSize
    }
    this.apiService.captureProduct(obj).subscribe(res => {
      console.log(res);      
    }, err => {
      console.log(err);
      
    })
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingProductListPage');
  }

}
