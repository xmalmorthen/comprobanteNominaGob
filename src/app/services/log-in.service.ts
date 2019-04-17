import { Injectable } from '@angular/core';
import { WsStampingSATService } from './ws-stamping-sat.service';

import * as moment from 'moment';
import Swal from 'sweetalert2';

// INERFACES
import { logIn_Interface, getAccess_Response_Interface } from '../interfaces/interfaces.index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';



@Injectable({
  providedIn: 'root'
})
export class LogInService {

  public loginModel: logIn_Interface; 
  private checkSessionExpiredInterval: any;

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private router: Router
  ) { 
    
    this.makeSessionModel();

    this.checkSessionExpired()
      .subscribe ( (response: boolean)=> {
        if (response)
          this.logOut();
      },
      (err) => {});
  }

  private makeSessionModel( sessionUserData: getAccess_Response_Interface= null) : void {

    sessionUserData= !sessionUserData ? <getAccess_Response_Interface>JSON.parse(localStorage.getItem('sessionUserData')) : sessionUserData;

    if (sessionUserData) {
      
      const fCreated = moment(sessionUserData.fRecicled ? sessionUserData.fRecicled : sessionUserData.fCreated, "DD/MM/YYYY HH:mm:ss A");
      const fExpired = moment(sessionUserData.fExpired, "DD/MM/YYYY HH:mm:ss A");
      const sessionTime = fExpired.diff( fCreated, 'seconds');

      sessionUserData.sessionTime= sessionTime;
      sessionUserData.remainSession= sessionTime;

      localStorage.setItem('sessionUserData', JSON.stringify(sessionUserData) );

      this.loginModel = {
        logged: true,
        expired: false,
        token: sessionUserData.token,
        fCreated: sessionUserData.fCreated,
        fRecicled: sessionUserData.fRecicled,
        fExpired: sessionUserData.fExpired,
        sessionTime: sessionTime,
        remainSession: sessionTime
      };
    }
    else
      this.loginModel = {
        logged: false
      }
  }

  register ( sessionUserData: getAccess_Response_Interface, user: string ): void {
    
    this.makeSessionModel( sessionUserData );

  }

  async sessionActive () {

    if (!this.loginModel.logged) {
      localStorage.removeItem('sessionUserData');
      return false;
    }

    const response = await this.wsStampingSATService.checkSession(this.loginModel.token).toPromise();
    
    if (response){
      this.wsStampingSATService.recicleSession(this.loginModel.token)
        .subscribe( ( response: getAccess_Response_Interface ) => {                    
          
          this.makeSessionModel( response );

        });
    } else {
      this.logOut();
    }
    return response;
  }

  checkSessionExpired(): Observable< boolean > {
    return new Observable ( observer => {
      this.checkSessionExpiredInterval = setInterval( () =>{
        
        const sessionUserData: getAccess_Response_Interface= <getAccess_Response_Interface>JSON.parse(localStorage.getItem('sessionUserData'));
        if (sessionUserData){

          const fCreated = moment(sessionUserData.fRecicled ? sessionUserData.fRecicled : sessionUserData.fCreated, "DD/MM/YYYY HH:mm:ss A");
          const fExpired = moment(sessionUserData.fExpired, "DD/MM/YYYY HH:mm:ss A");
          const sessionTime = fExpired.diff( fCreated, 'seconds');

          sessionUserData.remainSession -= 60;
          localStorage.setItem('sessionUserData', JSON.stringify(sessionUserData) );

          if( sessionUserData.remainSession == 120 ){
            
            let timerInterval;

            Swal.fire({                
                title: 'Sesión',
                html: "Está a punto de expirar la sesión por inactividad,<br> desea mantener la sesión activa?<br><br> Tiempo restante: <span class='swalSessionRemainTime'><strong></strong></span>",
                footer: "<div>Se perderá cualquier avance no guardado...</div>",
                type: 'question',
                allowOutsideClick : false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                timer: sessionUserData.remainSession * 1000,
                onBeforeOpen: ()=> {
                    timerInterval = setInterval(function() {
                        var content = Swal.getContent();
                        if (content) {
                            var timeLeft = (Swal.getTimerLeft() / 1000),
                                mitnutesLeft = Math.trunc(timeLeft / 60),
                                secondsLeft = Math.trunc(timeLeft % 60),
                                msgLeft = mitnutesLeft >= 1 ? (  mitnutesLeft.toString() + " minuto" + (mitnutesLeft > 1 ? 's':'') + ' ' + secondsLeft.toString() + " segundo" + (secondsLeft != 1 ? 's':'') ) : (  secondsLeft.toString() + " segundo" + (secondsLeft > 1 ? 's':'') );

                            try {
                              content.querySelector('strong').textContent = (msgLeft);
                            } catch (error) {}
                        }

                    }, 1000);
                },
                onClose: () => {
                    clearInterval(timerInterval);
                }
            }).then( (result)=> {
              if (result.value === true || result.value === undefined && result.dismiss === undefined){

                  this.sessionActive();
                                
              } else if (result.dismiss == Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.timer ) {
                  
                  this.logOut();

              }
            });

            observer.next (false);

          } else if ( sessionUserData.remainSession <= 0){
            this.logOut();
            Swal.fire( {
              title: 'Sesión',
              html: 'Su sesión expiró',
              type: 'info',
              allowOutsideClick : false,
              confirmButtonText: 'Aceptar'
            });

            observer.next (true);
            observer.complete();

          } else 
            observer.next (false);
        }
      },60000)
    });
  }

  logOut (){
    localStorage.removeItem('sessionUserData');
    this.makeSessionModel();
    this.router.navigate( [ 'logIn' ] );
  }

}
