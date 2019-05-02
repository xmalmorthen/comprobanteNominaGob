import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';

import * as mailTemplates from '../../templates/mail/v1.json';

// SERVICES INDEX
import { WsStampingSATService, LogInService, GobMailSenderService } from 'src/app/services/service.index';
import { getEmisores_Response_Interface, getAccess_Response_Interface, responseService_Response_Interface, RESTService_Response_Interface, recaptchaModel_Interface, getActivationToken_Response_Interface, EmpleadoRef_getAccess_Response_Interface, Token_getAccess_Response_Interface, errModel_Interface } from 'src/app/interfaces/interfaces.index';

declare const $: any;

declare interface activationErrModel_Interface {
  err: boolean;
  code?: number;
  msg?: getAccess_Response_Interface | string;
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
  frmContrasenia: FormGroup;
  submitted = false;

  err: errModel_Interface = {
    err: false
  };

  activationErr: activationErrModel_Interface = {
    err: false
  }

  isActive: boolean = false;

  activationToken: boolean= null;

  activationSuccessModel: getActivationToken_Response_Interface = null;
    
  adscripcion: Observable< getEmisores_Response_Interface[] >
  emisoreSelected;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wsStampingSATService: WsStampingSATService,
    private gobMailSenderService: GobMailSenderService,
    private logInService: LogInService
  ) {     
    $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
    
    this.adscripcion = this.getEmisoresList();

    this.siteKey = environment.recaptcha.siteKey
  }

  ngOnInit() {
    
    if (this.route.snapshot.queryParamMap.get('activationToken') != null)
      this.activationToken = Boolean(this.route.snapshot.queryParamMap.get('activationToken'));

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
    this.activationSuccessModel = null;
    
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
      .subscribe( ( response: responseService_Response_Interface) => {

        switch (response.RESTService.StatusCode) {
          //acceso concedido                    
          case '1':

            this.frmContrasenia = new FormGroup({
              contrasenia: new FormControl( '', [ Validators.required, Validators.minLength(8) ])
            });

            this.activationErr.err = false;
            this.activationErr.code = 1;
            this.isActive = true;
            $('#frmLogin').LoadingOverlay("hide");
            
            // this.logInService.register( <getAccess_Response_Interface>response.Response , this.frm.value.usuario );

            // if (this.frm.value.remember) {
            //   const remeberSession: rememberModel_Interface = {
            //     adscripcion: this.frm.value.adscripcion,
            //     usuario: this.frm.value.usuario,
            //     numtrabajador: this.frm.value.numtrabajador
            //   }
            //   localStorage.setItem('remember',JSON.stringify(remeberSession));
            // } else 
            //   localStorage.removeItem('remember');

            // this.router.navigate( ['/principal'] );

          break;
          //requiere generar token de activación
          case '2':

            this.activationErr.msg = <getAccess_Response_Interface>response.Response;
            this.activationErr.err = true;
            this.activationErr.code = 2;
            this.captchaElem.resetCaptcha();
            $('#frmLogin').LoadingOverlay("hide");

          break;
          //requiere activar token
          case '3':
            
            this.activationErr.err = true;
            this.activationErr.code = 3;
            this.activationErr.msg = <getAccess_Response_Interface>response.Response;
            this.captchaElem.resetCaptcha();
            $('#frmLogin').LoadingOverlay("hide");

          break;
        }

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

  activationSuccess ( evt ): void { 
    
    this.activationSuccessModel = evt;
    this.sendMail( this.activationSuccessModel.EmpleadoRef, this.activationSuccessModel.TokenRef );
    
  }

  resendMail( evt: any, empleadoRef: EmpleadoRef_getAccess_Response_Interface, tokenRef: Token_getAccess_Response_Interface): void{
    evt.preventDefault();

    this.sendMail( empleadoRef, tokenRef);
  }

  sendMail(empleado: EmpleadoRef_getAccess_Response_Interface, token: Token_getAccess_Response_Interface): void {
    
    $('#frmLogin').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

    const mailTemplate = mailTemplates.v1;
    const nombre = empleado.primerApellido + ' ' + ( empleado.segundoApellido ? empleado.segundoApellido + ' ' : '') + empleado.nombres;
    const linkRef = `${location.origin}/#/activacion/${token.token}`;
    let templateParsed = mailTemplate.split('{{LINK}}').join(linkRef);
    templateParsed = templateParsed.split('{{NOMBRE}}').join(nombre);

    this.gobMailSenderService.sendMail( 
      empleado.correo,
      'Gobierno Colima - Activación de acceso a plataforma [ Comprobantes de Nómina ]',
      templateParsed).subscribe ( (response: Boolean) => {

        if (response) {

          this.activationErr.err = false;
          this.activationErr.code = null;

        } else {

          this.activationErr.err = true;
          this.activationErr.code = 4;

        }

        this.activationSuccessModel = {
          EmpleadoRef: empleado,
          TokenRef: token
        }

        $('#frmLogin').LoadingOverlay("hide");

      },
      ( error: HttpErrorResponse ) => {

        this.activationErr.err = true;
        this.activationErr.code = 4;

        this.activationSuccessModel = {
          EmpleadoRef: empleado,
          TokenRef: token
        }

        $('#frmLogin').LoadingOverlay("hide");

      });

  }  

}
