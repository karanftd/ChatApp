import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeAudio } from '@ionic-native/native-audio';

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
import { AutoSizeDirective } from '../directives/auto-size/auto-size';
import { MessageimagehandlerProvider } from '../providers/messageimagehandler/messageimagehandler';
import { OnlineHandlingProvider } from '../providers/online-handling/online-handling';
import { Push } from "@ionic-native/push";
import { ActionSheetProvider } from '../providers/action-sheet/action-sheet';
import { VideocallProvider } from '../providers/videocall/videocall';

@NgModule({
  declarations: [
    MyApp,
    AutoSizeDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
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
    GooglePlus,
    Keyboard,
    Camera,
    Push,
    GoogleMaps,
    NativeAudio,
    ApihandlingProvider,
    AngularFireAuth,
    LocalstorageProvider,
    ContactslistProvider,
    ChathandlingProvider,
    EmojiProvider,
    MessageimagehandlerProvider,
    OnlineHandlingProvider,
    ActionSheetProvider,
    VideocallProvider,
  ]
})
export class AppModule {}
