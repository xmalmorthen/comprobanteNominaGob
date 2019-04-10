import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, FooterComponent } from './shared.index';
import { Page404Component } from './page404/page404.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    Page404Component
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
