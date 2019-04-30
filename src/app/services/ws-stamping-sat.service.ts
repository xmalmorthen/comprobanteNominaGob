import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Cacheable } from 'ngx-cacheable';

// INTERFACES
import { getEmisores_Response_Interface, responseService_Response_Interface, getAccess_Response_Interface, getAccess_Request_Interface, getComprobantesToken_Response_Interface, getComprobantesToken_Request_Interface, getUserData_Response_Interface, getActivationToken_Response_Interface } from '../interfaces/interfaces.index';
import { environment } from '../../environments/environment';

// CONSTANTES
const apiEndPoint = environment.apis.wsStampingSat.endPoint;
const apiVersion = environment.apis.wsStampingSat.apiVersion;
const apiAuth = environment.apis.wsStampingSat.apiAuth;

const emisoresResponse$ = new Subject<void>();
const comprobantesResponse$ = new Subject<void>();
const userDataResponse$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class WsStampingSATService {

  constructor( 
    private http: HttpClient
  ) { }

  // OBTENER CATÁLOGO DE EMISORES
  @Cacheable({
    cacheBusterObserver: emisoresResponse$
  })
  public emisores(rfc: string = null): Observable< getEmisores_Response_Interface[] > {

    const wsRequest = `${apiEndPoint}/${apiVersion}/get/getEmisores${ rfc ? `?rfc=${rfc}` : '' }`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    return this.http.get<responseService_Response_Interface>(wsRequest,{ headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <getEmisores_Response_Interface[]>response.Response;
        })
      );
  }

  // OBTENER TOKEN DE ACCESO
  getAccess(usr: string, noCtrl: string, emisorRFC: string): Observable< responseService_Response_Interface > {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/getAccess`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    let model: getAccess_Request_Interface = {      
      noCtrl : noCtrl,
      emisorRFC: emisorRFC
    }
    if (usr.length == 18)
      model.curp = usr;
    else
      model.rfc = usr;

    return this.http.post<responseService_Response_Interface>(wsRequest, model, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {

          return <responseService_Response_Interface>response;
          
        })
      );
  }

  // OBTENER TOKEN DE ACCESO
  getActivationToken(
    usr: string, 
    noCtrl: string, 
    emisorRFC: string,
    contrasenia: string,
    correo: string
    ): Observable< getActivationToken_Response_Interface > {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/getActivationToken`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    let model: getAccess_Request_Interface = {      
      noCtrl : noCtrl,
      emisorRFC: emisorRFC,
      contrasenia: btoa(contrasenia),
      correo: correo
    }
    if (usr.length == 18)
      model.curp = usr;
    else
      model.rfc = usr;

    return this.http.post<responseService_Response_Interface>(wsRequest, model, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <getActivationToken_Response_Interface>response.Response;
        })
      );
  }

  // REMOVER TOKEN DE ACCESO
  removeAccessToken(id: number, token: string, emp: number): Observable< boolean > {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/removeAccessToken`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    return this.http.post<responseService_Response_Interface>(wsRequest, { id, token, emp }, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return true;
        })
      );
  }

  // VERIFICAR VIGENCIA DE SESIÓN
  checkSession( tocken: string): Observable< boolean > {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/checkToken`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    });

    return this.http.post<responseService_Response_Interface>(wsRequest, { token: tocken }, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return response.Response ? true : false;
        })
      );
  }

  // RECICLAR SESION
  recicleSession( token: string): Observable<getAccess_Response_Interface> {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/recicleToken`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    });    

    return this.http.post<responseService_Response_Interface>(wsRequest, { token: token }, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <getAccess_Response_Interface>response.Response;
        })
      );
  }

  // OBTENER COMPROBANTES
  @Cacheable({
    cacheBusterObserver: comprobantesResponse$
  })
  getComprobantes( token: string, fechaInicio: string = null, fechaFin: string = null): Observable< getComprobantesToken_Response_Interface[] > {
    
    const wsRequest = `${apiEndPoint}/${apiVersion}/get/getStampListToken`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    let model: getComprobantesToken_Request_Interface = {      
      token: token,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    }
    
    return this.http.post<responseService_Response_Interface>(wsRequest, model, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <getComprobantesToken_Response_Interface[]>response.Response;
        })
      );
  }

  // OBTENER CATÁLOGO DE EMISORES
  @Cacheable({
    cacheBusterObserver: userDataResponse$
  })
  public getUserData(token: string): Observable< getUserData_Response_Interface > {

    const wsRequest = `${apiEndPoint}/${apiVersion}/get/getUserData?token=${token}`;
    let headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': apiAuth
    }); 
    
    return this.http.post<responseService_Response_Interface>(wsRequest, { token: token }, { headers: headers_object })
      .pipe(
        map( (response: responseService_Response_Interface) => {
          return <getUserData_Response_Interface>response.Response;
        })
      );
  }

  getXML( UUID: string ): void {
    const callUrl = `${apiEndPoint}/${apiVersion}/get/getStampingXML?identifier=${UUID}`;
    // window.open(callUrl, "_blank");
    window.location.href = callUrl;
  }

  getPDF( UUID: string ): void {
    const callUrl = `${apiEndPoint}/${apiVersion}/get/getStampPDF?identifier=${UUID}`;
    window.open(callUrl, "_blank");
    // window.location.href = callUrl;
  }

  getZip( UUID: string ): void {
    const callUrl = `${apiEndPoint}/${apiVersion}/get/getZipFiles?identifier=${UUID}`;
    // window.open(callUrl, "_blank");
    window.location.href = callUrl;
  }

  getZipMultiple( uuidList: string[] ): void {

    const stringUUIDList =  uuidList.join(","); 
    const stringUUIDB64 = btoa(stringUUIDList);

    const callUrl = `${apiEndPoint}/${apiVersion}/get/getZipMultiple?identifier=${stringUUIDB64}`;
    
    // window.open(callUrl, "_blank");
    window.location.href = callUrl;
  }

  // OBTENER DETALLE DE UUID
  uuidDetail(uuid: string = null): string {

    return `${apiEndPoint}/pdf/index?identifier=${ uuid }`;

  }

}
