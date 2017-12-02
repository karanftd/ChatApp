import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Rx';

import { LoghandlingProvider } from '../loghandling/loghandling';
import { usercredentials } from '../../models/interfaces/usercredentials';
import { tableNames, googleWebClientId } from '../../app/app.firebaseconfig';
import { LocalstorageProvider } from '../localstorage/localstorage'

/*
  Generated class for the AuthenticationProvider provider.

  AuthenticationProvider provides facebook sigin and auth tocken from that.
*/
@Injectable()
export class AuthenticationProvider {

  private TAG: string = 'AuthenticationProvider';
  firedata = firebase.database().ref(tableNames.User);

  /**
   * Basic constructor for LogServiceProvider.
   */
  constructor(private loghandlingProvider: LoghandlingProvider, private platform: Platform,
<<<<<<< Updated upstream
  private facebook: Facebook, private GooglePlus: GooglePlus, private angularFireAuth: AngularFireAuth, 
  private angularFireDatabase: AngularFireDatabase, private localstorageProvider: LocalstorageProvider) {
=======
  private facebook: Facebook, private angularFireAuth: AngularFireAuth, 
  private angularFireDatabase: AngularFireDatabase, private localstorageProvider: LocalstorageProvider,
  private events: Events) {
>>>>>>> Stashed changes
    this.loghandlingProvider.showLog(this.TAG,'Hello AuthenticationProvider Provider');
  }

  /**
   * sign in with facebook
   */
  signInWithFacebook(): firebase.Promise<any> {
    this.loghandlingProvider.showLog(this.TAG, "sign in with facebook");
    if (this.platform.is('cordova')) {
      return this.platform.ready().then(() => {
        return this.facebook.login(['email', 'public_profile']).then((res) => {
          this.loghandlingProvider.showLog(this.TAG, "credential " + res.authResponse.accessToken);
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          this.loghandlingProvider.showLog(this.TAG,"credential " + facebookCredential);
          return this.angularFireAuth.auth.signInWithCredential(facebookCredential).then((res: any) => {
              this.loghandlingProvider.showLog(this.TAG,"sign in with credential : " + res);
              return res;
            }).catch((err) => {
              this.loghandlingProvider.showLog(this.TAG,"sign in with error : " + err);
              return err;
          });
        }, (error) => {
          this.loghandlingProvider.showLog(this.TAG,"from error block of auth" + JSON.stringify(error));
        });
      });
    } else {
      this.loghandlingProvider.showLog(this.TAG,"sign in with popup called");
      return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
  }

  /**
   * Allow user to login with email and password from firebase.
   * @param credentials user login credential having email and password.
   */
  login(credentials: usercredentials): firebase.Promise<any> {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);    
  } 

  /**
   * This function invoke update profile method using user's param.
   * @param user user details
   */
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

    this.events.publish('user:displayName updated', user.displayName);

    return this.angularFireDatabase.object(tableNames.User + '/' + user.uid).update(user);
  }

  /**
   * sign in with googleplus
   */
  signInWithGoogle(): firebase.Promise<any> {
    if (this.platform.is('cordova')) {
      return this.platform.ready().then(() => {
        return this.GooglePlus.login({
          'scopes': 'email',
          'webClientId' : googleWebClientId,
          'offline': true
        }).then((res) => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          return this.angularFireAuth.auth.signInWithCredential(googleCredential);
        }, (error) => {
          return firebase.Promise.reject(error);
        });
      });
    } else {
      return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
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
   * get full profile.
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

  /**
   * From get user details from firebase current user. 
   */
  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }

  /**
   * Update display name enterd in dialog.
   * @param newname display name to update.
   */
  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.currentUser.updateProfile({
      displayName: newname,
      photoURL: this.angularFireAuth.auth.currentUser.photoURL
    }).then(() => {
      this.firedata.child(firebase.auth().currentUser.uid).update({
        displayName: newname,
        photoURL: this.angularFireAuth.auth.currentUser.photoURL,
        uid: this.angularFireAuth.auth.currentUser.uid
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
      }).catch((err) => {
        reject(err);
    })
    })
    return promise;
  }

  /**
   * Update profile picture by uploading it in storage.
   * @param imageurl imageurl of profile picture.
   */
  updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
        this.angularFireAuth.auth.currentUser.updateProfile({
            displayName: this.angularFireAuth.auth.currentUser.displayName,
            photoURL: imageurl      
        }).then(() => {
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
            displayName: this.angularFireAuth.auth.currentUser.displayName,
            photoURL: imageurl,
            uid: firebase.auth().currentUser.uid
            }).then(() => {
                resolve({ success: true });
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