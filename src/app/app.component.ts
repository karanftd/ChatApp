import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
   */
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, 
  private loghandlingProvider: LoghandlingProvider, private authenticationProvider: AuthenticationProvider,
  private loadingController: LoadingController, private localstorageProvider: LocalstorageProvider) {
    this.initializeApp();
    
    this.pages = [
      { title: 'Home', component: 'TabsPage' }
    ];
  }

  /**
   * Open page according to selection.
   * @param page Page to push.
   */
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
            let loading = this.loadingController.create();
            loading.present();
            this.nav.pop();
            if (view.component.name === "ChatMessagePage" || view.component.name === "ParsonalchatPage") {
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
}

