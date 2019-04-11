import { Component, ViewChild, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  @ViewChild('tablaComprobantes') table;
  dataTable: any;

  constructor() { }

  ngOnInit() {
    this.dataTable = $(this.table.nativeElement);
    $(this.table.nativeElement).LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
    this.dataTable.DataTable({
          "stateSave": true,
          // "language": {"url": "./assets/vendor/datatable/Spanish.txt"},
          "columnDefs": [{"orderable": false,"targets": [2]}],
          "order" : [[1]],
          "initComplete": (settings, json) => {
            $(this.table.nativeElement).LoadingOverlay("hide");
          }
      });
    
  }

}
