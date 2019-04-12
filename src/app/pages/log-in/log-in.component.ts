import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component/public_api';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

// SERVICES INDEX
import { WsStampingSATService, LogInService } from 'src/app/services/service.index';
import { getEmisores_Response_Interface, getAccess_Response_Interface, responseService_Response_Interface, RESTService_Response_Interface } from 'src/app/interfaces/interfaces.index';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare const $: any;
declare interface errModel_Interface {
  err: boolean;
  msg?: string;  
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  frm: FormGroup;
  submitted = false;

  select2Value = '';

  err: errModel_Interface = {
    err: false
  };
  
  adscripcion: Select2Data = [];

  constructor(
    private router: Router,
    private wsStampingSATService: WsStampingSATService,
    private logInService: LogInService
  ) { 
    this.getEmisoresList()
      .subscribe ( (response: any[]) =>{
        this.adscripcion = response;
      },
      ( error: HttpErrorResponse ) =>{});
  }

  ngOnInit() {
    this.frm = new FormGroup({
      adscripcion: new FormControl('', [ Validators.required ]),
      usuario: new FormControl('', [ Validators.required, Validators.minLength(12)] ),
      numtrabajador: new FormControl('', Validators.required)
    });
  }

  private getEmisoresList() : Observable< getEmisores_Response_Interface[] > {
    return this.wsStampingSATService.emisores()
      .pipe(
        map( (response: getEmisores_Response_Interface[]) => {
          let dataParsed: any = [];
          response.forEach(item => {
            dataParsed.push( { 'value': item.rfc, 'label': item.nombre } );
          });
          return dataParsed;
        })
      );
  }

  get f(): any { return this.frm.controls; }

  searchAdscripcion(txt: string){
    this.getEmisoresList()
      .subscribe ( (response: any[]) =>{
        this.adscripcion = txt ? response.filter( qry => qry.label.toLowerCase().indexOf(txt.toLowerCase()) > -1) : response;
      },
      ( error: HttpErrorResponse ) =>{});
  }

  openAdscripcion(): void{
    this.getEmisoresList()
      .subscribe ( (response: any[]) =>{
        this.adscripcion = response;
      },
      ( error: HttpErrorResponse ) =>{});
  }

  onSubmit(): void{

    this.submitted = true;
    this.err.err = false;
    
    if (!this.frm.valid)
      return;

    $('#frmLogin').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
    this.frm.disabled

    this.wsStampingSATService.getAccess(
      this.frm.value.usuario,
      this.frm.value.numtrabajador,
      this.frm.value.adscripcion
    )
      .subscribe( ( response: getAccess_Response_Interface) => {

        this.logInService.register( response, this.frm.value.usuario );
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

        $('#frmLogin').LoadingOverlay("hide");
      });
  }

}
