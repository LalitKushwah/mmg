import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NgForm } from '@angular/forms';

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
  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider) {
    this.unitSize = this.navParams.get('unitSize');
    this.getProducts()
  }

  getProducts () {
    this.apiService.getToBeCaptureProductList(this.unitSize)
      .subscribe((res: any) => {
        this.productList = res.body;
        this.productListAvailable = true;
        console.log(res);        
      }, err => {
        console.error(err);        
      })
  }

  upload () {
    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].MSQ = this.formData.value[`${i}A`] === `` ? 0 : this.formData.value[`${i}A`];
      this.productList[i].RRP = this.formData.value[`${i}B`] === `` ? 0 : this.formData.value[`${i}B`];
    }
    console.log(this.productList);
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingProductListPage');
  }

}
