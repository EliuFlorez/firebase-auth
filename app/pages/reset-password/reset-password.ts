import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ControlGroup, AbstractControl, FormBuilder, Validators } from '@angular/common';
import { AuthData } from '../../providers/auth-data/auth-data';

@Component({
  templateUrl: 'build/pages/reset-password/reset-password.html',
  providers: [AuthData]
})
export class ResetPasswordPage {
  
	public resetPasswordForm: ControlGroup;
	public email: AbstractControl;

  constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController, 
		public loadingCtrl: LoadingController, 
		public authData: AuthData, 
		public formBuilder: FormBuilder
	) {
    this.authData = authData;
		
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.required]
    });
		
		this.email = this.resetPasswordForm.controls['email'];
  }
	
	resetPassword(event) {
		event.preventDefault();
		let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
      loading.onDidDismiss(() => {
        let prompt = this.alertCtrl.create({
					message: "We just sent you a reset link to your email",
					buttons: ['Ok']
				});
				prompt.present();
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
