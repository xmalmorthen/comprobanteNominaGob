import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES INDEX
import { WsStampingSATService, LoginGuard, LogInService, WsCURPService } from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LoginGuard,
    WsStampingSATService,
    WsCURPService,
    LogInService
  ]
})
export class ServiceModule { }
