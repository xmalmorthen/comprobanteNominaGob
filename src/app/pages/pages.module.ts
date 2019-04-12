import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
