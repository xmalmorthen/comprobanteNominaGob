import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng-select2-component';

// MODULES
import { PagesModule } from './pages/pages.module';

// INDEX COMPONENTS
import { AppComponent } from './app.component';
import { LogInComponent } from './pages/pages.index';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    Select2Module,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
