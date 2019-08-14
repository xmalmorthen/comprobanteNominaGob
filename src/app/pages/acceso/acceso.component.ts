import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss']
})
export class AccesoComponent implements OnInit {

  manualURL: string = null;

  constructor() { }

  ngOnInit() {

    this.manualURL = `${location.origin}/assets/MANUAL_DE_REGISTRO_PARA_DESCARGAR_RECIBOS_DE_NOMINA.pdf`;

  }

}
