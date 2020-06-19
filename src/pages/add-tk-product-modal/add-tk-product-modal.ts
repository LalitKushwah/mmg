import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetUtilService } from '../../utils/widget-utils';

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
  childCategoryList = [];
  product;
  categoryIdMappingwithName = {
    'Confectionery':'5c169aa7f39393278ddce40b',
    'Laundry':'5c169a9df39393278ddce40a',
    'Household':'5c169a8ef39393278ddce409',
    'Personal Care':'5c169a7ef39393278ddce408'
  }

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
    this.product = navParams.get('product');
    this.createForm();
  }

  createForm () {
    const masterCodeDefault = this.context === 'comp' ? this.masterCode : '';
    let defaultProductCategory,defaultMastername, defaultPorductSubCat = '';

    this.productForm = new FormGroup({
      brand: new FormControl('', [ Validators.required ]),
      masterName: new FormControl(defaultMastername, [ Validators.required ]),
      caseSize: new FormControl('', [ Validators.required ]),
      masterCode: new FormControl(masterCodeDefault, [ Validators.required ]),
      prodCat: new FormControl(defaultProductCategory, [ Validators.required ]),
      prodCode: new FormControl('', [ Validators.required ]),
      prodName: new FormControl('', [ Validators.required ]),
      subCat: new FormControl(defaultPorductSubCat, [ Validators.required ]),
      unitSize: new FormControl('', [ Validators.required ]),
    });
  }

  fetchChildCat (catName) {
    console.log("Called");
    
    const categoryId = this.categoryIdMappingwithName[catName];
    if (categoryId) {
      const loader = this.loadCtrl.create({content: 'Fetching child category...'})
      loader.present();
      this.apiService.getChildCategoryList(categoryId,0,20).subscribe((res) => {
        this.childCategoryList = res.body;
        console.log(this.childCategoryList);        
        loader.dismiss();
      }, err => {
        console.error(err);
        loader.dismiss();
      });
    }
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddTkProductModalPage');
  }

  dismissModal (){
    this.viewCtrl.dismiss();
  }

  submit () {

    if (this.productForm.invalid) {
      this.widgetCtrl.showAlert('Invalid Inputs', 'Kindly enter all fields with valid data');
      return;
    }

    const loader = this.loadCtrl.create({
      content: "Please Wait...",
    });
    const newProd = {
      "masterCode": this.productForm.value.masterCode,
      "masterName": this.productForm.value.masterName,
      "productCategory": this.productForm.value.prodCat,
      "subCategory": this.productForm.value.subCat,
      "unitSize": this.productForm.value.unitSize,
      "caseSize": this.productForm.value.caseSize,
      "brand": this.productForm.value.brand,
      "productCode": this.productForm.value.prodCode,
      "productName": this.productForm.value.prodName
    }
    loader.present();
    // add competitive prod
    if (this.context === 'comp') {
      newProd['isTkProduct'] = "N";
      this.apiService
      .addCompProduct({categoryName: newProd['productCatagory'], masterCode: this.masterCode, product: newProd})
      .subscribe(res => {
        loader.dismiss();
        this.widgetCtrl.showToast('Product Added Successfully...')
        this.productForm.reset();
      }, err => {
          console.log(err);
          loader.dismiss();
          this.widgetCtrl.showToast('Product already exists...') 
      })
    } else {
      newProd['isTkProduct'] = "Y";
      newProd['competitiveProduct'] = [];

      this.apiService
      .addCompTkProduct({categoryName: newProd['productCatagory'], product: newProd})
      .subscribe(res => {
        loader.dismiss();
        this.widgetCtrl.showToast('TK Product Added Successfully...')
        this.productForm.reset();
      }, err => {
          this.widgetCtrl.showToast('Product already exists...')       
          loader.dismiss();
      })
    }
  }
}
