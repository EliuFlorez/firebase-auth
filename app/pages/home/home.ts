import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data/auth-data';
import { EventData } from '../../providers/event-data/event-data';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';

import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';

@Component({
  templateUrl: 'build/pages/home/home.html',
	providers: [AuthData, EventData]
})
export class HomePage {

	private eventList: any;

  constructor(private nav: NavController, public authData: AuthData, private eventData: EventData) {
    this.nav = nav;
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
		this.nav.push(EventCreatePage);
	}
	
	goToEventDetail(eventDetail) {
		this.nav.push(EventDetailPage, {
			eventDetail: eventDetail,
		});
	}
	
	logOut(){
		this.authData.logoutUser().then(() => {
			this.nav.rootNav.setRoot(LoginPage);
		});
	}
	
}
