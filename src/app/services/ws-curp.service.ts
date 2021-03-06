import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Cacheable } from 'ngx-cacheable';

// INTERFACES
import { responseService_Response_Interface, infoCURP_Response_Interface } from '../interfaces/interfaces.index';
import { environment } from '../../environments/environment';

// CONSTANTES
const apiEndPoint = environment.apis.wscuRP.endPoint;
const apiVersion = environment.apis.wscuRP.apiVersion;
const apiAuth = environment.apis.wscuRP.apiAuth;

const curpResponse$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class WsCURPService {

  constructor( 
    private http: HttpClient
  ) { }

  // OBTENER CATÁLOGO DE EMISORES
  @Cacheable({
    cacheBusterObserver: curpResponse$
  })
  public getData(curp: string = null): Observable< infoCURP_Response_Interface > {

    const wsRequest = `${apiEndPoint}/${apiVersion}/CURP/CURP?curp=${curp}`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    return this.http.get<responseService_Response_Interface>(wsRequest,{ headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <infoCURP_Response_Interface>response.Response[0];
        })
      );
  }
}
