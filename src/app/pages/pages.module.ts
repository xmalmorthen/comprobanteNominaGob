import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

// PIPES
import { PipesModule } from '../pipes/pipes.module';


// COMPONENTS
import { MainComponent } from './pages.index';
import { PagesComponent } from './pages.component';
import { DetailUUIDComponent } from './detail-uuid/detail-uuid.component';

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
    PipesModule
  ]
})
export class PagesModule { }
