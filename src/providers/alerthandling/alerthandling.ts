import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';

import { LoghandlingProvider } from '../loghandling/loghandling';

/*
  Generated class for the AlerthandlingProvider provider.

  AlerthandlingProvider contains all alert handling methods.
*/
@Injectable()
export class AlerthandlingProvider {

  loader: any;
  alert: any;
  private TAG:string = "AlerthandlingProvider";

  /**
   * Constructor of AlerthandlingProvider for basic initialisation stuff.
   * @param alertCtrl AlertController for create alert
   * @param logServiceProvider log handling service instance.
   */
  constructor(private alertCtrl: AlertController, private loghandlingProvider: LoghandlingProvider) {
    this.loghandlingProvider.showLog(this.TAG,'Constructor UtilityServiceProvider Provider');
  }

   /**
   * Dispaly default Alert for any message, response or erroe with 'OK' button etc.
   * @param message value to display as message in alert dialog.
   */
  public presentAlert(title: string, message: string) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    this.alert.present();
  }

  public confirmAlert(title: string, message: string) {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: 'Confirm',
            handler: () => {
              resolve(true);
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              alert.dismiss();
              reject(false);
            }
          }
        ]
      });
      alert.present();
    });
  }

}
