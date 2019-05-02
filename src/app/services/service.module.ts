import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES INDEX
import { WsStampingSATService, LoginGuard, LogInService, WsCURPService, GobMailSenderService } from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LoginGuard,
    WsStampingSATService,
    WsCURPService,
    LogInService,
    GobMailSenderService
  ]
})
export class ServiceModule { }
