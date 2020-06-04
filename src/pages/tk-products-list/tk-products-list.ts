import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';
import { DatePipe } from '@angular/common';
import { WidgetUtilService } from '../../utils/widget-utils';

import * as uuid from 'uuid';

@IonicPage()
@Component({
  selector: 'page-tk-products-list',
  templateUrl: 'tk-products-list.html',
})
export class TkProductsListPage implements OnDestroy {
  radioResult = 'reset';
  tkProductArray = [];
  allProducts = [];
  fetchedCompProducts: any;
  itemIsHighlighted = false;
  productCapturedIdentity = [];

  isExpanded = false;
  toggledElementId: any;
  randomId: any;

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private apiService: ApiServiceProvider,
    private loadingController: LoadingController,
    private storageService: StorageServiceProvider,
    public modalCtrl: ModalController,
    private widgetService: WidgetUtilService,
    public datePipe: DatePipe) {
    
  }

  async prepareCapturedProduct (masterCode: string, productCode: string, prodCategory: string, form: any) {
    const prepareData = { customerInfo: '', product: '' };
    const index = this.tkProductArray.findIndex(prod => {
      return prod['Product Catagory'] === prodCategory && prod['Master Code'] === masterCode && prod['Product Code'] === productCode;
    });
    if (index === -1) {
      return;
    }
    const product = this.tkProductArray[index];
    prepareData.customerInfo = JSON.parse(<string>await this.storageService.getFromStorage('customerInfo'));
    product['Brand Type'] = 'TK';
    product['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
    product['MSQ'] = form.A;
    product['RRP'] = form.B;
    for (let i = 0; i < product['Competitive Product'].length; i++) {
      product['Competitive Product'][i]['Brand Type'] = 'Comp';
      product['Competitive Product'][i]['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
      product['Competitive Product'][i]['MSQ'] = form[`${i}A`];
      product['Competitive Product'][i]['RRP'] = form[`${i}B`];
    }
    prepareData.product = product;
    return prepareData;
  }

  markRowAsCaptured (prodCat: string, masterCode: string, prodCode: string): boolean {
    let temp = false;
    this.productCapturedIdentity.forEach((identity: any) => {
      if (identity[0] === prodCat && identity[1] === masterCode && identity[2] === prodCode) {
        temp = true;
      }
    });
    return temp
  }

  async ionViewDidEnter () {
    let storedCapturedIdentities: any = await this.storageService.getFromStorage('capturedIdentities');
    if (storedCapturedIdentities) {
      storedCapturedIdentities = JSON.parse(storedCapturedIdentities);
      this.productCapturedIdentity = [];
      this.productCapturedIdentity = storedCapturedIdentities;
    }
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
            element.uniqueId = uuid.v4();
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

  showRadioAlert () {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Category');

    alert.addInput({
      type: 'radio',
      label: 'All',
      value: 'reset',
      checked: this.radioResult === 'reset' ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Laundry',
      value: 'Laundry',
      checked: this.radioResult === 'Laundry' ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Confectionery',
      value: 'Confectionery',
      checked: this.radioResult === 'Confectionery' ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Household',
      value: 'Household',
      checked: this.radioResult === 'Household' ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Personal Care',
      value: 'Personal Care',
      checked: this.radioResult === 'Personal Care' ? true : false
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

  async saveToServer (masterCode: string, productCode: string, prodCategory: string, form: NgForm) {
    const loader = this.loadingController.create({
      content: "Uploading Data...",
    });
    loader.present();
    const data = await this.prepareCapturedProduct(masterCode, productCode, prodCategory, form.value);
    data['date'] = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
    this.apiService.captureProduct(data).subscribe(async res => {
      this.widgetService.showToast('Uploaded Successfully...')
      /* Marking for captured product */
      const productIdentity = [data.product['Product Catagory'], data.product['Master Code'], data.product['Product Code']];
      let storedCapturedIdentities: any = await this.storageService.getFromStorage('capturedIdentities');
      if (storedCapturedIdentities) {
        storedCapturedIdentities = JSON.parse(storedCapturedIdentities);
        storedCapturedIdentities.push(productIdentity);
        await this.storageService.setToStorage('capturedIdentities', JSON.stringify(storedCapturedIdentities));
      } else {
        await this.storageService.setToStorage('capturedIdentities', JSON.stringify([productIdentity]));
      }
      this.productCapturedIdentity.push(productIdentity);
      loader.dismiss();
      /* Marking end */
    }, err => {
      loader.dismiss();
      this.widgetService.showToast('Error While Uploading...' + err);
    });
  }

  openAddTkProductModal () {
    const addTkProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add TK Product', context: 'tk'});
    addTkProductModal.present();
    addTkProductModal.onDidDismiss((data, role) => {
      this.setItemsToTkProductArray();
    });
  }

  openAddCompetitiveProductModal (masterCode: any) {
    const addCompetitiveProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add Competitive Product', context: 'comp', masterCode: masterCode });
    addCompetitiveProductModal.present();
    addCompetitiveProductModal.onDidDismiss((data, role) => {
      this.setItemsToTkProductArray();
    });
  }

  async ngOnDestroy () {
    await this.storageService.removeFromStorage('capturedIdentities');
  }

  toggleAcoordion (a) {
    this.isExpanded = !this.isExpanded;
    this.toggledElementId = a;
    console.log(this.toggledElementId)
  }
}
