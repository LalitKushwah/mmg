import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { WidgetUtilService } from '../../utils/widget-utils';

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
    private widgetService: WidgetUtilService) {
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

  onSaveCompProducts () {
    if (this.inputForm.invalid) {
      this.widgetService.showAlert('Validation Failed', 'Kindly enter all valid values in below fields');
      return;
    }
    console.log(this.inputForm.value);
    this.navCtrl.pop();
  }

  async onOpenModal () {
    const compProdData = await this.widgetService.showPrompt('Add Competitive Product');
    this.tkProduct['Competitive Product'].push(compProdData)
    const newForm = this.inputForm.get('compProduct') as FormGroup;
    newForm.addControl(`${this.tkProduct['Competitive Product'].length - 1}A`, new FormControl(null, [Validators.required]));
    newForm.addControl(`${this.tkProduct['Competitive Product'].length - 1}B`, new FormControl(null, [Validators.required]));
  }

}
