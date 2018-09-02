import { CONSTANTS } from './../../pages/utils/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ApiServiceProvider Provider');
  }

  login(credentials: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/authenticate', credentials)
  }
  
  getParentCategoryList(): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/parent')
  }

  getChildCategoryList(parentCategoryId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/child/' + parentCategoryId)
  }

  getProductListByCategory(categoryId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list/category/' + categoryId)
  }

  submitOrder(orderDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/', orderDetails)
  }
}
