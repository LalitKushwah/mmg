import { Component, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';

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
  inputForm: FormGroup;
  productCapturedIdentity = [];

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private apiService: ApiServiceProvider,
    private widgetService: WidgetUtilService,
    private loadingController: LoadingController,
    private storageService: StorageServiceProvider,
    public modalCtrl: ModalController) {
  }

  createForm () {
    this.inputForm = new FormGroup({});
    let compSurvey;
    for (let index = 0; index < this.tkProductArray.length; index++) {
      compSurvey = {};
      for (let j = 0; j < this.tkProductArray[index]['Competitive Product'].length; j++) {
        compSurvey[`${j}A`] = new FormControl(null, [Validators.required]);
        compSurvey[`${j}B`] = new FormControl(null, [Validators.required]);
      }
      this.inputForm.registerControl(`${index}`, new FormGroup({
        inputA: new FormControl(null, [Validators.required]),
        inputB: new FormControl(null, [Validators.required]),
        compInputs: new FormGroup(compSurvey)
      }));
    }
  }

  async prepareCapturedProduct (index: number) {
    const prepareData = { customerInfo: '', product: '' };
    const product = this.tkProductArray[index];
    prepareData.customerInfo = JSON.parse(<string>await this.storageService.getFromStorage('customerInfo'));
    product['Brand Type'] = 'TK';
    product['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
    product['MSQ'] = this.inputForm.value[index].inputA;
    product['RRP'] = this.inputForm.value[index].inputB;
    for (let i = 0; i < product['Competitive Product'].length; i++) {
      product['Competitive Product'][i]['Brand Type'] = 'Comp';
      product['Competitive Product'][i]['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
      product['Competitive Product'][i]['MSQ'] = this.inputForm.value[index].compInputs[`${i}A`];
      product['Competitive Product'][i]['RRP'] = this.inputForm.value[index].compInputs[`${i}B`];
    }
    prepareData.product = product;
    this.inputForm.get(`${index}`).reset();
    const productIdentity = [product['Product Catagory'], product['Master Code'], product['Product Code']];
    let storedCapturedIdentities: any = await this.storageService.getFromStorage('capturedIdentities');
    if (storedCapturedIdentities) {
      storedCapturedIdentities = JSON.parse(storedCapturedIdentities);
      storedCapturedIdentities.push(productIdentity);
      await this.storageService.setToStorage('capturedIdentities', JSON.stringify(storedCapturedIdentities));
    } else {
      await this.storageService.setToStorage('capturedIdentities', JSON.stringify([productIdentity]));
    }
    this.productCapturedIdentity.push(productIdentity);
    console.log(prepareData);
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
    this.createForm();
  }

  searchItems (event: any) {
    const loader = this.loadingController.create({
      content: "Searching...",
    });
    loader.present();
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.tkProductArray = this.allProducts.filter((item) => {
        return (
            item['Product Name'] && item['Product Name'].toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
      this.createForm();
    } else {
      this.initializeItems();
    }
    loader.dismiss();
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
    this.createForm();
  }

  async saveToServer (index: number) {
    // if (this.inputForm.get(`${index}`).invalid) {
    //   this.widgetService.showToast('Kindly enter all valid inputs!');
    //   return;
    // }
    const agree =  await this.widgetService.showConfirm('Uploading To Server', 'Would you like to continue with the same as this can not be undone?')
    if (agree === 'No') { return; }
    this.prepareCapturedProduct(index);
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
}
