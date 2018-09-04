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
  
  getParentCategoryList(skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/parent?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getChildCategoryList(parentCategoryId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/child/' + parentCategoryId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getProductListByCategory(categoryId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list/category/' + categoryId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  submitOrder(orderDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/', orderDetails)
  }

  getOrderListByUser(userId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/user/' + userId)
  }

}
