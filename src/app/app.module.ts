import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';

// LOCALES
import localeEsMX from '@angular/common/locales/es-MX';

// MODULES
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// INDEX COMPONENTS
import { AppComponent } from './app.component';
import { LogInComponent, ActivacionComponent, ResetPWDComponent } from './pages/pages.index';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    ActivacionComponent,
    ResetPWDComponent,
    BlockCopyPasteDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    HttpClientModule,
    NgSelectModule,
    NgbModule,
    PagesModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
