import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventData } from '../../providers/event-data/event-data';

@Component({
  templateUrl: 'build/pages/event-create/event-create.html',
  providers: [EventData]
})
export class EventCreatePage {

  constructor(private navCtrl: NavController, private eventData: EventData) {
    this.navCtrl = navCtrl;
    this.eventData = eventData;
  }

	createEvent(eventName: string, eventDate: string, eventPrice: number, eventCost: number) {
		this.eventData.createEvent(eventName, eventDate, eventPrice, eventCost).then( (event) => {
			this.navCtrl.pop();
		});
	}

}