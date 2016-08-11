import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ControlGroup, FormBuilder, Validators, AbstractControl } from '@angular/common';
import { AuthData } from '../../providers/auth-data/auth-data';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthData]
})
export class LoginPage {

  public loginForm: ControlGroup;
	public email: AbstractControl;
	public password: AbstractControl;

  constructor(
		public navCtrl: NavController, 
		private alertCtrl: AlertController, 
		private loadingCtrl: LoadingController, 
		public authData: AuthData, 
		public formBuilder: FormBuilder
	) {
    this.navCtrl = navCtrl;
    this.authData = authData;
		
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
		
		this.email = this.loginForm.controls['email'];
		this.password = this.loginForm.controls['password'];
  }

	loginUser(event) {
		event.preventDefault();
		let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((authData) => {
      loading.onDidDismiss(() => {
        this.navCtrl.popToRoot();
      });
      loading.dismiss();
    }, (error) => {
      loading.onDidDismiss(() => {
        let prompt = this.alertCtrl.create({
          message: error.message,
          buttons: ['Ok']
        });
        prompt.present();
      });
      loading.dismiss();
    });
	}
	
	goToSignup() {
		this.navCtrl.push(SignupPage);
	}

	goToResetPassword() {
		this.navCtrl.push(ResetPasswordPage);
	}

}
