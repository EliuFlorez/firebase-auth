import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TabsPage } from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import * as firebase from 'firebase';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  rootPage: any;

  constructor(platform: Platform) {
		
		let config = {
      apiKey: "API-KEY-HERE",
			authDomain: "AUTH-DOMAIN-HERE",
			databaseURL: "DATABASE-URL-HERE",
			storageBucket: "STORAGE-BUCKET-HERE"
    };
		
    firebase.initializeApp(config);
		
		firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // If there's a user take him to the home page.
        this.rootPage = TabsPage;
      } else {
        // If there's no user logged in send him to the LoginPage
        this.rootPage = LoginPage;
      }
    });
		
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
