import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES INDEX
import { WsStampingSATService, LoginGuard, LogInService } from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LoginGuard,
    WsStampingSATService,
    LogInService
  ]
})
export class ServiceModule { }
