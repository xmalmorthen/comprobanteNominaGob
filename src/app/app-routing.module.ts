import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// INDEX COMPONENTS
import { MainComponent, LogInComponent } from './pages/pages.index';
import { Page404Component } from './shared/shared.index';


const routes: Routes = [
  { path: 'principal', component: MainComponent },
  { path: 'logIn', component: LogInComponent },
  { path: '', redirectTo: '/principal', pathMatch: 'full' },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
