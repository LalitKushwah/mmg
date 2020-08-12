import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable()
export class StorageServiceProvider {

  private _giftProductCart = []
  private editCustomer: any = {}

  async getEditCustomerData() {
    const response = await this.getFromStorage('salesmanList')
    if (response) {
      this.editCustomer.salesmanList = response
    } else {
      await this.setToStorage('salesmanList', this.editCustomer.salesmanList)
    }
    return this.editCustomer
  }

  setEditCustomerData(data) {
    this.editCustomer = data
  }

  getGiftProductCart(): any[] {
    return this._giftProductCart;
  }

  setGiftProductCart(value: any[]) {
    this._giftProductCart = value;
  }

  constructor(public storage: Storage) {
  }

  getFromStorage(key) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
    })
  }

  getCartFromStorage() {
    return new Promise((resolve, reject) => {
      this.storage.get('cart')
        .then(result => {
          if (result) {
            resolve(result)
          } else {
            this.storage.set('cart', []).then(res => {
              resolve(res)
            })
          }
        }).catch(err => {
          reject(err)
        })
    })
  }

  getSelectedCartFromStorage(id: string) {
    return new Promise((resolve, reject) => {
      let selectedCart = [];
      this.getFromStorage('multiCart').then((multiCart: any) => {
        for (const key in multiCart) {
          if (key === id) {
            selectedCart = multiCart[key];
          }
        }
        resolve(selectedCart);
      });
    });
  }

  getTkPointsFromStorage() {
    return new Promise((resolve, reject) => {
      this.storage.get('tkpoint')
        .then(result => {
          if (result) {
            resolve(result)
          } else {
            this.storage.set('tkpoint', 0).then(res => {
              resolve(res)
            })
          }
        }).catch(err => {
          reject(err)
        })
    })
  }


  setToStorage(key, value) {
    return this.storage.set(key, value)
  }

  removeFromStorage(key) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
    })
  }

  clearStorage() {
    this.storage.clear()
  }

  async clearCart() {
    await this.setToStorage('cart', [])
    await this.removeFromStorage('tkpoint')
    await this.setToStorage('totalNetWeight', 0)
  }

  async clearSelectedCartFromStorage(id: string) {
    const multiCart = await this.getFromStorage('multiCart');
    delete multiCart[id];
    this.setToStorage('multiCart', multiCart);
    this.removeFromStorage('tkpoint')
    this.setToStorage('totalNetWeight', 0);
  }

  async updateCartForSelectedCustomer(id: string, cartItems: any) {
    let multiCart = await this.getFromStorage('multiCart');
    if (!multiCart) { multiCart = {}; }
    multiCart[id] = cartItems;
    await this.setToStorage('multiCart', multiCart);
  }

  async updateSelectedCustomers(id: string, orderTotal: any, totalNetWeight: any, tkPoint: any) {
    const selectedCustomers: any = await this.getFromStorage('selectedCustomers');
    selectedCustomers.map(customer => {
      if (customer._id === id) {
        if (orderTotal !== -1) {
          customer.orderTotal = orderTotal;
        }
        if (totalNetWeight !== -1) {
          customer.totalNetWeight = totalNetWeight;
        }
        if (tkPoint !== -1) {
          customer.tkPoint = tkPoint;
        }
      }
      return customer;
    })
    await this.setToStorage('selectedCustomers', selectedCustomers);
  }

  async getSelectedCustomer() {
    const customers: any = await this.getFromStorage('selectedCustomers');
    return customers.find(customer => {
      if (customer.isSelected) {
        return true;
      }
    })
  }
}
