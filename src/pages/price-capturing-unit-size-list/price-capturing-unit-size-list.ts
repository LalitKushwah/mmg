import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { PriceCapturingProductListPage } from '../price-capturing-product-list/price-capturing-product-list';

/**
 * Generated class for the PriceCapturingUnitSizeListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-capturing-unit-size-list',
  templateUrl: 'price-capturing-unit-size-list.html',
})
export class PriceCapturingUnitSizeListPage {

  parentCategoryName = '';
  childCategoryName = '';
  unitSizeListAvailable = false;
  unitSizeList = [];
  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiService: ApiServiceProvider) {
    this.parentCategoryName = this.navParams.get('parentCategoryName');
    this.childCategoryName = this.navParams.get('childCategoryName');
    this.getUnitSizeList();
  }

  getUnitSizeList () {
    this.apiService.getCaturingUnitSizeList(this.parentCategoryName, this.childCategoryName)
    .subscribe((res: any) => {
      this.unitSizeListAvailable = true;  
      this.unitSizeList = res.body;
    }, err => {
      console.error(err)
    })
  }

  getProducts (unitSize) {
    this.navCtrl.push(PriceCapturingProductListPage, {unitSize: unitSize})        
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad PriceCapturingUnitSizeListPage');
  }

}
