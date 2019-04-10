import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { Select2Module } from "ng-select2-component";
import { SharedModule } from '../shared/shared.module';

// COMPONENTS
import { MainComponent } from './pages.index';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    MainComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
