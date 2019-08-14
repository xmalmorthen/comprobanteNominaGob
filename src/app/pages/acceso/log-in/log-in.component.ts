import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

import * as activationToken from 'src/assets/templates/mail/activationToken.json';
import * as rememberPWD from 'src/assets/templates/mail/rememberPWD.json';

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
  @ViewChild('submitFrm') submitFrm: ElementRef;
  
  recaptchaModel: recaptchaModel_Interface = {
    loaded: false,
    ready: false,
    success: false,
    err: false
  }

  siteKey: string= null;

  loaded: boolean= false;

  frm: FormGroup;
  frmContrasenia: FormGroup;
  submitted = false;
  submittedPass = false;

  err: errModel_Interface = {
    err: false
  };

  activationErr: activationErrModel_Interface = {
    err: false
  }

  isActive: boolean = false;

  activationToken: boolean= null;
  changePassword: boolean= false;

  activationSuccessModel: getActivationToken_Response_Interface = null;
    
  adscripcion: Observable< getEmisores_Response_Interface[] >
  emisoreSelected;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wsStampingSATService: WsStampingSATService,
    private gobMailSenderService: GobMailSenderService,
    private logInService: LogInService,
    private cdr: ChangeDetectorRef
  ) {     
    $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
    
    this.adscripcion = this.getEmisoresList();

    this.siteKey = environment.recaptcha.siteKey
  }

  ngOnInit() {
    
    if (this.route.snapshot.queryParamMap.get('activationToken') != null)
      this.activationToken = Boolean(this.route.snapshot.queryParamMap.get('activationToken'));

    if (this.route.snapshot.queryParamMap.get('changePassword') != null)
      this.changePassword = Boolean(this.route.snapshot.queryParamMap.get('changePassword'));

    let remeberSession: rememberModel_Interface = null;
    if (localStorage.getItem('remember')){
      remeberSession = <rememberModel_Interface>JSON.parse(localStorage.getItem('remember'));
    }

    this.frm = new FormGroup({
      adscripcion: new FormControl( remeberSession ? remeberSession.adscripcion : '', [ Validators.required ]),
      usuario: new FormControl( remeberSession ? remeberSession.usuario : '', [ Validators.required, Validators.minLength(13)] ),
      numtrabajador: new FormControl( remeberSession ? remeberSession.numtrabajador : '', Validators.required),
      recaptcha: new FormControl(),
      remember: new FormControl( remeberSession ? true : false )
    });    

    this.loaded = true;
    $.LoadingOverlay("hide");    
  }

  ngAfterViewInit () {
    if (this.frm.valid){
      this.submitFrm.nativeElement.focus();
      this.cdr.detectChanges();
    }
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
  get fc(): any { return this.frmContrasenia.controls; }
  
  async onSubmit(){

    this.submitted = true;
    this.err.err = false;
    this.activationSuccessModel = null;
    
    if (!this.frm.valid)
      return;

    if (this.recaptchaModel.ready) {
      
      $('#frmLogin').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

      const fncCaptchaExecute = () => {
        this.captchaElem.execute();
      }

      const resultCaptchaExecute = await fncCaptchaExecute();
      $('#frmLogin').LoadingOverlay("hide");  

    }

  }

  recaptchaHandleLoad (evt): void{
    this.recaptchaModel.loaded= true;
  }
  
  recaptchaHandleReady (evt): void{
    this.recaptchaModel.ready= true;
  }

  recaptchaHandleSuccess (token: string): void {

    if (!token) {
      $('#frmLogin').LoadingOverlay("hide");
      return;
    }

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
            this.isActive = true;

          break;          
          case '2': //requiere generar token de activación        
          case '3': //requiere activar token

            this.activationErr.err = true;
            this.captchaElem.resetCaptcha();

          break;
        }

        this.activationErr.code = Number(response.RESTService.StatusCode);
        this.activationErr.msg = <getAccess_Response_Interface>response.Response;
        $('#frmLogin').LoadingOverlay("hide");

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

  recaptchaHandleExpire (evt): void {
    this.recaptchaModel.ready = false;
    this.captchaElem.reloadCaptcha();
  }

  recaptchaHandleReset (evt): void{
    this.recaptchaModel.success= false;
  }

  activationSuccess ( evt ): void { 
    
    this.activationSuccessModel = evt;
    this.sendMail( this.activationSuccessModel.EmpleadoRef, this.activationSuccessModel.TokenRef );
    
  }

  resend: boolean= false;
  resendMail( evt: any, empleadoRef: EmpleadoRef_getAccess_Response_Interface, tokenRef: Token_getAccess_Response_Interface): void{
    evt.preventDefault();
    this.sendMail( empleadoRef, tokenRef);
  }

  sendMail(empleado: EmpleadoRef_getAccess_Response_Interface, token: Token_getAccess_Response_Interface): void {
    
    $('#frmLogin').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

    const mailTemplate = activationToken.v1;
    const nombre = empleado.primerApellido + ' ' + ( empleado.segundoApellido ? empleado.segundoApellido + ' ' : '') + empleado.nombres;
    const linkRef = `${location.origin}${location.pathname}#/acceso/activacion/${token.token}`;
    const logoRef = `${location.origin}${location.pathname}assets/images/logoMailHeader.png`;
    let templateParsed = mailTemplate.split('{{LINK}}').join(linkRef);
    templateParsed = templateParsed.split('{{LOGO}}').join(logoRef);
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

        this.resend = true;

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

  actualizationPWD: Boolean = false;
  rememberPWD( evt: any, modelRef: getAccess_Response_Interface){
    $('#frmPass').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

    const mailTemplate = rememberPWD.v1;
    const nombre = modelRef.EmpleadoRef.primerApellido + ' ' + ( modelRef.EmpleadoRef.segundoApellido ? modelRef.EmpleadoRef.segundoApellido + ' ' : '') + modelRef.EmpleadoRef.nombres;
    const linkRef = `${location.origin}${location.pathname}/#/acceso/nuevaContrasenia/${modelRef.TokenAccess.token}`;
    const logoRef = `${location.origin}${location.pathname}assets/images/logoMailHeader.png`;
    let templateParsed = mailTemplate.split('{{LINK}}').join(linkRef);
    templateParsed = templateParsed.split('{{LOGO}}').join(logoRef);
    templateParsed = templateParsed.split('{{NOMBRE}}').join(nombre);

    this.gobMailSenderService.sendMail( 
      modelRef.EmpleadoRef.correo,
      'Gobierno Colima - Actualización de contraseña de acceso a plataforma [ Comprobantes de Nómina ]',
      templateParsed).subscribe ( (response: Boolean) => {

        this.actualizationPWD = true;
        this.isActive = false;
        $('#frmPass').LoadingOverlay("hide");

      },
      ( error: HttpErrorResponse ) => {

        this.actualizationPWD = false;
        $('#frmPass').LoadingOverlay("hide");

      });

  }

  onSubmitPass(): void {

    this.submittedPass = true;

    if (!this.frmContrasenia.valid)
      return;

    this.frmContrasenia.disabled;
    $('#frmPass').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

    const empleadoRef = <EmpleadoRef_getAccess_Response_Interface>(<getAccess_Response_Interface>this.activationErr.msg).EmpleadoRef;

    this.wsStampingSATService.getAccess(
      empleadoRef.rfc,
      empleadoRef.noCtrl,
      empleadoRef.emisorRFC,
      this.frmContrasenia.value.contrasenia
    )
      .subscribe( ( response: responseService_Response_Interface) => {

        this.logInService.register( <getAccess_Response_Interface>response.Response );

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

        $('#frmPass').LoadingOverlay("hide");
      });
  }

}
