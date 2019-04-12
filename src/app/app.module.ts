import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

// LOCALES
import localeEsMX from '@angular/common/locales/es-MX';

// MODULES
import { PagesModule } from './pages/pages.module';

// INDEX COMPONENTS
import { AppComponent } from './app.component';
import { LogInComponent } from './pages/pages.index';

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule,
    Select2Module,
    NgbModule,
    PagesModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
