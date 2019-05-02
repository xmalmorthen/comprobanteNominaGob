import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { PagesComponent } from './pages/pages.component';

// INDEX COMPONENTS
import { MainComponent, LogInComponent, DetailUUIDComponent, ActivacionComponent } from './pages/pages.index';
import { Page404Component } from './shared/shared.index';

// GUARDS
import { LoginGuard } from './services/guards/login.guard';

const routes: Routes = [
  { path: '', component: PagesComponent, children: [
    { path: 'principal', component: MainComponent, canActivate: [ LoginGuard ], data: { title: 'Comprobantes de ingreso'} },    
    { path: 'detalle/:uuid', component: DetailUUIDComponent, canActivate: [ LoginGuard ], data: { title: 'Detalle del comprobante'} },
    { path: '', redirectTo: 'principal', pathMatch: 'full' }
  ]},
  { path: 'logIn', component: LogInComponent, data: { title: 'Inicio de sesión'} },  
  { path: 'activacion', component: ActivacionComponent, data: { title: 'Activación de acceso'} },
  { path: 'activacion/:token', component: ActivacionComponent, data: { title: 'Activación de acceso'} },
  { path: '**', component: Page404Component, data: { title: 'Página no encontrada'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }