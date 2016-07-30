import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/event-detail/event-detail.html',
})
export class EventDetailPage {

  currentEvent: any;
	
  constructor(private nav: NavController, private navParams: NavParams) {
    this.navParams = navParams;
		this.currentEvent = this.navParams.get('eventDetail');
  }

}