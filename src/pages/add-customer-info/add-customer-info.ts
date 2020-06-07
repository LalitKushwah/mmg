import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { TkProductsListPage } from '../tk-products-list/tk-products-list';
import { WidgetUtilService } from '../../utils/widget-utils';
import { PriceCapturingCategoryListPage } from '../price-capturing-category-list/price-capturing-category-list';

/**
 * Generated class for the PagesAddCustomerInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'add-customer-info',
  templateUrl: 'add-customer-info.html',
})
export class AddCustomerInfoPage implements OnInit {

  customerForm: FormGroup;

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private storageService: StorageServiceProvider,
    private widgetService: WidgetUtilService) {
    this.createForm();
  }

  ngOnInit (): void {

  }

  async ionViewWillEnter () {
    const customerInfo = await this.storageService.getFromStorage('customerInfo');
    if (!!customerInfo) {
      const agree = await this.widgetService.showConfirm('Previous Capturing Exists!', 'Would you like to continue with the previous capturing?');
      if (agree === 'Yes') {
        this.navCtrl.push(PriceCapturingCategoryListPage);
      } else {
        await this.storageService.removeFromStorage('customerInfo');
        this.resetForm(this.customerForm);
      }
    }
  }

  createForm () {
    this.customerForm = new FormGroup({
      province: new FormControl('', [ Validators.required ]),
      city: new FormControl('', [ Validators.required ]),
      area: new FormControl('', [ Validators.required ]),
      shopName: new FormControl('', [ Validators.required ]),
    });
  }

  resetForm (form: FormGroup) {
    form.reset();
    console.log('---form reset successfully--');
  }

  async onAddCustomerInfo () {
    console.log('=================');
    await this.storageService.setToStorage('customerInfo', JSON.stringify(this.customerForm.value));
    this.navCtrl.push(PriceCapturingCategoryListPage);
  }
}
