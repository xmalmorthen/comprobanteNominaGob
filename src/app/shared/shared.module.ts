import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, FooterComponent, Page404Component } from './shared.index';

@NgModule({
  declarations: [
    
    HeaderComponent,
    FooterComponent,
    Page404Component
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
