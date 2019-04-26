import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


// SERVICES INDEX
import { WsStampingSATService, LogInService } from 'src/app/services/service.index';
import { getEmisores_Response_Interface, getAccess_Response_Interface, responseService_Response_Interface, RESTService_Response_Interface, recaptchaModel_Interface } from 'src/app/interfaces/interfaces.index';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

declare const $: any;
declare interface errModel_Interface {
  err: boolean;
  msg?: string;  
}

declare interface rememberModel_Interface {
  adscripcion: string;
  usuario: string;
  numtrabajador: string;
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem; 

  recaptchaModel: recaptchaModel_Interface = {
    loaded: false,
    ready: false,
    success: false
  }

  siteKey: string= null;

  loaded: boolean= false;

  frm: FormGroup;
  submitted = false;

  err: errModel_Interface = {
    err: false
  };
    
  adscripcion: Observable< getEmisores_Response_Interface[] >
  emisoreSelected;

  constructor(
    private router: Router,
    private wsStampingSATService: WsStampingSATService,
    private logInService: LogInService
  ) {     
    $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
    
    this.adscripcion = this.getEmisoresList();

    this.siteKey = environment.recaptcha.siteKey
  }

  ngOnInit() {

    let remeberSession: rememberModel_Interface = null;
    if (localStorage.getItem('remember')){
      remeberSession = <rememberModel_Interface>JSON.parse(localStorage.getItem('remember'));
    }

    this.frm = new FormGroup({
      adscripcion: new FormControl( remeberSession ? remeberSession.adscripcion : '', [ Validators.required ]),
      usuario: new FormControl( remeberSession ? remeberSession.usuario : '', [ Validators.required, Validators.minLength(12)] ),
      numtrabajador: new FormControl( remeberSession ? remeberSession.numtrabajador : '', Validators.required),
      recaptcha: new FormControl(),
      remember: new FormControl( remeberSession ? true : false )
    });

    this.loaded = true;
    $.LoadingOverlay("hide");
  }

  private getEmisoresList() : Observable< getEmisores_Response_Interface[] > {
    return this.wsStampingSATService.emisores()
      .pipe(
        map( (response: getEmisores_Response_Interface[]) => {
          let dataParsed: any = [];
          response.forEach(item => {
            dataParsed.push( { 'id': item.rfc, 'name': item.nombre } );
          });
          
          return dataParsed;
        })
      );
  }

  get f(): any { return this.frm.controls; }
  
  onSubmit(): void{

    this.submitted = true;
    this.err.err = false;
    
    if (!this.frm.valid)
      return;

    $('#frmLogin').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});
    this.frm.disabled

    if (this.recaptchaModel.ready)
      this.captchaElem.execute();
  }

  recaptchaHandleLoad (evt): void{
    this.recaptchaModel.loaded= true;
  }
  
  recaptchaHandleReady (evt): void{
    this.recaptchaModel.ready= true;
  }

  recaptchaHandleSuccess (token: string): void {
    this.wsStampingSATService.getAccess(
      this.frm.value.usuario,
      this.frm.value.numtrabajador,
      this.frm.value.adscripcion
    )
      .subscribe( ( response: getAccess_Response_Interface) => {

        this.logInService.register( response, this.frm.value.usuario );

        if (this.frm.value.remember) {
          const remeberSession: rememberModel_Interface = {
            adscripcion: this.frm.value.adscripcion,
            usuario: this.frm.value.usuario,
            numtrabajador: this.frm.value.numtrabajador
          }
          localStorage.setItem('remember',JSON.stringify(remeberSession));
        } else 
          localStorage.removeItem('remember');

        this.router.navigate( ['/principal'] );

      },
      ( error: HttpErrorResponse ) => {
        this.err.err = true;

        if (error.error.RESTService){
          const restServiceResponse: RESTService_Response_Interface = error.error.RESTService;
          this.err.msg = restServiceResponse.Message;
        } else {
          this.err.msg = error.message;
        }

        this.captchaElem.resetCaptcha();

        $('#frmLogin').LoadingOverlay("hide");
      });

  }
  
  recaptchaHandleError (evt): void{
    this.recaptchaModel.err= true;
  }

  recaptchaHandleReset (evt): void{
    this.recaptchaModel.success= false;
  }

}
