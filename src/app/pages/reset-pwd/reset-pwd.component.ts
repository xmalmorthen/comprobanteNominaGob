import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { errModel_Interface } from 'src/app/interfaces/interfaces.index';
import Swal from 'sweetalert2';

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

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
  ) { 
    $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
  }

  ngOnInit() {
    this.token = this.activatedRouter.snapshot.paramMap.get('token');    
    if (!this.token){
      this.err.err = true;
      this.err.msg = 'Token no especificado.';
    }
    
    this.loaded = true;
    $.LoadingOverlay("hide");
  }

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

}
