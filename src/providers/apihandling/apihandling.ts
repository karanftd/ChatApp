import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LoghandlingProvider } from '../loghandling/loghandling';

/*
  Generated class for the RestapiServiceProvider provider.
  RestapiServiceProvider contains all http request handling service for other stuff.
*/
@Injectable()
export class ApihandlingProvider {

  private TAG: string = "ApihandlingProvider";

  /**
   * RestapiServiceProvider constructor for initial stuff handling.
   * @param http Http instance to handle all requests and responces. 
   * @param logServiceProvider log service provider for log generation.
   */
  constructor(private http: Http, private loghandlingProvider: LoghandlingProvider) {
    this.loghandlingProvider.showLog(this.TAG, 'Hello RestapiServiceProvider Provider');
  }

  /**
   * This method handle http request from different apis. 
   * @param url URL value for request generation
   */
  callRequest(url: string)
  {
    this.loghandlingProvider.showLog(this.TAG, "from request method");
    return  this.http.request(url)
            .do((res : Response ) => this.loghandlingProvider.showLog(this.TAG, res.json()))
            .map((res : Response ) => res.json())
            .catch(error => error);
  }

  /**
   * This method handle get http request from different apis. 
   * @param url URL value for request generation
   */
  callGetRequest(url: string)
  {
    this.loghandlingProvider.showLog(this.TAG, "from get request method");
    return  this.http.get(url)
            .do((res : Response ) => this.loghandlingProvider.showLog(this.TAG, res.json()))
            .map((res : Response ) => res.json())
            .catch(error => error);
  }

  /**
   * This method handle post http request from different apis.
   * @param url URL value for request generation
   * @param data contains value need to pass with request.
   */
  callPostRequest(url: string, data: any)
  {
     return  this.http.post(url, data)
             .do((res : Response ) => this.loghandlingProvider.showLog(this.TAG, res.json()))
             .map((res : Response ) => res.json())
             .catch(error => error);
  }

  /**
   * Generate header for http request.
   */
  getHeader(){
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    //set some param using set method i.e authorization token.
    return header;
  }

}