import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { WsStampingSATService, LogInService } from 'src/app/services/service.index';
import { getComprobantesToken_Response_Interface } from 'src/app/interfaces/interfaces.index';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit  {
  
  @ViewChild('tablaComprobantes') table;
  dataTable: any;
  dataTableObject: any;

  checkAll: boolean = false;
  itemsSelecteds: number = 0;

  comprobantesList: getComprobantesToken_Response_Interface[] = [];

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private logInService: LogInService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    
    this.dataTable = $(this.table.nativeElement);
    $(this.table.nativeElement).find('tbody').LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
      

    this.wsStampingSATService.getComprobantes(this.logInService.loginModel.token)
      .subscribe( (response: getComprobantesToken_Response_Interface[]) => {
               
        this.comprobantesList = response;

        this.chRef.detectChanges();

        $.fn.dataTable.moment( 'DD/MM/YYYY' );

        this.dataTableObject = this.dataTable.DataTable({
          "responsive": true,
          "stateSave": true,
          "pagingType": "simple",
          "language": {
            "url": "./assets/vendor/datatable/Spanish.txt"
          },
          "columnDefs": [
            {"orderable": false,"targets": [2,3]},
            { type: 'date-eu', targets: 1 },
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 10001, targets: -1 }
          ],
          "order" : [[1, 'desc']],
          "initComplete": (settings, json) => {
        
            $(this.table.nativeElement).find('tbody').LoadingOverlay("hide");

          }});

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
      timer: 1000,
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
      timer: 1000,
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
      timer: 1000,
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
      timer: 1000,
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
