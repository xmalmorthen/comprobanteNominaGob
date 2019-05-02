import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { response_WsGobMailSender_Interface } from '../interfaces/interfaces.index';

// CONSTANTES
const apiEndPoint = environment.apis.wsMailSender.endPoint;
const apiAuth = environment.apis.wsMailSender.apiAuth;

@Injectable({
  providedIn: 'root'
})
export class GobMailSenderService {

  constructor(
    private http: HttpClient
  ) { }

  // OBTENER TOKEN DE ACCESO
  sendMail(correo: string, titulo: string, contenido: string): Observable< boolean > {
    
    const wsRequest = `${apiEndPoint}`;
    let headers_object = new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': apiAuth,
      "Content-Type":"application/x-www-form-urlencoded"
    }); 

    const body = new HttpParams()
    .set('correo',correo)
    .set('titulo',titulo)
    .set('contenido',contenido);

    return this.http.post<response_WsGobMailSender_Interface>(
      wsRequest,
      body.toString(),
      { headers: headers_object })
      .pipe(
        map( (response: response_WsGobMailSender_Interface) => {

          return !response.error;
          
        })
      );
  }

}
