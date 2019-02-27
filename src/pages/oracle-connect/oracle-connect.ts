import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import * as JsonEditor from 'jsoneditor'

/**
 * Generated class for the OracleConnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'OracleConnectPage'
})
@Component({
  selector: 'page-oracle-connect',
  templateUrl: 'oracle-connect.html',
})
export class OracleConnectPage {
  @ViewChild('jsonEditor') jsonEditor :ElementRef

  data: any ="nsdksajgdnvba BDalmndb<X>ka/s.j,cmbzxhjoi;klm,";
  editor;
  json = {
    "Array": [1, 2, 3],
    "Boolean": true,
    "Null": null,
    "Number": 123,
    "Object": {"a": "b", "c": "d"},
    "String": "Hello World"
  };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiServiceProvider,) {
  }

  getData(entity) {
    this.apiService.getData({entity: entity}).subscribe(data => {
      this.data = JSON.stringify(data)
      this.editor.set(this.data)
    })
  }

  ionViewDidLoad() {
    console.log('========')
    const options = {
      mode: 'code',
      modes: ['code', 'text', 'tree', 'view']
    }
    this.editor = new JsonEditor(this.jsonEditor.nativeElement, options)
    this.editor.set(this.json)
    console.log('====== 52 =====', this.editor.get())
  }

}
