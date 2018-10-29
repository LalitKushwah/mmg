import { CONSTANTS } from './../../pages/utils/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiServiceProvider {

  constructor(public http: HttpClient) {
  }

  login(credentials: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/authenticate', credentials)
  }
  
  getParentCategoryList(skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/parent?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getCategoryListForProduct(): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/child/')
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

  getOrderList(skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/' + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getProvinceOrderList(province: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/province/' + province + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getOrderListByUser(userId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/user/' + userId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  createUser(userDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/', userDetails)
  }

  addProduct(productDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/product/', productDetails)
  }

  addCategory(categoryDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/category/', categoryDetails)
  }

  getOrderDetail(orderId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/detail/' + orderId)
  }

  changeOrderStatus(orderId: string, statusObj: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/status/' + orderId, statusObj)
  }

  getCustomerList(skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/customer?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getAllCategoryList(skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getAllProductList(skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  resetUserPassowrd(userId: string): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/resetPassword/' + userId, {})
  }

  changePassword(data: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/changePassword', data)
  }

  updateProduct(updateDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/product/update', updateDetails)
  }

  searchProductInParentCategory(skip: number, limit:number, parentCategoryId: string, keyword: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/search/parentCategory/' + parentCategoryId + '?skip='+skip.toString() + "&limit="+ limit.toString() + "&keyword="+ keyword)
  }

}
