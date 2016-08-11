import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ControlGroup, AbstractControl, FormBuilder, Validators } from '@angular/common';
import { AuthData } from '../../providers/auth-data/auth-data';

@Component({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [AuthData]
})
export class SignupPage {
  
	public signupForm: ControlGroup;
	public email: AbstractControl;
	public password: AbstractControl;

  constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController, 
		public loadingCtrl: LoadingController, 
		public authData: AuthData, 
		public formBuilder: FormBuilder
	) {
    this.navCtrl = navCtrl;
    this.authData = authData;

    this.signupForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
		
		this.email = this.signupForm.controls['email'];
		this.password = this.signupForm.controls['password'];
  }
	
	signupUser(event) {
		event.preventDefault();
		let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password).then((authData) => {
      loading.onDidDismiss(() => {
        this.authData.fireAuth.signInWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password).then((authenticatedUser) => {
          this.authData.userProfile.child(authenticatedUser.uid).set({
            email: this.signupForm.value.email
          }).then(() => {
            this.navCtrl.popToRoot();
          });
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
	
}
