import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebuggerService {

  constructor() { 
    interval(1).subscribe( () => {debugger;})
  }
}
