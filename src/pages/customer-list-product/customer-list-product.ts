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
  cartDetail:any = []
  cart: any = []
  tkPoint: any = 0
  skipValue: number = 0
  searchQuery: string;
  limit: number = CONSTANTS.PAGINATION_LIMIT;
  allProducts = []
  totalNetWeight: number = 0
  isEditOrderFlow = false
  loggedInUserStore = []

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               private apiService: ApiServiceProvider,
               private widgetUtil: WidgetUtilService, 
               private storageService: StorageServiceProvider,
               private commonService: CommonService) {

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
        this.allProducts.map((product: any) => {
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

  async ionViewDidEnter (){
    this.getCartItems()
    const res: any = await this.commonService.getLoggedInUser()
    if (res.associatedStore && res.associatedStore.length) {
      console.log('============ 85 ==========', res.associatedStore)
      this.loggedInUserStore = res.associatedStore
    }
  }

  getList () {
    if(!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
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
    } else {
      this.apiService.searchProductInParentCategory(this.skipValue, this.limit, this.parentCategoryId, this.keyword).subscribe((result) => {
        this.productList = result.body
        this.productList.map(value => {
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
    this.cart = await this.storageService.getCartFromStorage()
    if (this.isEditOrderFlow) {
        const storedEditedOrder: any = await this.storageService.getFromStorage('order')
        // update cart count badge when edit order flow is in active state
        this.tkPoint = storedEditedOrder.totalTkPoints ? storedEditedOrder.totalTkPoints : 0
    } else {
        this.tkPoint = await this.storageService.getTkPointsFromStorage()
    }
    if(this.cart.length > 0) {
      let updatedTotal = 0, updatedQuantity = 0;
      this.cart.map((value) => {
        updatedTotal = updatedTotal + (value.price * parseInt(value.quantity))
        updatedQuantity = updatedQuantity + parseInt(value.quantity)
      })
      this.orderTotal = updatedTotal
      this.cartQuantity = updatedQuantity
    } else {
      this.cartQuantity = 0
      this.orderTotal = 0
    }
    await this.storageService.setToStorage('orderTotal', this.orderTotal)
  }

  reviewAndSubmitOrder () {
    if (this.cart.length <= 0) {
      this.widgetUtil.showToast(CONSTANTS.CART_EMPTY)
    }else {
      this.navCtrl.push(CustomerReviewSubmitOrderPage, {
        'orderTotal' : this.orderTotal
      })
    }
  }

  async addToCart (product, qty) {
   if (this.isEditOrderFlow) {
    if(parseInt(qty) > 0) {
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
      const productsInCart = order.productList.map((value)=> {
        if (value['productSysCode'] === product['productSysCode']) {
          presentInCart = true
          value.quantity = value.quantity + parseInt(product.quantity)
        }
        return value
      })
      if(!presentInCart) {
        let obj ={}
        Object.assign(obj, prepareProduct)
        obj['quantity'] = parseInt(qty)
        order.productList.push(obj)
      } else {
        order.productList = productsInCart
      }

      let sum = 0
      let totalNetWeight = 0
      let orderTotal = 0
      order.productList.map(item => {
          if (item.tkPoint) {
            sum = sum + (parseFloat(item.tkPoint) * parseInt(item.quantity))
          }
          if (item.netWeight) {
            totalNetWeight = totalNetWeight + (parseFloat(item.netWeight) * parseInt(item.quantity))
          }
          orderTotal = orderTotal + (parseFloat(item.price) * parseInt(item.quantity))
      })
      order.totalTkPoints = sum
      this.tkPoint = sum
      order.totalNetWeight = (totalNetWeight/1000).toFixed(3)
      
      order.orderTotal = orderTotal

      await this.storageService.setToStorage('order', order)
      this.widgetUtil.showToast(`${product.name} added to cart!`)
    }
   } else {
      if(parseInt(qty) > 0) {
        this.widgetUtil.showToast(`${product.name} added to cart!`)
        delete product['categoryId']
        delete product['productCode']
        /* product['quantity'] = parseInt(qty) */
        let presentInCart = false;
        const productsInCart = this.cart.map((value)=> {
          if (value['_id'] === product['_id']) {
            presentInCart = true
            value.quantity = value.quantity + parseInt(product.quantity)
          }
          return value
        })
        if(!presentInCart) {
          let obj ={}
          Object.assign(obj, product)
          obj['quantity'] = parseInt(qty)
          this.cart.push(obj)
        } else {
          this.cart = productsInCart
        }
        let sum = 0
        let totalNetWeight = 0
        this.cart.map(item => {
            if (item.tkPoint) {
              sum = sum + (parseFloat(item.tkPoint) * parseInt(item.quantity))
            }
            if (item.netWeight) {
              totalNetWeight = totalNetWeight + (parseFloat(item.netWeight) * parseInt(item.quantity))
            }
        })
        this.tkPoint = sum
        this.totalNetWeight = totalNetWeight/1000
        this.storageService.setToStorage('tkpoint', sum)
        this.storageService.setToStorage('totalNetWeight', this.totalNetWeight.toFixed(3))
  
        this.cartDetail = await this.storageService.setToStorage('cart', this.cart)
        let updatedTotal = 0, updatedQuantity = 0;
        this.cartDetail.map((value) => {
          updatedTotal = updatedTotal + (parseFloat(value.price) * parseInt(value.quantity))
          updatedQuantity = updatedQuantity + parseInt(value.quantity)
        })
        this.orderTotal = updatedTotal
        this.cartQuantity = updatedQuantity
        console.log('============= 259 ===========', this.cart);
        
        this.storageService.setToStorage('cart', this.cart)
      } else {
        this.widgetUtil.showToast(`Atleast 1 quantity is required!`)
      }
    }
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
    if(parseInt(qty) > 1) {
      return (parseInt(qty) - 1)
    }
    return parseInt(qty)
  }

  incrementQty (qty) {
    return (parseInt(qty) + 1)
  }

  doInfinite (infiniteScroll) {
    this.skipValue = this.skipValue + this.limit
    if(!this.isSearch) {
      this.apiService.getProductListByCategory(this.categoryId, this.skipValue, this.limit).subscribe((result) => {
        if(result.body.length > 0) {
          result.body.map( (value) => {
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
        if(result.body.length > 0) {
          result.body.map( (value) => {
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

  doRefresh (refresher) : void {
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
  )}

  showTkToast () {
    this.widgetUtil.showToast('TK points will convert into TK currency post target achievement of QTR')
  }

  moveToEditOrderPage () {
    this.navCtrl.push(SmEditOrderPage)
  }
}
