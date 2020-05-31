import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-tk-product-modal',
  templateUrl: 'add-tk-product-modal.html',
})
export class AddTkProductModalPage {
  showLoader = false;
  title: string;

  constructor (public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.title = navParams.get('title');
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad AddTkProductModalPage');
  }
  dismissModal (){
    this.viewCtrl.dismiss();
  }

}
