import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { titular_Interface, constanciaAnual, getComprobantesToken_Response_Interface, getAccess_Response_Interface } from 'src/app/interfaces/interfaces.index';
import { WsStampingSATService, LogInService } from 'src/app/services/service.index';

import { environment } from '../../../../../environments/environment';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit  {
  
  @ViewChild('tablaComprobantes') table;
  @ViewChild('counter') counterData;
  dataTable: any;
  dataTableObject: any;

  checkAll: boolean = false;
  itemsSelecteds: number = 0;

  comprobantesTitular: titular_Interface = {
    emisor: '',
    nombre: ''    
  };
  comprobantesList: getComprobantesToken_Response_Interface[] = [];

  constAnual: constanciaAnual[] = [];

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private logInService: LogInService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private orderPipe: OrderPipe
  ) {}

  ngOnInit() {
    
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});

    const sessionUserData: getAccess_Response_Interface = <getAccess_Response_Interface>JSON.parse(localStorage.getItem('sessionUserData'));
    
    this.comprobantesTitular.nombre = sessionUserData.EmpleadoRef.primerApellido + ' ' + ( sessionUserData.EmpleadoRef.segundoApellido ? sessionUserData.EmpleadoRef.segundoApellido + ' ' : '' ) + sessionUserData.EmpleadoRef.nombres;
    this.comprobantesTitular.emisor = sessionUserData.EmpleadoRef.emisor;

    this.wsStampingSATService.getComprobantes(this.logInService.loginModel.token)
      .subscribe( (response: getComprobantesToken_Response_Interface[]) => {
               
        this.comprobantesList = response;

        // this.comprobantesList = this.orderPipe.transform(response, 'id');

        this.chRef.detectChanges();

        moment.locale('es');
        $.fn.dataTable.moment( 'L', 'es');

        this.dataTableObject = this.dataTable.DataTable({
          "responsive": true,
          "pagingType": "simple",
          "language": {
            "url": "./assets/vendor/datatable/Spanish.txt"
          },
          "columnDefs": [
            {"orderable": false,"targets": [4,5]},
            { responsivePriority: 10001,  targets: 0 },
            { responsivePriority: 10002,  targets: 1 },
            { responsivePriority: 1,      targets: 2 },
            { responsivePriority: 10003,  targets: 3 },
            { responsivePriority: 2,      targets: 4 },
            { responsivePriority: 10001,  targets: -1 }
          ],
          "order" : [[0, 'desc']],
          // "stateSave": true,
          "stateSaveCallback": function(settings,data) {
              localStorage.setItem( 'DataTableState', JSON.stringify(data) )
          },
          "stateLoadCallback": function(settings) {
            return JSON.parse( localStorage.getItem( 'DataTableState' ) )
          },
          "initComplete": (settings, json) => {}});

          this.dataTable.LoadingOverlay("hide");
      },
      ( error: HttpErrorResponse ) =>{});

      sessionUserData.EmpleadoRef.noCtrl

      for (let index = environment.constanciaAnualInicio; index < (new Date()).getFullYear(); index++) {
        this.constAnual.push({
          noCtrl: sessionUserData.EmpleadoRef.noCtrl,
          rfc: sessionUserData.EmpleadoRef.rfc,
          anio: index
        });
      }

      console.log(this.constAnual);

  }  

  getPreview(evt, uuid:string){
    if (uuid) {
      $.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin",zIndex: 1000});
      this.router.navigate( [ '/detalle', uuid ] );
    }
  }

  getXml(evt, uuid: string){
    evt.preventDefault();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo XML',
      footer: 'Favor de esperar',
      timer: 3500,
      showConfirmButton: false
    });
    this.wsStampingSATService.getXML(uuid)
    .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/xml" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = `${uuid}.xml`;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
  }

  getPdf(evt, uuid: string){
    evt.preventDefault();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo PDF',
      footer: 'Favor de esperar',
      timer: 3500,
      showConfirmButton: false
    });
    this.wsStampingSATService.getPDF(uuid)
    .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/pdf" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = `${uuid}.pdf`;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
  }

  getZip(evt, uuid: string){
    evt.preventDefault();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo comprimido',
      footer: 'Favor de esperar',
      timer: 3500,
      showConfirmButton: false
    });
    this.wsStampingSATService.getZip(uuid)
    .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/zip" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = `${uuid}.zip`;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
  }

  getConstanciaAnual(evt, item: constanciaAnual){
    evt.preventDefault();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo PDF',
      footer: 'Favor de esperar',
      timer: 3500,
      showConfirmButton: false
    });
    this.wsStampingSATService.getConstanciaAnualPDF(item)
    .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/pdf" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = `${item.noCtrl}_${item.rfc}_${item.anio}.pdf`;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        },
        ( error: HttpErrorResponse ) =>{
          let msg = 'Ocurrió un error, favor de intentarlo de nuevo';
          if (error.status == 417)
            msg = 'No encontrado'
          
          Swal.fire( {
            title: 'Constancia Anual',
            html : `No se encontró constancia anual para el año ${item.anio}`,
            type: 'warning'
          });
        });
  }

  checkAllToggle(e){

    const rows = this.dataTableObject.rows({ 'search': 'applied' }).nodes();
    
    if ( e.target.checked && rows.length > 5){
      
      e.target.checked= false;

      Swal.fire( {
        html : 'Sólo se permite seleccionar 5 registros como máximo',
        type: 'warning'
      } );

    } else {

      this.checkAll= e.target.checked;

      $('input[type="checkbox"]', rows).prop('checked', this.checkAll);

      const itemsSelecteds = $('input[type="checkbox"]:checked',rows);
      this.itemsSelecteds = itemsSelecteds.length;

    }

  }

  checkToggle(e){

    const rows = this.dataTableObject.rows({ 'search': 'applied' }).nodes();
    const itemsSelecteds = $('input[type="checkbox"]:checked',rows);

    if ( e.target.checked && itemsSelecteds.length > 5){
      
      e.target.checked= false;

      Swal.fire( {
        html : 'Sólo se permite seleccionar 5 registros como máximo',
        type: 'warning'
      } );

    } else {

      this.itemsSelecteds = itemsSelecteds.length;

    }

  }

  getZipMultiple(evt){
    evt.preventDefault();

    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo comprimido',
      footer: 'Favor de esperar',
      timer: 3500,
      showConfirmButton: false
    });

    const rows = this.dataTableObject.rows({ 'search': 'applied' }).nodes();
    const itemsSelecteds = $('input[type="checkbox"]:checked',rows);

    let uuidList: string[]= [];
    $.each( itemsSelecteds, function( key, item ) {
      uuidList.push($(item).data('uuid'));
    });

    this.wsStampingSATService.getZipMultiple(uuidList)
    .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/zip" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;

            link.download = `MultiplesUUIDs_${new Date().toLocaleDateString().replace (/\//g,'-')}.zip`;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
  }

}
