import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsStampingSATService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-detail-uuid',
  templateUrl: './detail-uuid.component.html',
  styleUrls: ['./detail-uuid.component.scss']
})
export class DetailUUIDComponent implements OnInit {

  uuid: string= "";
  iframeSrc: string= "";

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private wsStampingSATService: WsStampingSATService
  ) { }

  ngOnInit() {
    this.uuid = this.activatedRouter.snapshot.paramMap.get('uuid');
    if (!this.uuid)
      return this.router.navigateByUrl('/');

    this.iframeSrc = this.wsStampingSATService.uuidDetail( this.uuid );

  }

  getXml(evt, uuid: string){
    evt.preventDefault();
    Swal.fire({
      position: 'top-end',
      type: 'success',
      title: 'Generando archivo XML',
      footer: 'Favor de esperar',
      timer: 2000,
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
      timer: 2000,
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
      timer: 2000,
      showConfirmButton: false
    });
    this.wsStampingSATService.getZip(uuid);
  }

}
