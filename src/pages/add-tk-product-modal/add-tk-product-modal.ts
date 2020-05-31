import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetUtilService } from '../../utils/widget-utils';
import { CommonService } from '../../providers/common.service';

@IonicPage()
@Component({
  selector: 'page-add-tk-product-modal',
  templateUrl: 'add-tk-product-modal.html',
})
export class AddTkProductModalPage {
  showLoader = false;
  title: string;
  context;
  masterCode;
  productForm: FormGroup;

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private loadCtrl: LoadingController,
    private widgetCtrl: WidgetUtilService,
    private apiService: ApiServiceProvider) {
    
    this.title = navParams.get('title');
    this.context = navParams.get('context');
    this.masterCode = navParams.get('masterCode');
    this.createForm();
  }

  createForm () {
    this.productForm = new FormGroup({
      brand: new FormControl('', [ Validators.required ]),
      masterName: new FormControl('', [ Validators.required ]),
      caseSize: new FormControl('', [ Validators.required ]),
      masterCode: new FormControl('', [ Validators.required ]),
      prodCat: new FormControl('', [ Validators.required ]),
      prodCode: new FormControl('', [ Validators.required ]),
      prodName: new FormControl('', [ Validators.required ]),
      subCat: new FormControl('', [ Validators.required ]),
      unitSize: new FormControl('', [ Validators.required ]),
    });
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddTkProductModalPage');
  }
  dismissModal (){
    this.viewCtrl.dismiss();
  }

  submit () {
    const loader = this.loadCtrl.create({
      content: "Please Wait...",
    });
    const newProd = {
      "Master Code": this.productForm.value.masterCode,
      "Master Name": this.productForm.value.masterName,
      "Product Catagory": this.productForm.value.prodCat,
      "Sub Catagory": this.productForm.value.subCat,
      "Unit Size": this.productForm.value.unitSize,
      "Case Size": this.productForm.value.caseSize,
      "BRAND": this.productForm.value.brand,
      "Product Code": this.productForm.value.prodCode,
      "Product Name": this.productForm.value.prodName
  }
  console.log(newProd);
  loader.present();
  // add competitive prod
  if (this.context === 'comp') {
    newProd['Is TKProduct'] = "N";
    this.apiService
    .addCompProduct({categoryName: newProd['Product Catagory'], masterCode: this.masterCode, product: newProd})
    .subscribe(res => {
      // add prod to list
      this.navCtrl.pop();
      loader.dismiss();
      this.widgetCtrl.showToast('Product Added Successfully...')
    }, err => {
        console.log(err);
        loader.dismiss();
    })
  } else {
    // add tk product
    newProd['Is TKProduct'] = "Y";
    newProd['Competitive Product'] = [];

    this.apiService
    .addCompTkProduct({categoryName: newProd['Product Catagory'], product: newProd})
    .subscribe(res => {
      // add prod to list
      loader.dismiss();
      this.navCtrl.pop();
      this.widgetCtrl.showToast('Competitive Prodct Added...')
    }, err => {
        console.log(err);        
        loader.dismiss();
    })
  }
  
  }

}
