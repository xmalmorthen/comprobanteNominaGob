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

  canActivate(): boolean {
    if (!this.logInService.sessionActive())
      this.router.navigate( [ '/logIn' ] );
    else
      return true;
  }
}
