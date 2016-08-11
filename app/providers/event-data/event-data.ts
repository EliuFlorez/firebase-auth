import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class EventData {
  
	public currentUser: any;
  public eventList: any;
	public profilePictureRef: any;

  constructor() {
    this.currentUser = firebase.auth().currentUser.uid;
    this.eventList = firebase.database().ref('userProfile/' + this.currentUser + '/eventList');
		this.profilePictureRef = firebase.storage().ref('/guestProfile/');
  }

	getEventList(): any {
		return this.eventList;
	}

	createEvent(eventName: string, eventDate: string, eventPrice: number, eventCost: number): any {
		return this.eventList.push({
			name: eventName,
			date: eventDate,
			price: eventPrice * 1,
			cost: eventCost * 1,
			revenue: eventCost * -1
		}).then( newEvent => {
			this.eventList.child(newEvent.key).child('id').set(newEvent.key);
		});
	}
	
	getEventDetail(eventId): any {
		return this.eventList.child(eventId);
	}

	addGuest(guestName, eventId, eventPrice, guestPicture = null): any {
		return this.eventList.child(eventId).child('guestList').push({
			guestName: guestName
		}).then((newGuest) => {
			this.profilePictureRef.child(newGuest.key).child('profilePicture.png')
				.put(guestPicture).then((savedPicture) => {
					this.eventList.child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
						.set(savedPicture.downloadURL);
			});
			this.eventList.child(eventId).child('revenue').transaction( (revenue) => {
				revenue += eventPrice;
				return revenue;
			});
		});
	}
	
	removeGuest(guestId, eventId, eventPrice): any {
		return this.eventList.child(eventId).child('guestList/'+guestId).remove().then(() => {
			this.eventList.child(eventId).child('revenue').transaction( (revenue) => {
				revenue -= eventPrice;
				return revenue;
			});
		});
	}
}