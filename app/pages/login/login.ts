import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ControlGroup, FormBuilder, Validators, AbstractControl } from '@angular/common';
import { AuthData } from '../../providers/auth-data/auth-data';
import { ProfileData } from '../../providers/profile-data/profile-data';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthData, ProfileData]
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
		public profileData: ProfileData, 
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
	
	loginSocial(event) {
    event.preventDefault();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.loginSocial().then((authData) => {
      loading.onDidDismiss(() => {
        this.profileData.getUserProfileByLink(authData.user.uid).once('value').then((userData) => {
            var oauth = userData.val();
            if (oauth) {
              this.authData.userProfile.child(authData.user.uid).update({
                email: authData.user.email
              });
            } else {
              this.authData.userProfile.child(authData.user.uid).set({
                email: authData.user.email,
                firstName: authData.user.displayName,
                userPicture: authData.user.photoURL
              });
            }
        });
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
