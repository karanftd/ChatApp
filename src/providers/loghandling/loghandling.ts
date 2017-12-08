import { Injectable } from '@angular/core';

/*
  Generated class for the LoghandlingProvider provider.

  LoghandlingProvider handle console log for application.
*/
@Injectable()
export class LoghandlingProvider {

   private isDebugging: boolean = false;  // debugging state
   private TAG: string = "LoghandlingProvider"; //tag for log

  /**
   * Basic constructor for LogServiceProvider.
   */
  constructor() {
    this.showLog(this.TAG,'Hello LoghandlingProvider Provider');
  }

  /**
   * This method display console log from other pages and providers, if debugging active.
   * @param log value need display as log.
   */
  showLog(tag: string, log: string){
    if(this.isDebugging)
    {
      console.log(tag + " : " + log);
    }
  }

  /**
   * This method allow to change debugging state.
   * @param state boolean value having debugging state.
   */
  changeDebuggingState(state: boolean){
    this.isDebugging = state;
  }

}
