import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';
import { AuthData } from '../../providers/auth-data/auth-data';
import { EventData } from '../../providers/event-data/event-data';

@Component({
  templateUrl: 'build/pages/home/home.html',
	providers: [AuthData, EventData]
})
export class HomePage {

	private eventList: any;

  constructor(private navCtrl: NavController, public authData: AuthData, private eventData: EventData) {
    this.navCtrl = navCtrl;
		this.authData = authData;
    this.eventData = eventData;
		
		this.eventData.getEventList().on('value', snapshot => {
			let rawList = [];
			snapshot.forEach( snap => {
				rawList.push({
					id: snap.key,
					name: snap.val().name,
					price: snap.val().price,
					date: snap.val().date
				});
			});
			this.eventList = rawList;
		});
  }
	
	goToCreate(){
		this.navCtrl.push(EventCreatePage);
	}
	
	goToEventDetail(eventId) {
		this.navCtrl.push(EventDetailPage, {
			eventId: eventId
		});
	}
	
	logOut(){
		this.authData.logoutUser().then(() => {
			this.navCtrl.setRoot(LoginPage);
		});
	}
	
}
