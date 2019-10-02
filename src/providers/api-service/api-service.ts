import { CONSTANTS } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiServiceProvider {

  constructor (public http: HttpClient) {
  }

  login (credentials: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/authenticate', credentials)
  }

  getParentCategoryList (skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/parent?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getCategoryListForProduct (): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/child/')
  }

  getChildCategoryList (parentCategoryId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list/child/' + parentCategoryId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getProductListByCategory (categoryId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list/category/' + categoryId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getAllProductsByCategory (categoryId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list/category/all/' + categoryId)
  }

  submitOrder (orderDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/', orderDetails)
  }

  createOrderToErp (orderId) {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/createOrderToERP', {
      '_id': orderId
    })
  }

  createEditedOrderToErp (order) {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/createEditedOrderToERP', order)
  }

  getData (obj) {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/products', obj)
  }

  getOrderList (skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/' + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getProvinceOrderList (province: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/province/' + province + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getOrderListByUser (userId: string, skip:number, limit:number, isSalesman, salesmanCode): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/user/' + userId + '?skip='+skip.toString() + "&limit="+ limit.toString() + "&isSalesman=" + isSalesman + "&salesmanCode=" + salesmanCode)
  }

  getOrdersForSalesmanByAssociatedCustomers (userId: string, skip:number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/list/associated/user/' + userId + '?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  createUser (userDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/', userDetails)
  }

  createPayment (data) {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/create/payment', data)
  }

  getPaymentHistory (externalId) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/payment/history/' + '?externalId='+externalId)
  }

  getPaymentHistoryForSM (externalId) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/payments/SM/' + '?externalId='+externalId)
  }

  addProduct (productDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/product/', productDetails)
  }

  addCategory (categoryDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/category/', categoryDetails)
  }

  getOrderDetail (orderId: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/order/detail/' + orderId)
  }

  changeOrderStatus (orderId: string, statusObj: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/status/' + orderId, statusObj)
  }

  getCustomerList (skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/customer?skip='+skip.toString() + "&limit="+ limit.toString())
  } 

  getAssociatedCustomersListBySalesman (externalId) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/associated/customer?externalId='+externalId.toString())
  }

  getAssociatedSalesmanListBySalesman (externalId) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/associated/salesman?externalId='+externalId.toString())
  }

  getDashboardData (customerCode) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/get/dashboard?externalId='+customerCode.toString())
  }

  getAllCustomers (): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/all/customer')
  }
  getAllSalesman (): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/all/salesman')
  }

  getCustomersByProvince (province) {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/list/by/province/customer?province='+province.toString())
  }

  getAllCategoryList (skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/category/list?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  getAllProductList (skip: number, limit:number): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list?skip='+skip.toString() + "&limit="+ limit.toString())
  }

  resetUserPassowrd (userId: string): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/resetPassword/' + userId, {})
  }

  changePassword (data: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/changePassword', data)
  }

  getUserDetails (userLoginId) : any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/getUserDetails/?userLoginId=' + userLoginId)
  }

  updateProduct (updateDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/product/update', updateDetails)
  }

  searchProductInParentCategory (skip: number, limit:number, parentCategoryId: string, keyword: string): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/search/parentCategory/' + parentCategoryId + '?skip='+skip.toString() + "&limit="+ limit.toString() + "&keyword="+ keyword)
  }

  getGiftProducts (): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/product/list/gift/products',{})
  }

  submitGiftOrder (orderDetails: Object): any {
    return this.http.post(CONSTANTS.BASE_URL + 'api/order/create/gift/order', orderDetails)
  }

  updateUser (data) {
    return this.http.post(CONSTANTS.BASE_URL + 'api/user/update/user', data)
  }

  updateProductInMongo () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/update/product/mongo', {})
  }

  updateProductStatInERP () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/update/product/erp', {})
  }

  updateCustomerInMongo () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/update/customer/mongo', {})
  }

  updateCustomerStatInERP () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/update/customer/erp', {})
  }

  createNewCustomerInMongo () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/create/new/customer/mongo', {})
  }

  createNewProductInMongo () {
    return this.http.post(CONSTANTS.BASE_URL + 'api/erp/create/new/product/mongo', {})
  }

  updateParentIdInUserDoc () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/update/parent/mongo', {})
  }

  updateUserDashboardData () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/update/dashboard/data', {})
  }

  updateNonCustomerDashboardData () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/update/noncustomer/dashboard/data', {})
  }

  updateAssociatedSMListToMongo () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/update/associated/sm/mongo', {})
  }

  storeInProgressOrderInErp () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/store/inprogress/order/to/erp', {})
  }

  updateOrderStatusToBilled () {
    return this.http.get(CONSTANTS.BASE_URL + 'api/erp/update/order/status/billed/mongo', {})
  }

  getVersion (): any {
    return this.http.get(CONSTANTS.BASE_URL + 'api/user/version')
  }
}
