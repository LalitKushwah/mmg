import { CustomerReviewSubmitOrderPage } from './../customer-review-submit-order/customer-review-submit-order';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WidgetUtilService } from '../../utils/widget-utils';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CONSTANTS } from '../../utils/constants';
import { PopoverHomePage } from '../popover-home/popover-home';
import { SmEditOrderPage } from '../sm-edit-order/sm-edit-order';
import { CommonService } from '../../providers/common.service';
import { GenericService } from '../../providers/generic-service/generic-service';

@IonicPage({
  name: 'CustomerListProductPage'
})
@Component({
  selector: 'page-customer-list-product',
  templateUrl: 'customer-list-product.html',
})
export class CustomerListProductPage {

  categoryId: string = ''
  keyword: string = ''
  parentCategoryId: string = ''
  categoryObj: any = {}
  productListAvailable: Boolean = false
  isSearch: Boolean = false
  productList: Array<any> = [];
  filteredProductList: Array<any> = [];
  cartQuantity: any = 0;
  orderTotal: any = 0;
  multiCartDetail = {};
  cart: any = []
  tkPoint: any = 0
  skipValue: number = 0
  searchQuery: string;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  allProducts = []
  totalNetWeight: number = 0
  isEditOrderFlow = false
  loggedInUserStore = []
  selectedCart: any = [];
  customerCartExists: boolean = false;
  selectedCustomer: any;
  isSalesman = false;

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiServiceProvider,
    private widgetUtil: WidgetUtilService,
    private storageService: StorageServiceProvider,
    private commonService: CommonService,
    private genericService: GenericService) {

    this.skipValue = 0
    this.limit = CONSTANTS.PAGINATION_LIMIT
    this.categoryId = this.navParams.get("categoryId")
    this.parentCategoryId = this.navParams.get("parentCategoryId")
    this.categoryObj = this.navParams.get("category")
    this.isSearch = this.navParams.get("isSearch")
    this.keyword = this.navParams.get("keyword")
    this.isEditOrderFlow = this.navParams.get("isEdit")

    this.productListAvailable = false
    this.productList = []
    this.getList()
  }

  ionViewWillEnter () {
    // INFO: get All products corresponding to category
    this.apiService.getAllProductsByCategory(this.categoryId).subscribe((result) => {
      if (result.body && result.body.length) {
        this.allProducts = result.body
        this.allProducts.forEach((product: any) => {
          product['quantity'] = 1
        })
      }
    }, error => {
      if (error.statusText === 'Unknown Error') {
        this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
      } else {
        this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
      }
    })
  }

  async ionViewDidEnter () {
    const profile = await this.storageService.getFromStorage('profile');
    if ((profile['userType'] === 'SALESMAN') || (profile['userType'] === 'SALESMANAGER')) {
      this.isSalesman = true;
    } 
    this.getCartItems()
    const res: any = await this.commonService.getLoggedInUser()
    if (res.associatedStore && res.associatedStore.length) {
      this.loggedInUserStore = res.associatedStore
    }
  }

  getList () {
    if (!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        this.productList = result.body
        this.productList.forEach(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
          value.currentCaseSize = Number(value.currentCaseSize).toFixed(2);
        })
        this.filteredProductList = this.productList
        this.productListAvailable = true
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
        this.productListAvailable = true
      })
    } else {
      this.apiService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        this.productList = result.body
        this.productList.forEach(value => {
          value.quantity = 1
          value.price = (parseFloat((Math.round(value.price * 100) / 100).toString()).toFixed(2))
        })
        this.filteredProductList = this.productList
        this.productListAvailable = true
      }, (error) => {
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
        this.productListAvailable = true
      })
    }
  }

  async getCartItems () {
    if (this.isSalesman) {
      this.selectedCustomer = await this.storageService.getSelectedCustomer();
      this.selectedCart = await this.storageService.getSelectedCartFromStorage(this.selectedCustomer._id);
      if (this.selectedCart.length !== 0) {
        this.customerCartExists = true;
      }
    } else {
      this.selectedCart = await this.storageService.getCartFromStorage();
    }

    if (this.isEditOrderFlow) {
      const storedEditedOrder: any = await this.storageService.getFromStorage('order')
      // update cart count badge when edit order flow is in active state
      this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0
    } else {
      if (this.isSalesman) {
        this.tkPoint = this.selectedCustomer.tkPoint;
      } else {
        this.tkPoint = await this.storageService.getTkPointsFromStorage()
      }
    }

    if (this.selectedCart.length > 0) {
      let updatedTotal = 0, updatedQuantity = 0;
      this.selectedCart.map((value) => {
        updatedTotal = updatedTotal + (value.price * parseInt(value.quantity))
        updatedQuantity = updatedQuantity + parseInt(value.quantity)
      })
      this.orderTotal = updatedTotal
      this.cartQuantity = updatedQuantity
    } else {
      this.cartQuantity = 0
      this.orderTotal = 0
    }

    if (this.isSalesman) {
      await this.storageService.updateSelectedCustomers(this.selectedCustomer._id, this.orderTotal, -1, -1);
    } else {
      await this.storageService.setToStorage('orderTotal', this.orderTotal)
    }
  }

  reviewAndSubmitOrder () {
    if (this.selectedCart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    } else {
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal': this.orderTotal
      })
    }
  }

  async addToCart (product, qty) {
    if (this.isEditOrderFlow) {
      if (parseInt(qty) > 0) {
        let prepareProduct = {
          productId: product._id,
          netWeight: product.netWeight,
          price: product.price,
          productDetail: {
            _id: product._id,
            name: product.name,
            price: product.price,
            productCode: product.productCode
          },
          quantity: product.quantity,
          tkPoint: product.tkPoint,
          parentCategoryId: product.parentCategoryId,
          productSysCode: product.productSysCode
        }
        let order: any = await this.storageService.getFromStorage('order')

        let presentInCart = false;
        const productsInCart = order.productList.map((value) => {
          if (value['productSysCode'] === product['productSysCode']) {
            presentInCart = true
            value.quantity = value.quantity + parseInt(product.quantity)
          }
          return value
        })
        if (!presentInCart) {
          let obj = {}
          Object.assign(obj, prepareProduct)
          obj['quantity'] = parseInt(qty)
          order.productList.push(obj)
        } else {
          order.productList = productsInCart
        }

        const obj = this.genericService.calculateTotalNetWeightAndTotalTk(order.productList);

        order.totalTkPoints = obj.totalTKPoint
        this.tkPoint = obj.totalTKPoint
        order.totalNetWeight = obj.totalNetWeight

        order.orderTotal = obj.orderTotal

        await this.storageService.setToStorage('order', order)
        this.widgetUtil.showToast(`${product.name} added to cart!`)
      }
    } else {
      if (parseInt(qty) > 0) {
        this.widgetUtil.showToast(`${product.name} added to cart!`)
        delete product['categoryId']
        delete product['productCode']
        /* product['quantity'] = parseInt(qty) */
        let presentInCart = false;
        const productsInCart = this.selectedCart.map((value) => {
          if (value['_id'] === product['_id']) {
            presentInCart = true
            value.quantity = value.quantity + parseInt(product.quantity)
          }
          return value
        })
        if (!presentInCart) {
          let obj = {}
          Object.assign(obj, product)
          obj['quantity'] = parseInt(qty)
          this.selectedCart.push(obj)
        } else {
          this.selectedCart = productsInCart
        }
        const obj = this.genericService.calculateTotalNetWeightAndTotalTk(this.selectedCart);

        this.tkPoint = obj.totalTKPoint
        this.totalNetWeight = obj.totalNetWeight
        this.orderTotal = obj.orderTotal
        this.cartQuantity = obj.totalQuantity
        
        if (this.isSalesman) {
          this.storageService.updateCartForSelectedCustomer(this.selectedCustomer._id, this.selectedCart);
          this.storageService.updateSelectedCustomers(this.selectedCustomer._id, this.orderTotal, this.totalNetWeight, this.tkPoint);
        } else {
          this.storageService.setToStorage('cart', this.selectedCart);
          this.storageService.setToStorage('tkpoint', this.tkPoint)
          this.storageService.setToStorage('totalNetWeight', this.tkPoint);
          this.storageService.setToStorage('orderTotal', this.tkPoint);
        }

      } else {
        this.widgetUtil.showToast(`Atleast 1 quantity is required!`)
      }
    }
  }

  resetQty (product) {
    product.quantity = '';
  }

  setQty (product) {
    product.quantity = product.quantity && product.quantity !== '' ? product.quantity : 1;
  }


  /*   async removeFromCart (product) {
      this.widgetUtil.showToast(`${product.name} removed from cart`)
      if (this.cart.length > 0) {
        this.cart.map((value, index) => {
          if(value['_id'] === product['_id']) {
            this.cart.splice(index, 1)
          }
        })
        this.getCartItems()
      }
    } */

  decrementQty (qty) {
    if (parseInt(qty) > 1) {
      return (parseInt(qty) - 1)
    }
    return parseInt(qty)
  }

  incrementQty (qty) {
    return (parseInt(qty) + 1)
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    if (!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        if (result.body.length > 0) {
          result.body.map((value) => {
            value.quantity = 1
            this.productList.push(value)
          })
        } else {
          this.skipValue = this.limit
        }
        infiniteScroll.complete();
      }, (error) => {
        infiniteScroll.complete();
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
      })
    } else {
      this.apiService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        if (result.body.length > 0) {
          result.body.map((value) => {
            value.quantity = 0
            this.productList.push(value)
          })
        } else {
          this.skipValue = this.limit
        }
        infiniteScroll.complete();
      }, (error) => {
        infiniteScroll.complete();
        if (error.statusText === 'Unknown Error') {
          this.widgetUtil.showToast(CONSTANTS.INTERNET_ISSUE)
        } else {
          this.widgetUtil.showToast(CONSTANTS.SERVER_ERROR)
        }
      })
    }
    // this.searchProducts()
  }

  doRefresh (refresher): void {
    this.getList()
    this.getCartItems()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  presentPopover (myEvent) {
    this.widgetUtil.presentPopover(myEvent, PopoverHomePage)
  }

  searchProducts (searchQuery) {
    this.filteredProductList = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  showTkToast () {
    this.widgetUtil.showToast('TK points will convert into TK currency post target achievement of QTR')
  }

  moveToEditOrderPage () {
    this.navCtrl.push(SmEditOrderPage)
  }
}
