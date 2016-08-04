import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { EventData } from '../../providers/event-data/event-data';

@Component({
  templateUrl: 'build/pages/event-detail/event-detail.html',
	providers: [EventData]
})
export class EventDetailPage {

  currentEvent: any;
	guestList: any;
	guestName: any;
	
  constructor(private nav: NavController, private navParams: NavParams, private eventData: EventData) {
    this.nav = nav;
		this.navParams = navParams;
		this.eventData = eventData;
		this.eventData.getEventDetail(this.navParams.get('eventId')).on('value', (snapshot) => {
			this.currentEvent = snapshot.val();
			let rawList = [];
			if (typeof this.currentEvent.guestList !== 'undefined') {
				var guestData = this.currentEvent.guestList;
				Object.keys(guestData).forEach(function(key, value) {
						console.log(guestData[key]);
						rawList.push({
							id: key,
							name: guestData[key].guestName
						});
				});
			}
			this.guestList = rawList;
		});
  }

	addGuest(guestName) {
		this.eventData.addGuest(guestName, this.currentEvent.id, this.currentEvent.price).then(() => {
			this.guestName = '';
		});
	}
	
	removeGuest(guestId) {
		let confirm = Alert.create({
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
						this.eventData.removeGuest(guestId, this.currentEvent.id, this.currentEvent.price).then(() => {
							console.log('Guest remove: ' + guestId);
						});
          }
        }
      ]
    });
		this.nav.present(confirm);
	}
	
}