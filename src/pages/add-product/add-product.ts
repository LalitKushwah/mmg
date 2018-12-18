import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetUtilService } from '../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../utils/constants';

@IonicPage({
  name: 'AddProductPage'
})

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})

export class AddProductPage {

  addProductForm : FormGroup;
  name: FormControl;
  price: FormControl;
  productCode: FormControl;
  priceType: FormControl;
  packType: FormControl;
  productSysCode: FormControl;
  currentCaseSize: FormControl;
  showLoader = false;
  categoryList: Array<any> =  []
  categoryListAvailable = false
  selectedCategory : any = {};
  priceTypeList: Array<any> =  [ 'Standard Price']
  selectedPriceType = 'Standard Price'

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.categoryListAvailable = false
    this.getCategoryList()
  }

  getCategoryList() {
    this.apiService.getCategoryListForProduct().subscribe((result: any) => {
      this.categoryList = result.body
      this.selectedCategory = result.body[0]
      this.categoryListAvailable = true
    }, (error) => {
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
      this.categoryListAvailable = true
    })
  }

  ngOnInit(): void {
    this.createFormControls()
    this.createProductForm()
  }

  createFormControls() {
    this.name = new FormControl('', [
      Validators.required
    ]);
    this.price = new FormControl('', [
      Validators.required
    ]);
    this.productCode = new FormControl('', [
      Validators.required
    ]);
    this.productSysCode = new FormControl('', [
      Validators.required
    ]);
    this.packType = new FormControl('', [
      Validators.required
    ]);
    this.currentCaseSize = new FormControl('', [
      Validators.required
    ]);
  }

  createProductForm() {
    this.addProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      productCode: this.productCode,
      packType: this.packType,
      productSysCode: this.productSysCode,
      currentCaseSize: this.currentCaseSize
    });
  }

  addProduct() {
    let productDetail = {}
    productDetail['name'] = this.name.value.trim()
    productDetail['price'] = parseFloat(this.price.value.trim())
    productDetail['productCode'] = this.productCode.value.trim()
    productDetail['priceType'] = this.selectedPriceType.trim()
    productDetail['packType'] = this.packType.value.trim()
    productDetail['productSysCode'] = this.productSysCode.value.trim()
    productDetail['currentCaseSize'] = this.currentCaseSize.value.trim()
    productDetail['categoryId'] = this.selectedCategory['_id']
    productDetail['parentCategoryId'] = this.selectedCategory.parentCategoryId
    productDetail['lastUpdatedAt'] = Date.now()
    this.showLoader = true
    this.apiService.addProduct(productDetail).subscribe((result) => {
      this.widgetUtil.showToast(CONSTANTS.PRODUCT_CREATED)
      this.addProductForm.reset()
      this.showLoader = false;
    }, (error) => {
      console.log('error', error)
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else if(error.error.message === CONSTANTS.UNIQUE_PRODUCT_CODE) {
        this.widgetUtil.showToast(CONSTANTS.UNIQUE_PRODUCT_CODE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
  compareFn(option1: any, option2: any) {
    return option1.name === option2.name;
  }

}
