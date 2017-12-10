import { Injectable } from '@angular/core';

import { ConstantProvider } from '../constant/constant';
import { LoghandlingProvider } from '../loghandling/loghandling';

/*
  Generated class for the LocalstorageProvider provider.

  Local storage handling for app.
*/
@Injectable()
export class LocalstorageProvider {

  private TAG:string = "LocalstorageProvider";

  constructor(private loghandlingProvider: LoghandlingProvider) {
    
  }

  public getUsername() {
    let username = localStorage.getItem(ConstantProvider.KEY_USERNAME);
    if (username === null || username === undefined) {
      return "";
    }
    return username;
  }

  public setUsername(username) {
    this.loghandlingProvider.showLog(this.TAG, username + ' as username stored');
    localStorage.setItem(ConstantProvider.KEY_USERNAME, username);
  }

  public getEmail() {
    let email = localStorage.getItem(ConstantProvider.KEY_EMAIL);
    if (email === null || email === undefined) {
      return "";
    }
    return email;
  }

  public setEmail(email) {
    this.loghandlingProvider.showLog(this.TAG, email + ' as email stored');
    localStorage.setItem(ConstantProvider.KEY_EMAIL, email);
  }
}
