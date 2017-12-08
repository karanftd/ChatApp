import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';

import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AlerthandlingProvider } from '../providers/alerthandling/alerthandling';
import { LoghandlingProvider } from '../providers/loghandling/loghandling';
import { ConstantProvider } from '../providers/constant/constant';

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    AlerthandlingProvider,
    LoghandlingProvider,
    ConstantProvider
  ]
})
export class AppModule {}
