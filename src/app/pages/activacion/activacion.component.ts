import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// SERVICES
import { WsStampingSATService } from 'src/app/services/service.index';

// INTERFACES
import { getAccess_Response_Interface, getActivationToken_Response_Interface, RESTService_Response_Interface, errModel_Interface } from 'src/app/interfaces/interfaces.index';

declare const $: any;

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

  token: string = null;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private wsStampingSATService: WsStampingSATService
  ) {}

  ngOnInit() {

    this.token = this.activatedRouter.snapshot.paramMap.get('token');    

    if (!this.token){
      if (this.tokenRef) {
        this.frm = new FormGroup({
          correo: new FormControl( 'xmal.morthen@gmail.com', [ Validators.required, Validators.email ]),
          correoConfirm: new FormControl ( 'xmal.morthen@gmail.com', [ Validators.required, Validators.email ]),
          contrasenia: new FormControl( '..121212qw',[ Validators.required, Validators.minLength(8) ] ),
          contraseniaConfirm: new FormControl( '..121212qw',[ Validators.required, Validators.minLength(8) ] ),
        }, { validators: [ 
                this.correosMatch( 'correo', 'correoConfirm' ),
                this.contraseniasMatch( 'contrasenia', 'contraseniaConfirm' )
              ] });
      } else {
        this.err.err = true;
        this.err.msg = 'Token de acceso no especificado.';
      }
    } else {
      // verificar que existe token

      this.wsStampingSATService.activateAccessToken( this.token )
      .subscribe ( (response: getActivationToken_Response_Interface) => {

        debugger;

        this.err.err = false;
        this.err.msg = 'Activación de acceso a la plataforma realizada y concluida con éxito.';

        this.router.navigate( [ '/logIn' ], { queryParams: { activationToken : this.err.err } } );

      },
      ( error: HttpErrorResponse ) => {

        this.err.err = true;

        /*if (error.error.RESTService){
          const restServiceResponse: RESTService_Response_Interface = error.error.RESTService;
          this.err.msg = restServiceResponse.Message;
        } else {
          this.err.msg = error.message;
        }*/

        this.router.navigate( [ '/logIn' ], { queryParams: { activationToken : this.err.err } } );

      });
      
    }
    
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
