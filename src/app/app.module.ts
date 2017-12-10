import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { config } from './app.firebaseconfig';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';

import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AlerthandlingProvider } from '../providers/alerthandling/alerthandling';
import { LoghandlingProvider } from '../providers/loghandling/loghandling';
import { ConstantProvider } from '../providers/constant/constant';
import { ApihandlingProvider } from '../providers/apihandling/apihandling';
import { LocalstorageProvider } from '../providers/localstorage/localstorage';
import { ContactslistProvider } from '../providers/contactslist/contactslist';
import { ChathandlingProvider } from '../providers/chathandling/chathandling';
import { EmojiProvider } from '../providers/emojiprovider/emojiprovider';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    AlerthandlingProvider,
    LoghandlingProvider,
    ConstantProvider,
    Facebook,
    Keyboard,
    ApihandlingProvider,
    AngularFireAuth,
    LocalstorageProvider,
    ContactslistProvider,
    ChathandlingProvider,
    EmojiProvider
  ]
})
export class AppModule {}
