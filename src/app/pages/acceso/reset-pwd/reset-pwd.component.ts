import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { errModel_Interface, RESTService_Response_Interface } from 'src/app/interfaces/interfaces.index';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WsStampingSATService } from 'src/app/services/service.index';
import { HttpErrorResponse } from '@angular/common/http';

declare const $: any;

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPWDComponent implements OnInit {

  token: string = null;
  
  err: errModel_Interface = {
    err: false
  };

  loaded: boolean= false;

  frm: FormGroup;
  submitted = false;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private wsStampingSATService: WsStampingSATService
  ) { 
    $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
  }

  ngOnInit() {
    this.token = this.activatedRouter.snapshot.paramMap.get('token');    
    if (!this.token){
      this.err.err = true;
      this.err.msg = 'Token no especificado.';
    } else {
      this.frm = new FormGroup({
        contrasenia: new FormControl( '',[ Validators.required, Validators.minLength(8) ] ),
        contraseniaConfirm: new FormControl( '',[ Validators.required, Validators.minLength(8) ] ),
      }, { validators: [ 
        this.contraseniasMatch( 'contrasenia', 'contraseniaConfirm' )
      ] });
    }
    
    this.loaded = true;
    $.LoadingOverlay("hide");
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

  cancelEvt(){
    
    Swal.fire({
      title: 'Favor de confirmar',
      text: "Cancelar recuperación de contraseña",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        $('#frm').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
        this.router.navigate( ['/'] );    
      }
    });
  }

  onSubmit(): void{

    this.submitted = true;
    this.err.err = false;
    
    if (!this.frm.valid)
      return;

    $('#frm').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});
    this.frm.disabled;

    this.wsStampingSATService.changePassword(
      this.token,
      this.frm.value.contrasenia)
    .subscribe( ( response: boolean) => {

      this.err.err = !response;
      this.err.msg = !response ? 'Error al intentar restaurar contraseña, <strong>favor de intentarlo de nuevo.</strong>' : '';

      this.router.navigate( [ 'acceso/logIn' ], { queryParams: { changePassword : true } } );
      
    },
    ( error: HttpErrorResponse ) => {
      
      this.err.err = true;

      if (error.error.RESTService){
        const restServiceResponse: RESTService_Response_Interface = error.error.RESTService;
        this.err.msg = restServiceResponse.Message;
      } else {
        this.err.msg = error.message;
      }

      $('#frm').LoadingOverlay("hide");

    });

  }

}
