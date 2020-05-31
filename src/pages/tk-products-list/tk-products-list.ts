import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { CompetitiveProductsListPage } from '../competitive-products-list/competitive-products-list';
import { data } from '../../utils/data';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';

@IonicPage()
@Component({
  selector: 'page-tk-products-list',
  templateUrl: 'tk-products-list.html',
})
export class TkProductsListPage {
  radioResult: any;
  tkProductArray = [];
  allProducts = [];
  fetchedCompProducts;

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private apiService: ApiServiceProvider,
    private widgetService: WidgetUtilService,
    private loadingController: LoadingController,
    private storageService: StorageServiceProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidEnter () {
    this.setItemsToTkProductArray();
  }

  setItemsToTkProductArray () {
    this.allProducts = [];
    const loader = this.loadingController.create({
      content: "Fetching Data...",
    });
    loader.present();
    this.apiService.getCompProducts().subscribe((res: any) => {  
      console.log(res);
      this.fetchedCompProducts = res.body[0];
      for (const key in this.fetchedCompProducts) {
        if (key !== '_id') {
          this.fetchedCompProducts[key].forEach(element => {
            this.allProducts.push(element);
          });
        }
      }
      loader.dismiss();
      this.initializeItems();
    }, err => {
      loader.dismiss();
      console.log('Error while fetching comp products', err)
    });
  }

  initializeItems () {
    this.tkProductArray = [];
    this.tkProductArray = this.allProducts;
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
    this.tkProductArray = this.fetchedCompProducts[this.radioResult];
  }

  async saveToServer () {
    // get the captured data from storage using key 'capturedCompProducts'
    // get the customerInfo from storage using key 'customerInfo'
    // manipulate data according to need and then upload to server
    // then clear the storage
    const capturedData: any = await this.storageService.getFromStorage('capturedCompProducts');
    if (!capturedData) {
      this.widgetService.showAlert('Alert', 'You did not captured any product, kindly capture data for some products first!');
      return;
    }
    console.log('Captured Product', JSON.parse(capturedData));
    const agree =  await this.widgetService.showConfirm('Uploading To Server', 'Would you like to continue with the same as this can not be undone?')
    if (agree === 'No') { return; }
    await this.storageService.removeFromStorage('customerInfo');
    await this.storageService.removeFromStorage('capturedCompProducts');
  }

  async onOpenModal () {
    const prodData = await this.widgetService.showPrompt('Add TK Product', 'tk');
    const obj = { categoryName: prodData['Product Catagory'], product: prodData};
    this.apiService.addCompTkProduct(obj).subscribe(res => {
      this.fetchedCompProducts[prodData['Product Catagory']].unshift(prodData);
      this.allProducts.unshift(prodData);
      this.initializeItems();
    }, err => {
      console.log(err);
    })

  }

  openAddTkProductModal () {
    const addTkProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add TK Product' });
    addTkProductModal.present();
  }

}
