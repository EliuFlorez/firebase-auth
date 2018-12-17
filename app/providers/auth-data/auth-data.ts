import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthData {
  
	public fireAuth: any;
	public userProfile: any;

  constructor() {
		this.fireAuth = firebase.auth();
		this.userProfile = firebase.database().ref('userProfile');
	}

	loginUser(email: string, password: string): any {
		return this.fireAuth.signInWithEmailAndPassword(email, password);
	}
  
	loginSocial() {
    var authProvider = new firebase.auth.FacebookAuthProvider();
    return this.fireAuth.signInWithPopup(authProvider);
  }
	
	signupUser(email: string, password: string): any {
		return this.fireAuth.createUserWithEmailAndPassword(email, password);
	}
	
	resetPassword(email: string): any {
		return this.fireAuth.sendPasswordResetEmail(email);
	}
	
	logoutUser(): any {
		return this.fireAuth.signOut();
	}
	
}
