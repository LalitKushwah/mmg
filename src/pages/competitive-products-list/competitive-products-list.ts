import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { WidgetUtilService } from '../../utils/widget-utils';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';

/**
 * Generated class for the CompetitiveProductsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-competitive-products-list',
  templateUrl: 'competitive-products-list.html',
})
export class CompetitiveProductsListPage implements OnInit {
  tkProduct: any;
  inputForm: FormGroup;
  compSurvey = {};

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private widgetService: WidgetUtilService,
    private storageService: StorageServiceProvider,
    public modalCtrl: ModalController) {
  }

  ngOnInit (): void {
    this.tkProduct = this.navParams.data.product;
    this.createForm();
  }

  createForm () {
    this.compSurvey = {};
    for (let index = 0; index < this.tkProduct['Competitive Product'].length; index++) {
      this.compSurvey[`${index}A`] = new FormControl(null, [Validators.required]);
      this.compSurvey[`${index}B`] = new FormControl(null, [Validators.required]);
    }
    this.inputForm = new FormGroup({
      tkProduct: new FormGroup({
        inputA: new FormControl(null, [Validators.required]),
        inputB: new FormControl(null, [Validators.required])
      }),
      compProduct: new FormGroup(this.compSurvey)
    });
  }

  async onSaveCompProducts () {
    if (this.inputForm.invalid) {
      this.widgetService.showAlert('Validation Failed', 'Kindly enter all valid values in below fields');
      return;
    }

    const isAgree = await this.widgetService.showConfirm('Alert', 'Would you like to continue as this can not be altered in future?');
    if (isAgree === 'No') {
      return;
    }
    this.saveCapturedDataToStorage();
  }

  async saveCapturedDataToStorage () {
    this.tkProduct['Brand Type'] = 'TK';
    this.tkProduct['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
    this.tkProduct['inputA'] = this.inputForm.value.tkProduct.inputA // change inputA key of this.tkProduct as required in excel sheet
    this.tkProduct['RRP'] = this.inputForm.value.tkProduct.inputB
    for (let index = 0; index < this.tkProduct['Competitive Product'].length; index++) {
      this.tkProduct['Competitive Product'][index]['Brand Type'] = 'Comp';
      this.tkProduct['Competitive Product'][index]['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
      this.tkProduct['Competitive Product'][index]['inputA'] = this.inputForm.value.compProduct[`${index}A`];
      this.tkProduct['Competitive Product'][index]['RRP'] = this.inputForm.value.compProduct[`${index}B`];
    }
    let savedCapturedProducts: any =  await this.storageService.getFromStorage('capturedCompProducts');
    if (savedCapturedProducts) {
      savedCapturedProducts = JSON.parse(savedCapturedProducts);
      if (savedCapturedProducts.hasOwnProperty(this.tkProduct['Product Catagory'])) {
        savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
      } else {
        savedCapturedProducts[this.tkProduct['Product Catagory']] = [];
        savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
      }
    } else {
      savedCapturedProducts = {};
      savedCapturedProducts[this.tkProduct['Product Catagory']] = [];
      savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
    }
    await this.storageService.setToStorage('capturedCompProducts', JSON.stringify(savedCapturedProducts));
    this.navCtrl.pop();
  }

  async onOpenModal () {
    const compProdData = await this.widgetService.showPrompt('Add Competitive Product');
    this.tkProduct['Competitive Product'].push(compProdData)
    const newForm = this.inputForm.get('compProduct') as FormGroup;
    newForm.addControl(`${this.tkProduct['Competitive Product'].length - 1}A`, new FormControl(null, [Validators.required]));
    newForm.addControl(`${this.tkProduct['Competitive Product'].length - 1}B`, new FormControl(null, [Validators.required]));
  }

  openAddTkProductModal () {
    const addTkProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add Competitive Product' });
    addTkProductModal.present();
  }

}
