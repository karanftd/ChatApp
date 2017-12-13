import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Push, PushObject, PushOptions } from "@ionic-native/push";

import { LoghandlingProvider } from '../providers/loghandling/loghandling';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { LocalstorageProvider } from '../providers/localstorage/localstorage';

declare let cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any}>;
  username: string = 'User name';
  TAG: string = "MyApp";

  /**
   * Default constructor.
   * @param platform 
   * @param statusBar 
   * @param splashScreen 
   * @param loghandlingProvider 
   * @param localstorageProvider
   * @param events
   */
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, 
  private loghandlingProvider: LoghandlingProvider, private authenticationProvider: AuthenticationProvider,
  private loadingController: LoadingController, private localstorageProvider: LocalstorageProvider,
  private events: Events, /**private push:Push**/) {
    
    this.initializeApp();
    //this.registerPush();

    this.events.subscribe('user:displayName updated', (nickname) => {
      this.username = nickname;
    });
    
    this.pages = [
      { title: 'Set Online', component: 'SetOnlinePage' }
    ];
  }

  /**
   * Open page according to selection.
   * @param page Page to push.
   */
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  /**
   * Signout user.
   */
  logout() {
    this.authenticationProvider.signOut()
      .then(() => this.nav.setRoot('LoginPage'));
  }

  /**
   * Initialize application according to tocken available.
   */
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      cordova.plugins.Keyboard.disableScroll(true);

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loghandlingProvider.changeDebuggingState(true);

      this.platform.registerBackButtonAction(() => {
          // get current active page
          let view = this.nav.getActive();
          if(this.nav.canGoBack()){
            this.nav.pop();
            if (view.component.name == "ChatMessagePage" || view.component.name == "ParsonalchatPage" ||
            view.component.name == "OneTwoOnePage") {
              this.loghandlingProvider.showLog(this.TAG,'set root from component');
              let loading = this.loadingController.create();
              loading.present();
              this.nav.setRoot("TabsPage");
              loading.dismiss();
            }
          } else{
            this.platform.exitApp();
          }
        });
      });

    let loading = this.loadingController.create();
    this.authenticationProvider.getAuthenticationStatus()
      .map(state => !!state)
      .subscribe(authenticated => {
        loading.dismiss();
        this.username = this.localstorageProvider.getUsername();
        this.rootPage = (authenticated) ? 'TabsPage' : 'LoginPage';
      }, (error) => {
        loading.dismiss();
        this.rootPage = 'LoginPage';
        this.loghandlingProvider.showLog(this.TAG,'Error: ' + JSON.stringify(error));
      });
  }

  /**
   * register push notification.
   */
  /*registerPush(){

      const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {console.log('Received a notification', notification)});

    pushObject.on('registration').subscribe((registration: any) => {console.log('Device registered', registration)});

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }*/
}

