import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getAccess_Response_Interface, Token_getAccess_Response_Interface, getActivationToken_Response_Interface, RESTService_Response_Interface } from 'src/app/interfaces/interfaces.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WsStampingSATService } from 'src/app/services/service.index';
import { HttpErrorResponse } from '@angular/common/http';

declare const $: any;

declare interface errModel_Interface {
  err: boolean;
  msg?: string;  
}

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.component.html',
  styleUrls: ['./activacion.component.scss']
})

export class ActivacionComponent implements OnInit {

  @Input() tokenRef: getAccess_Response_Interface = null;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() success: EventEmitter<getActivationToken_Response_Interface> = new EventEmitter();

  frm: FormGroup;
  submitted = false;

  err: errModel_Interface = {
    err: false
  };

  constructor(
    private wsStampingSATService: WsStampingSATService
  ) {}

  ngOnInit() {
    // this.tokenRef = {
    //   id : '1',
    //   token: 'BB0F4984-D8EC-4265-895C-FDC01B6AED6A',
    //   emp: 877,
    //   primerApellido: 'Rueda',
    //   segundoApellido: 'Aguilar',
    //   nombres: 'Miguel Angel'
    // }

    this.frm = new FormGroup({
      correo: new FormControl( '', [ Validators.required, Validators.email ]),
      correoConfirm: new FormControl ( '', [ Validators.required, Validators.email ]),
      contrasenia: new FormControl( '',[ Validators.required, Validators.minLength(8) ] ),
      contraseniaConfirm: new FormControl( '',[ Validators.required, Validators.minLength(8) ] ),
    }, { validators: [ 
            this.correosMatch( 'correo', 'correoConfirm' ),
            this.contraseniasMatch( 'contrasenia', 'contraseniaConfirm' )
          ] });
    
  }

  correosMatch( ctrl1: string, ctrl2: string){
    return ( group: FormGroup ) => {

      const corr1 = group.controls[ctrl1].value;
      const corr2 = group.controls[ctrl2].value;
      
      if (corr1 == corr2)
        return null;
      else
        return {
          correosMatch: true
        }
    }
  }

  contraseniasMatch( ctrl1: string, ctrl2: string){
    return ( group: FormGroup ) => {

      const corr1 = group.controls[ctrl1].value;
      const corr2 = group.controls[ctrl2].value;
      
      if (corr1 == corr2)
        return null;
      else
        return {
          contraseniasMatch: true
        }
    }
  }

  get f(): any { return this.frm.controls; }

  onSubmit(): void{

    this.submitted = true;
    this.err.err = false;
    
    if (!this.frm.valid)
      return;

    $('#frmActivation').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});
    this.frm.disabled;

    this.wsStampingSATService.getActivationToken(
      this.tokenRef.EmpleadoRef.rfc,
      this.tokenRef.EmpleadoRef.noCtrl,
      this.tokenRef.EmpleadoRef.emisorRFC,
      this.frm.value.contrasenia,
      this.frm.value.correo)
    .subscribe( ( tokenResponse: getActivationToken_Response_Interface) => {

      this.success.emit( tokenResponse );

    },
    ( error: HttpErrorResponse ) => {

      if (error.error.RESTService){
        const restServiceResponse: RESTService_Response_Interface = error.error.RESTService;
        this.err.msg = restServiceResponse.Message;
      } else {
        this.err.msg = error.message;
      }

    });

  }

  cancelEvt(evt): void{
    this.cancel.emit( true );
  }

}
