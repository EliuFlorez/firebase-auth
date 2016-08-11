import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ProfileData } from '../../providers/profile-data/profile-data';
import { AuthData } from '../../providers/auth-data/auth-data';
import { LoginPage } from '../login/login';
import { Camera } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileData, AuthData]
})
export class ProfilePage {
  
	public userProfile: any;
  public birthDate: string;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public profileData: ProfileData, public authData: AuthData) {
    this.navCtrl = navCtrl;
    this.profileData = profileData;

    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;
    });
  }
	
	logOut() {
		this.authData.logoutUser().then(() => {
			this.navCtrl.setRoot(LoginPage);
		});
	}
	
	getPicture() {
		Camera.getPicture({
			quality : 95,
			destinationType : Camera.DestinationType.DATA_URL, // DATA_URL, FILE_URI
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM
			allowEdit : true,
			encodingType: Camera.EncodingType.PNG, // PNG, JPG
			targetWidth: 500,
			targetHeight: 500,
			saveToPhotoAlbum: true
		}).then(imageData => {
			const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
				const byteCharacters = atob(b64Data);
				const byteArrays = [];

				for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
					const slice = byteCharacters.slice(offset, offset + sliceSize);

					const byteNumbers = new Array(slice.length);
					for (let i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);

					byteArrays.push(byteArray);
				}

				const blob = new Blob(byteArrays, {type: contentType});
				return blob;
			}

			let userPicture = b64toBlob(imageData, 'image/png');
			
			this.profileData.updatePicture(userPicture);
			
		}, error => {
			console.log("ERROR -> " + JSON.stringify(error));
		});
	}
	
	updateName(){
		let prompt = this.alertCtrl.create({
			message: "Your first name & last name",
			inputs: [
				{
					name: 'firstName',
					placeholder: 'Your first name',
					value: this.userProfile.firstName
				},
				{
					name: 'lastName',
					placeholder: 'Your last name',
					value: this.userProfile.lastName
				},
			],
			buttons: [
				{
					text: 'Cancel',
				},
				{
					text: 'Save',
					handler: data => {
						this.profileData.updateName(data.firstName, data.lastName);
					}
				}
			]
		});
		prompt.present();
	}
	
	updateDOB(birthDate){
		this.profileData.updateDOB(birthDate);
	}
	
	updateEmail(){
		let prompt = this.alertCtrl.create({
			inputs: [
				{
					name: 'newEmail',
					placeholder: 'Your new email',
				},
			],
			buttons: [
				{
					text: 'Cancel',
				},
				{
					text: 'Save',
					handler: data => {
						this.profileData.updateEmail(data.newEmail);
					}
				}
			]
		});
		prompt.present();
	}

	updatePassword(){
		let prompt = this.alertCtrl.create({
			inputs: [
				{
					name: 'newPassword',
					placeholder: 'Your new password',
					type: 'password'
				},
			],
			buttons: [
				{
					text: 'Cancel',
				},
				{
					text: 'Save',
					handler: data => {
						this.profileData.updatePassword(data.newPassword);
					}
				}
			]
		});
		prompt.present();
	}
	
}