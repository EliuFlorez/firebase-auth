import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data/event-data';
import { AuthData } from '../../providers/auth-data/auth-data';

@Component({
  templateUrl: 'build/pages/event-list/event-list.html',
  providers: [AuthData, EventData]
})
export class EventListPage {

  private eventList: any;

  constructor(private nav: NavController, private authData: AuthData, private eventData: EventData) {
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
	
	goToEventDetail(eventId) {
		this.nav.push(EventDetailPage, {
			eventId: eventId
		});
	}
	
	logOut(){
		this.authData.logoutUser().then(() => {
			this.nav.rootNav.setRoot(LoginPage);
		});
	}
	
}