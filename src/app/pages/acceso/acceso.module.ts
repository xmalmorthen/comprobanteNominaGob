import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgxCaptchaModule } from 'ngx-captcha';

// COMPONENTS
import { AccesoComponent } from './acceso.component';
import { LogInComponent, ActivacionComponent, ResetPWDComponent } from './activacion.index';
import { BlockCopyPasteDirective } from '../../directives/block-copy-paste.directive';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccesoComponent,
    LogInComponent,
    ActivacionComponent,
    ResetPWDComponent,
    BlockCopyPasteDirective,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    }),
    NgSelectModule,
    NgbModule,
    SharedModule
  ]
})
export class AccesoModule { }
