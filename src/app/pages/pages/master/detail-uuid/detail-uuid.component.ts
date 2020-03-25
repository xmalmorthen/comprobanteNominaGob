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
    
    $.LoadingOverlay("hide");
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
      timer: 2000,
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
      timer: 2000,
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

}
