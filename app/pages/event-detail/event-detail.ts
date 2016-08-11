import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EventData } from '../../providers/event-data/event-data';	
import { Camera } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/event-detail/event-detail.html',
	providers: [EventData]
})
export class EventDetailPage {

  currentEvent: any;
	guestView: any;
	guestList: any;
	guestName: any;
	guestPicture: any;
	
  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private navParams: NavParams, private eventData: EventData) {
    this.navCtrl = navCtrl;
		this.navParams = navParams;
		this.eventData = eventData;
		
		this.eventData.getEventDetail(this.navParams.get('eventId')).on('value', (snapshot) => {
			this.currentEvent = snapshot.val();
			let rawList = [];
			if (typeof this.currentEvent.guestList !== 'undefined') {
				var guestData = this.currentEvent.guestList;
				Object.keys(guestData).forEach(function(key, value) {
						rawList.push({
							id: key,
							name: guestData[key].guestName
						});
				});
			}
			this.guestList = rawList;
			this.guestView = true;
		});
  }

	addGuest(guestName) {
		if (guestName == null) {
			let alerts = this.alertCtrl.create({
				message: 'Error: name require',
				buttons: ['Ok']
			});
			alerts.present();
		} else {
			this.eventData.addGuest(guestName, this.currentEvent.id, this.currentEvent.price, this.guestPicture).then(() => {
				this.guestName = '';
				this.guestPicture = null;
			});
		}
	}
	
	removeGuest(guestId) {
		let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Delete?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Remove ID: ' + guestId);
						this.eventData.removeGuest(guestId, this.currentEvent.id, this.currentEvent.price).then((event) => {
							console.log('Guest remove: ' + guestId);
						});
          }
        }
      ]
    });
		confirm.present();
	}
	
	takePicture() {
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

			this.guestPicture = b64toBlob(imageData, 'image/png');

		}, error => {
			console.log("ERROR -> " + JSON.stringify(error));
		});
	}
	
}
