import { Injectable } from '@angular/core';

import * as moment from 'moment';

// INERFACES
import { logIn_Interface, getAccess_Response_Interface } from '../interfaces/interfaces.index';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  public loginModel: logIn_Interface; 

  constructor() { 

    const sessionUserData: getAccess_Response_Interface = <getAccess_Response_Interface>JSON.parse(localStorage.getItem('sessionUserData'));
    if (sessionUserData)
      this.loginModel = {
        logged: true,
        expired: false,
        token: sessionUserData.token,
        fCreated: sessionUserData.fCreated,
        fExpired: sessionUserData.fExpired
      };
    else
      this.loginModel = {
        logged: false
      }
  }

  register ( sessionUserData: getAccess_Response_Interface ): void {
      localStorage.setItem('sessionUserData', JSON.stringify(sessionUserData) );
      this.loginModel = {
        logged: true,
        expired: false,
        token: sessionUserData.token,
        fCreated: sessionUserData.fCreated,
        fExpired: sessionUserData.fExpired
      };
  }

  sessionActive (): boolean {

    if (!this.loginModel.logged)
      return false;
        
    const fExpired = this.loginModel.fExpired;

    if (!moment(fExpired, "DD/MM/YYYY HH:mm:ss").isValid()){
      localStorage.removeItem('sessionUserData');
      return false;
    } else {
      const fExpiredParsed = moment(fExpired, "DD/MM/YYYY HH:mm:ss");
      const dateNow = moment();
      const isAfter = moment( dateNow ).isAfter( fExpiredParsed );

      if ( isAfter ){

        debugger;
        localStorage.removeItem('sessionUserData');
        return false;
        
      } else
        return true;
    }
  }

}
