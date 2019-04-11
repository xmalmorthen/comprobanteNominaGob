import { Injectable } from '@angular/core';
import { WsStampingSATService } from './ws-stamping-sat.service';

import * as moment from 'moment';

// INERFACES
import { logIn_Interface, getAccess_Response_Interface } from '../interfaces/interfaces.index';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LogInService {

  public loginModel: logIn_Interface; 

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private router: Router
  ) { 

    this.makeSessionModel();

  }

  private makeSessionModel() : void {

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

  register ( sessionUserData: getAccess_Response_Interface, user: string ): void {
      localStorage.setItem('sessionUserData', JSON.stringify(sessionUserData) );
      this.loginModel = {
        logged: true,
        expired: false,
        token: sessionUserData.token,
        user: user,
        fCreated: sessionUserData.fCreated,
        fExpired: sessionUserData.fExpired
      };
  }

  async sessionActive () {

    if (!this.loginModel.logged)
      return false;

    const response = await this.wsStampingSATService.checkSession(this.loginModel.token).toPromise();
    if (response){
      this.wsStampingSATService.recicleSession(this.loginModel.token)
        .subscribe( ( response: getAccess_Response_Interface ) => {
          localStorage.setItem('sessionUserData', JSON.stringify(response) );
          this.makeSessionModel();
        });
    }
    return response;
  }

  logOut (){
    localStorage.removeItem('sessionUserData');
    this.makeSessionModel();
    this.router.navigate( [ 'logIn' ] );
  }

}
