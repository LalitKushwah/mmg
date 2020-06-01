import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { CompetitiveProductsListPage } from '../competitive-products-list/competitive-products-list';
import { data } from '../../utils/data';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { AddTkProductModalPage } from '../add-tk-product-modal/add-tk-product-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-tk-products-list',
  templateUrl: 'tk-products-list.html',
})
export class TkProductsListPage {
  radioResult = 'reset';
  tkProductArray = [];
  allProducts = [];
  fetchedCompProducts;
  itemIsHighlighted = false;
  itemIsExpanded = false;

  // added from competitive-products-list.ts
  compTkProduct: any;
  inputForm: FormGroup;
  compSurvey = {};

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private apiService: ApiServiceProvider,
    private widgetService: WidgetUtilService,
    private loadingController: LoadingController,
    private storageService: StorageServiceProvider,
    public modalCtrl: ModalController) {
  }

  // Added from competitive-products-list.ts Begins
  ngOnInit (): void {
    // this.tkProduct = this.navParams.data.product;
    // this.createForm();
  }

  // createForm () {
  //   this.compSurvey = {};
  //   for (let index = 0; index < this.tkProduct['Competitive Product'].length; index++) {
  //     this.compSurvey[`${index}A`] = new FormControl(null, [Validators.required]);
  //     this.compSurvey[`${index}B`] = new FormControl(null, [Validators.required]);
  //   }
  //   this.inputForm = new FormGroup({
  //     tkProduct: new FormGroup({
  //       inputA: new FormControl(null, [Validators.required]),
  //       inputB: new FormControl(null, [Validators.required])
  //     }),
  //     compProduct: new FormGroup(this.compSurvey)
  //   });
  // }

  // async onSaveCompProducts () {
  //   if (this.inputForm.invalid) {
  //     this.widgetService.showAlert('Validation Failed', 'Kindly enter all valid values in below fields');
  //     return;
  //   }

  //   const isAgree = await this.widgetService.showConfirm('Alert', 'Would you like to continue as this can not be altered in future?');
  //   if (isAgree === 'No') {
  //     return;
  //   }
  //   this.saveCapturedDataToStorage();
  // }

  // async saveCapturedDataToStorage () {
  //   this.tkProduct['Brand Type'] = 'TK';
  //   this.tkProduct['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
  //   this.tkProduct['inputA'] = this.inputForm.value.tkProduct.inputA // change inputA key of this.tkProduct as required in excel sheet
  //   this.tkProduct['RRP'] = this.inputForm.value.tkProduct.inputB
  //   for (let index = 0; index < this.tkProduct['Competitive Product'].length; index++) {
  //     this.tkProduct['Competitive Product'][index]['Brand Type'] = 'Comp';
  //     this.tkProduct['Competitive Product'][index]['Price Capturing Date'] = new Date().toLocaleString().split(',')[0];
  //     this.tkProduct['Competitive Product'][index]['inputA'] = this.inputForm.value.compProduct[`${index}A`];
  //     this.tkProduct['Competitive Product'][index]['RRP'] = this.inputForm.value.compProduct[`${index}B`];
  //   }
  //   let savedCapturedProducts: any =  await this.storageService.getFromStorage('capturedCompProducts');
  //   if (savedCapturedProducts) {
  //     savedCapturedProducts = JSON.parse(savedCapturedProducts);
  //     if (savedCapturedProducts.hasOwnProperty(this.tkProduct['Product Catagory'])) {
  //       savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
  //     } else {
  //       savedCapturedProducts[this.tkProduct['Product Catagory']] = [];
  //       savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
  //     }
  //   } else {
  //     savedCapturedProducts = {};
  //     savedCapturedProducts[this.tkProduct['Product Catagory']] = [];
  //     savedCapturedProducts[this.tkProduct['Product Catagory']].push(this.tkProduct);
  //   }
  //   await this.storageService.setToStorage('capturedCompProducts', JSON.stringify(savedCapturedProducts));
  //   this.navCtrl.pop();
  // }

  // Added from Competitive-products-list.ts Ends


  ionViewDidEnter () {
    this.setItemsToTkProductArray();
    console.log(this.itemIsExpanded);
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
          console.log('======== 47 =====', key);
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
    console.log("=====//");
    console.log(this.tkProductArray);
    // this.compTkProduct = this.allProducts['Competitive Product'];
    // console.log("=====//");
    // console.log(this.compTkProduct);
    // console.log("=====//");
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
    const addTkProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add TK Product', context: 'tk'});
    addTkProductModal.present();
  }

  openAddCompetitiveProductModal (masterCode) {
    // const addCompetitiveProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add Competitive Product', context: 'comp', masterCode: this.tkProduct['Master Code'] });
    const addCompetitiveProductModal = this.modalCtrl.create(AddTkProductModalPage, { title: 'Add Competitive Product', context: 'comp', masterCode: masterCode });
    console.log("---master code of selected item --", masterCode);
    addCompetitiveProductModal.present();
  }

  onItemToggle () {
    this.itemIsExpanded = !this.itemIsExpanded;
    console.log(this.itemIsExpanded);
  }

}
