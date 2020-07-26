import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-tk-products-list',
  templateUrl: 'tk-products-list.html',
})
export class TkProductsListPage  {
  radioResult = 'reset';
  tkProductArray = [];
  allProducts = [];
  fetchedCompProducts: any;
  itemIsHighlighted = false;
  productCapturedIdentity = [];
  productListAvailable = false;
  isExpanded = false;
  toggledElementId: any;
  randomId: any;
  tkProducts = [];
  filteredProductList = []
  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiServiceProvider,
    public modalCtrl: ModalController,
    public datePipe: DatePipe) {
    this.getTKProducts();
  }

  getTKProducts () {
    this.apiService.getTKProducts().subscribe((res: any) => {
      this.tkProducts = res.body;
      this.productListAvailable = true;
      this.filteredProductList = this.tkProducts;      
    }, err => {
      console.log(err);
    })
  }

  searchProducts (searchQuery) {
    this.filteredProductList = this.tkProducts.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  )}

  openAddcompMpdal (product) {
    this.navCtrl.push(AddTkProductModalPage, 
      {
        context: 'comp', 
        masterCode: product['masterCode'],
        title: product.productName,
        product: product
      }
    );
  }
}
