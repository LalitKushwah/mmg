import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  userLoginForm : FormGroup;
  passwordLogin: FormControl;
  userNameLogin: FormControl;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createFormControls() {
    this.userNameLogin = new FormControl('', [
      Validators.required
    ]);
    this.passwordLogin = new FormControl('', [
      Validators.required
    ]);
   }

   createForm() {
    this.userLoginForm = new FormGroup({
      userNameLogin: this.userNameLogin,
      passwordLogin: this.passwordLogin
    });
   }

}
