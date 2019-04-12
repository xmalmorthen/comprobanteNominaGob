import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsStampingSATService } from 'src/app/services/service.index';
import { DomSanitizer } from '@angular/platform-browser';

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
    private wsStampingSATService: WsStampingSATService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.uuid = this.activatedRouter.snapshot.paramMap.get('uuid');
    if (!this.uuid)
      return this.router.navigateByUrl('/');

    this.iframeSrc = this.wsStampingSATService.uuidDetail( this.uuid );

  }

}
