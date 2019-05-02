import { Component, OnInit, Input } from '@angular/core';

// INTERFACES
import { errModel_Interface } from 'src/app/interfaces/interfaces.index';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {

  @Input() errorModel: errModel_Interface= null;

  constructor() { }

  ngOnInit() {}

}
