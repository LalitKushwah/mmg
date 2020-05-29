import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { TkProductsListPage } from '../tk-products-list/tk-products-list';

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

  constructor (public navCtrl: NavController, public navParams: NavParams, private storageService: StorageServiceProvider) {
    this.createForm();
  }

  ngOnInit (): void {

  }

  createForm () {
    this.customerForm = new FormGroup({
      shopName: new FormControl('', [ Validators.required ]),
      customerName: new FormControl('', [ Validators.required ]),
      shopAddress: new FormControl('', [ Validators.required ])
    });
  }

  async onAddCustomerInfo () {
    await this.storageService.setToStorage('customerInfo', JSON.stringify(this.customerForm.value));
    this.navCtrl.push(TkProductsListPage);
  }
}
