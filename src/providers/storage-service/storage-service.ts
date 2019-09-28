import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable()
export class StorageServiceProvider {

  private _giftProductCart = []
  private editCustomer: any = {}

  async getEditCustomerData () {
    const response = await this.getFromStorage('salesmanList')
    if (response) {
      this.editCustomer.salesmanList = response
    } else {
      await this.setToStorage('salesmanList', this.editCustomer.salesmanList)
    }
    return this.editCustomer
  }

  setEditCustomerData (data) {
    this.editCustomer = data
  }

  getGiftProductCart (): any[] {
    return this._giftProductCart;
  }

  setGiftProductCart (value: any[]) {
    this._giftProductCart = value;
  }

  constructor (public storage: Storage) {
  }

  getFromStorage (key) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  getCartFromStorage () {
    return new Promise((resolve, reject) => {
      this.storage.get('cart')
        .then(result => {
          if(result) {
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

  getTkPointsFromStorage () {
    return new Promise((resolve, reject) => {
      this.storage.get('tkpoint')
        .then(result => {
          if(result) {
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


  setToStorage (key, value) {
    return this.storage.set(key, value)
  }

  removeFromStorage (key) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  clearStorage () {
    this.storage.clear()
  }
}
