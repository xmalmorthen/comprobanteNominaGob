import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// INDEX COMPONENTS
import { MainComponent, LogInComponent } from './pages/pages.index';
import { Page404Component } from './shared/shared.index';
import { PagesComponent } from './pages/pages.component';


const routes: Routes = [
  { path: '', component: PagesComponent , children: [
    { path: 'principal', component: MainComponent },
    { path: '', redirectTo: 'principal', pathMatch: 'full' }
  ]},
  { path: 'logIn', component: LogInComponent },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
