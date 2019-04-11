import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { WsStampingSATService, LogInService } from 'src/app/services/service.index';
import { getComprobantesToken_Response_Interface } from 'src/app/interfaces/interfaces.index';
import { HttpErrorResponse } from '@angular/common/http';

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

  comprobantesList: getComprobantesToken_Response_Interface[] = [];

  constructor(
    private wsStampingSATService: WsStampingSATService,
    private logInService: LogInService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    
    this.dataTable = $(this.table.nativeElement);
    $(this.table.nativeElement).LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
      

    this.wsStampingSATService.getComprobantes(this.logInService.loginModel.token)
      .subscribe( (response: getComprobantesToken_Response_Interface[]) => {
               
        this.comprobantesList = response;

        this.chRef.detectChanges();

        this.dataTableObject = this.dataTable.DataTable({
          "responsive": true,
          "stateSave": true,
          "pagingType": "simple",
          "language": {
            "url": "./assets/vendor/datatable/Spanish.txt"
          },
          "columnDefs": [
            {"orderable": false,"targets": [0,1,2]},
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
          ],
          // "order" : [[1, "desc"]],
          "initComplete": (settings, json) => {
        
            $(this.table.nativeElement).LoadingOverlay("hide");

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
    this.wsStampingSATService.getXML(uuid);
  }

  getPdf(evt, uuid: string){
    evt.preventDefault();
    this.wsStampingSATService.getPDF(uuid);
  }

}
