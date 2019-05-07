import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';

// LOCALES
import localeEsMX from '@angular/common/locales/es-MX';

// MODULES
import { AccesoModule } from './pages/acceso/acceso.module';
import { PagesModule } from './pages/pages/pages.module';

// INDEX COMPONENTS
import { AppComponent } from './app.component';

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccesoModule,
    PagesModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
