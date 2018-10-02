import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../utils/widget-utils';

@IonicPage()
@Component({
  selector: 'page-admin-edit-product',
  templateUrl: 'admin-edit-product.html',
})
export class AdminEditProductPage {

  productDetail: any = {}
  editProductForm : FormGroup;
  name: FormControl;
  price: FormControl;
  productCode: FormControl;
  priceType: FormControl;
  packType: FormControl;
  productSysCode: FormControl;
  currentCaseSize: FormControl;
  showLoader = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
   private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.productDetail = this.navParams.get('product')
  }

  ngOnInit(): void {
    this.createFormControls()
    this.createProductForm()
  }

  createFormControls() {
    this.name = new FormControl(this.productDetail.name, [
      Validators.required
    ]);
    this.price = new FormControl(this.productDetail.price, [
      Validators.required
    ]);
    this.productCode = new FormControl(this.productDetail.productCode, [
      Validators.required
    ]);
    this.productSysCode = new FormControl(this.productDetail.productSysCode, [
      Validators.required
    ]);
  }

  createProductForm() {
    this.editProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      productCode: this.productCode,
      productSysCode: this.productSysCode
    });
  }

  updateProduct() {
    let updateDetail = {}
    updateDetail['productId'] = this.productDetail['_id']
    updateDetail['name'] = this.name.value.trim()
    updateDetail['price'] = parseFloat(this.price.value.trim())
    updateDetail['productCode'] = this.productCode.value.trim()
    updateDetail['productSysCode'] = this.productSysCode.value.trim()
    updateDetail['lastUpdatedAt'] = Date.now()
    this.showLoader = true
    this.apiService.updateProduct(updateDetail).subscribe((result) => {
      this.widgetUtil.showToast(CONSTANTS.PRODUCT_UPDATED)
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

}
