import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

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
    
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingProductListPage');
  }

}
