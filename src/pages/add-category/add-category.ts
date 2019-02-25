import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../utils/constants';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { WidgetUtilService } from '../../utils/widget-utils';

@IonicPage({
  name: 'AddCategoryPage'
})

@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage implements OnInit {

  addCategoryForm : FormGroup;
  name: FormControl;
  showLoader = false;
  categoryList: Array<any> =  []
  categoryListAvailable = false
  selectedCategory : any = {};
  categoryTypeList: Array<any> =  ['parent', 'child']
  selectedCategoryType: string = 'parent'
  showParentList = false
  allowAddingCategory = true

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private apiService: ApiServiceProvider, private widgetUtil: WidgetUtilService) {
    this.showParentList = false
    this.categoryListAvailable = false
    this.getCategoryList()
  }

  getCategoryList() {
    this.apiService.getParentCategoryList(0 , 50).subscribe((result: any) => {
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
  }

  createProductForm() {
    this.addCategoryForm = new FormGroup({
      name: this.name
    });
  }

  addCategory() {
    let categoryDetail = {}
    categoryDetail['name'] = this.name.value.trim()
    categoryDetail['lastUpdatedAt'] = Date.now()
    if(this.selectedCategoryType === 'child') {
      categoryDetail['parentCategoryId'] = this.selectedCategory['_id']
      categoryDetail['type'] = 'child'
    }else {
      categoryDetail['parentCategoryId'] = ''
      categoryDetail['type'] = 'parent'
    }
    this.showLoader = true
    this.apiService.addCategory(categoryDetail).subscribe((result) => {
      this.widgetUtil.showToast(CONSTANTS.CATEGORY_CREATED)
      this.addCategoryForm.reset()
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

  onCategoryTypeSelect() {
    if (this.selectedCategoryType != 'parent') {
      if(this.categoryList.length > 0) {
        this.showParentList = true
        this.allowAddingCategory = true
      } else {
        this.widgetUtil.showToast(CONSTANTS.PARENT_CATEGORY_NOT_FOUND)
        this.selectedCategoryType = 'parent'
        this.showParentList = false
        this.allowAddingCategory = false
      }
    } else {
      this.allowAddingCategory = true
      this.showParentList = false
    }
  }

  compareFn(option1: any, option2: any) {
    return option1.name === option2.name;
  }
}
