import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LogInService } from '../log-in.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {

  constructor(
    private logInService: LogInService,
    private router: Router
  ){}

  async canActivate() {
    return await this.logInService.sessionActive() ? true : this.router.navigate( [ 'logIn' ] );
  }
}