import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { CompetitiveProductsListPage } from '../competitive-products-list/competitive-products-list';
import { data } from '../../utils/data';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
  selector: 'page-tk-products-list',
  templateUrl: 'tk-products-list.html',
})
export class TkProductsListPage {
  radioResult: any;
  tkProductArray = [];
  allProducts = [];

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private apiService: ApiServiceProvider,
    private widgetService: WidgetUtilService) {
  }

  ionViewDidEnter () {
    this.setItemsToTkProductArray();
  }

  setItemsToTkProductArray () {
    this.allProducts = [];
    this.apiService.getCompProducts().subscribe((res: any) => {  
      console.log(res);
      const productsData = res.body[0];
      for (const key in productsData) {
        if (key !== '_id') {
          productsData[key].forEach(element => {
            this.allProducts.push(element);
          });
        }
        this.initializeItems();
        }
    }, err => {
      console.log('Error while fetching comp products', err)
    });
  }

  initializeItems () {
    this.tkProductArray = [];
    this.tkProductArray = this.allProducts;
    console.log(this.tkProductArray[0]);
  }

  searchItems (event: any) {
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.tkProductArray = this.allProducts.filter((item) => {
        return (
            item['Product Name'] && item['Product Name'].toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
    } else {
      this.initializeItems();
    }
  }

  onItemSelected (product: any) {
    this.navCtrl.push(CompetitiveProductsListPage, { product });
  }

  showRadioAlert () {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Category');

    alert.addInput({
      type: 'radio',
      label: 'Laundry',
      value: 'Laundry',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Confectionery',
      value: 'Confectionery'
    });

    alert.addInput({
      type: 'radio',
      label: 'Household',
      value: 'Household'
    });

    alert.addInput({
      type: 'radio',
      label: 'Personal Care',
      value: 'Personal Care'
    });

    alert.addInput({
      type: 'radio',
      label: 'Reset',
      value: 'reset'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.radioResult = data;
        if (data === 'reset') {
          this.initializeItems();
          return;
        }
        this.setFilteredItemsToTkProductArray();
      }
    });

    alert.present().then(() => {
    });
  }

  setFilteredItemsToTkProductArray () {
    this.tkProductArray = [];
    this.tkProductArray = data[this.radioResult];
  }

  async onOpenModal () {
    const prodData = await this.widgetService.showPrompt('Add TK Product', 'tk');
    const obj = { categoryName: prodData['Product Catagory'], product: prodData};
    this.apiService.addCompTkProduct(obj).subscribe(res => {
      data[prodData['Product Catagory']].unshift(prodData);
      this.allProducts.unshift(prodData);
      this.initializeItems();
    }, err => {
      console.log(err);
    })

  }
}
