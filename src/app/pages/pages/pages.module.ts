import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// MODULES
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountUpModule } from 'countup.js-angular2';

// PIPES
import { PipesModule } from 'src/app/pipes/pipes.module';

// COMPONENTS
import { MainComponent, DetailUUIDComponent, PagesComponent } from './pages.index';

@NgModule({
  declarations: [
    MainComponent,
    PagesComponent,
    DetailUUIDComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    PipesModule,
    CountUpModule
  ]
})
export class PagesModule { }
