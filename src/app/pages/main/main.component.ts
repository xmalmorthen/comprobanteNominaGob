import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { WsStampingSATService, LogInService, WsCURPService } from 'src/app/services/service.index';
import { getComprobantesToken_Response_Interface, infoCURP_Response_Interface, getUserData_Response_Interface, titular_Interface } from 'src/app/interfaces/interfaces.index';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private wsCURPService: WsCURPService,
    private logInService: LogInService,
    private chRef: ChangeDetectorRef
  ) {    
  }

  ngOnInit() {
    
    this.dataTable = $(this.table.nativeElement);

    this.wsStampingSATService.getUserData(this.logInService.loginModel.token)
      .subscribe ( (response: getUserData_Response_Interface) => {
        
        this.wsCURPService.getData(response.CURP)
          .pipe(
            map( (response: infoCURP_Response_Interface) => {
              return `${response.apellido1} ${ response.apellido2 ? response.apellido2 + ' ' : '' } ${ response.nombres}`;
            })
          )
          .subscribe( (nombre: string) => {
            this.comprobantesTitular.nombre = nombre;
          },
          ( error: HttpErrorResponse ) =>{
            debugger;
          });

        this.comprobantesTitular.emisor = response.Emisor;

      },
      ( error: HttpErrorResponse ) =>{});

    this.wsStampingSATService.getComprobantes(this.logInService.loginModel.token)
      .subscribe( (response: getComprobantesToken_Response_Interface[]) => {
               
        this.comprobantesList = response;

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
            {"orderable": false,"targets": [2,3]},
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 10001, targets: -1 }
          ],
          "order" : [[1, 'desc']],
          "stateSave": true,
          "stateSaveCallback": function(settings,data) {
              localStorage.setItem( 'DataTableState', JSON.stringify(data) )
          },
          "stateLoadCallback": function(settings) {
            return JSON.parse( localStorage.getItem( 'DataTableState' ) )
          },
          "initComplete": (settings, json) => {}});
      },
      ( error: HttpErrorResponse ) =>{});
  }

  showDetail(evt, uuid: string){
    evt.preventDefault();
    debugger;
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
    this.wsStampingSATService.getXML(uuid);
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
    this.wsStampingSATService.getPDF(uuid);
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
    this.wsStampingSATService.getZip(uuid);
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

    this.wsStampingSATService.getZipMultiple(uuidList);
  }

}
