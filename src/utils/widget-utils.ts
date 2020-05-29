import { Injectable } from '@angular/core';
import { AlertController, ToastController, PopoverController } from 'ionic-angular';

@Injectable()
export class WidgetUtilService {

  popoverInstance : any = {}

  constructor (public alertController: AlertController, public toastController: ToastController
    , private popoverController: PopoverController) {
  }

  showAlert (title, subTitle) {
    this.alertController.create({
        title: title,
        subTitle: subTitle,
        buttons: ['OK']
      }).present();
  }

  showToast (message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  dismissPopover () {
    this.popoverInstance.dismiss()
  }

  presentPopover (myEvent, page) {
    this.popoverInstance = this.popoverController.create(page);
    this.popoverInstance.present({
      ev: myEvent
    });
  }

  async showPrompt (title: string, prodType?: string) {
    return new Promise(async (resolve, reject) => {
      const prompt = this.alertController.create({
        title,
        cssClass: 'my-custom-alert',
        message: "Enter all the respective fields",
        inputs: [
          {
            name: 'BRAND',
            placeholder: 'Brand',
            type: 'text'
          },
          {
            name: 'Case Size',
            placeholder: 'Case Size',
            type: 'number'
          },
          {
            name: 'Master Code',
            placeholder: 'Master Code',
            type: 'text'
          },
          {
            name: 'Master Name',
            placeholder: 'Master Name',
            type: 'text'
          },
          {
            name: 'Product Catagory',
            placeholder: 'Product Catagory',
            type: 'text'
          },
          {
            name: 'Product Code',
            placeholder: 'Product Code',
            type: 'text'
          },
          {
            name: 'Product Name',
            placeholder: 'Product Name',
            type: 'text'
          },
          {
            name: 'Sub Catagory',
            placeholder: 'Sub Catagory',
            type: 'text'
          },
          {
            name: 'Unit Size',
            placeholder: 'Unit Size',
            type: 'text'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: prodData => {
              if (!this.validateInput(prodData)) {
                return false;
              }
              console.log(prodData);
              if (prodType === 'tk') {
                prodData['Is TKProduct'] = 'Y';
                prodData['Competitive Product'] = [];
              } else {
                prodData['Is TKProduct'] = 'N';
              }
              resolve(prodData);
            }
          }
        ]
      });
      try {
        await prompt.present();
      } catch (error) {
        reject(error);
      }
    });
  }

  validateInput (data: any): boolean {
    if (!data['BRAND'] || !data['Case Size'] || !data['Master Code'] || !data['Master Name'] ||
      !data['Product Catagory'] || !data['Product Code'] || !data['Product Name'] || !data['Sub Catagory'] || !data['Unit Size']) {
      this.showAlert('Invalid Inputs', 'Kindly enter all fields with valid data');
      return false;
    }

    if (data['Product Catagory'] !== 'Laundry' && data['Product Catagory'] !== 'Confectionery' && data['Product Catagory'] !== 'Household' && data['Product Catagory'] !== 'Personal Care') {
      this.showAlert('Invalid Product Category', "Kindly enter product category among ('Laundry', 'Confectionery', 'Household', 'Personal Care')");
      return false;
    }
    return true;
  }
}
