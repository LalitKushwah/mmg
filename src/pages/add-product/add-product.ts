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
  packQty: FormControl;
  netWeight: FormControl;
  currentCaseSize: FormControl;
  unit: FormControl
  showLoader = false;
  categoryList: Array<any> =  []
  categoryListAvailable = false
  selectedCategory : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.categoryListAvailable = false
    this.getCategoryList()
  }

  getCategoryList() {
    this.apiService.getCategoryListForProduct().subscribe((result: any) => {
      console.log(result)
      this.categoryList = result.body
      this.selectedCategory = result.body[0]
      console.log('this.selectedCategory', this.selectedCategory)
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
    this.priceType = new FormControl('', [
      Validators.required
    ]);
    this.packQty = new FormControl('', [
      Validators.required
    ]);
    this.netWeight = new FormControl('', [
      Validators.required
    ]);
    this.currentCaseSize = new FormControl('', [
      Validators.required
    ]);
    this.unit = new FormControl('', [
      Validators.required
    ]);
  }

  createProductForm() {
    this.addProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      productCode: this.productCode,
      priceType: this.priceType,
      packQty: this.packQty,
      netWeight: this.netWeight,
      currentCaseSize: this.currentCaseSize,
      unit: this.unit
    });
  }

  addProduct() {
    let productDetail = {}
    productDetail['name'] = this.name.value.trim()
    productDetail['price'] = parseInt(this.price.value.trim())
    productDetail['productCode'] = this.productCode.value.trim()
    productDetail['priceType'] = this.priceType.value.trim()
    productDetail['packQty'] = this.packQty.value.trim()
    productDetail['netWeight'] = parseInt(this.netWeight.value.trim())
    productDetail['currentCaseSize'] = this.currentCaseSize.value.trim()
    productDetail['unit'] = this.unit.value.trim()
    productDetail['categoryId'] = this.selectedCategory['_id']
    productDetail['lastUpdatedAt'] = Date.now()
    this.showLoader = true
    this.apiService.addProduct(productDetail).subscribe((result) => {
      this.widgetUtil.showToast(CONSTANTS.PRODUCT_CREATED)
      this.addProductForm.reset()
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
      if (error.statusText === 'Unknown Error'){
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }
  compareFn(option1: any, option2: any) {
    return option1.name === option2.name;
  }

}
