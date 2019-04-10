import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages.index';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    MainComponent,
    PagesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
