import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Rx';

import { LoghandlingProvider } from '../loghandling/loghandling';
import { usercredentials } from '../../models/interfaces/usercredentials';
import { tableNames } from '../../app/app.firebaseconfig';
import { LocalstorageProvider } from '../localstorage/localstorage'

/*
  Generated class for the AuthenticationProvider provider.

  AuthenticationProvider provides facebook sigin and auth tocken from that.
*/
@Injectable()
export class AuthenticationProvider {

  private TAG: string = 'AuthenticationProvider';

  /**
   * Basic constructor for LogServiceProvider.
   */
  constructor(private loghandlingProvider: LoghandlingProvider, private platform: Platform,
  private facebook: Facebook, private angularFireAuth: AngularFireAuth, 
  private angularFireDatabase: AngularFireDatabase, private localstorageProvider: LocalstorageProvider) {
    this.loghandlingProvider.showLog(this.TAG,'Hello AuthenticationProvider Provider');
  }

  /**
   * sign in with facebook
   */
  signInWithFacebook() {
     this.loghandlingProvider.showLog(this.TAG, "sign in with facebook");
    if (this.platform.is('cordova')) {
      return this.platform.ready().then(() => {
        return this.facebook.login(['email', 'public_profile']).then((res) => {
           this.loghandlingProvider.showLog(this.TAG, "credential " + res.authResponse.accessToken);
          return res.authResponse.accessToken;
        }, (error) => {
           this.loghandlingProvider.showLog(this.TAG, "from error block of auth" + error.message);
          return error.message;
      });
      });
    } else {
       this.loghandlingProvider.showLog(this.TAG, "else block for none cordova.");
    }
  }

  /**
   * Allow user to login with email and password from firebase.
   * @param credentials user login credential having email and password.
   */
  login(credentials: usercredentials): firebase.Promise<any> {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);    
  } 

  public generateProfile(user: any){
    return this.updateProfile({
      uid        : user.uid,
      displayName: user.displayName,
      email      : user.email,
      photoURL   : user.photoURL,
      providerData   : user.providerData[0]
    });
  }

  /**
   * Update user profile according to user credentials on firebase.
   * @param user user details after login
   */
  updateProfile(user): firebase.Promise<any> {
    user.updatedAt = firebase.database['ServerValue']['TIMESTAMP'];

    let providerData = user.providerData;
    if (providerData && providerData.providerId === 'facebook.com')
      user.photoURL = `https://graph.facebook.com/${providerData.uid}/picture?type=square`;

    this.localstorageProvider.setUsername(user.displayName);
    this.localstorageProvider.setEmail(user.email);

    return this.angularFireDatabase.object(tableNames.User + '/' + user.uid).update(user);
  }

  /**
   * Sign out user.
   */
  signOut(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signOut();
  }

  /**
   * Get authentication status.
   */
  getAuthenticationStatus(): Observable<firebase.User> {
    return this.angularFireAuth.authState;
  }

  /**
   * get full profile
   */
  getFullProfile(uid?: string): Observable<UserModel> {
    if (uid)
      return this.angularFireDatabase.object(tableNames.User + '/' + uid);
    
    return Observable.create((observer) => {
      this.getAuthenticationStatus().subscribe((user: firebase.User) => {
        if (user !== null)
          this.angularFireDatabase.object(tableNames.User + '/' + user.uid).subscribe((res) => observer.next(res));
      });
    });
  }

  /**
   * Add new user on firebase.
   * @param newuser user details for new user creation
   */
  adduser(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then((res) => {
        this.angularFireAuth.auth.currentUser.updateProfile({displayName: newuser.displayName, photoURL: newuser.photoUrl});
        this.loghandlingProvider.showLog(this.TAG,'User created.')
          this.angularFireAuth.auth.signInWithEmailAndPassword(newuser.email, newuser.password).then((res: any) => {
              resolve(res);
            }).catch((err) => {
              reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

}

export class UserModel {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  providerData?: any;
}