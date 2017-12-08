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
   * @param alertController AlertController for create alert
   * @param logServiceProvider log handling service instance.
   */
  constructor(
    private alertController: AlertController, 
    private loghandlingProvider: LoghandlingProvider) {
    this.loghandlingProvider.showLog(this.TAG,'Constructor UtilityServiceProvider Provider');
  }

   /**
   * Dispaly default Alert for any message, response or erroe with 'OK' button etc.
   * @param message value to display as message in alert dialog.
   */
  public presentAlert(title: string, message: string) {
    this.alert = this.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    this.alert.present();
  }

  public confirmAlert(title: string, message: string) {
    return new Promise((resolve, reject) => {
      let alert = this.alertController.create({
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

  public editAlert(title: string, inputName: string, inputPlaceholder: string)
  {
    return new Promise((resolve, reject) => {
      let alert = this.alertController.create({
        title: title,
        inputs: [{
          name: inputName,
          placeholder: inputPlaceholder
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            reject("");
          }
        },
        {
          text: 'Edit',
          handler: data => {
            resolve(data);
          }
        }]
      });
      alert.present();
    });
  }

}
