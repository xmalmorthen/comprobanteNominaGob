import { infoCURP_Response_Interface } from './wsCURP.interface';

export interface responseService_Response_Interface {
  RESTService: RESTService_Response_Interface;
  Response: getEmisores_Response_Interface[] 
            | getAccess_Response_Interface 
            | getComprobantesToken_Response_Interface[] 
            | infoCURP_Response_Interface 
            | getUserData_Response_Interface
            | getActivationToken_Response_Interface;
}

export interface RESTService_Response_Interface {
  StatusCode: string;
  StatusResponse: string;
  Message: string;
  Fecha: string;
  Hora: string;
  ResponseKey: string;
  ResponseTime: string;
}

export interface getEmisores_Response_Interface {
  rfc: string;
  nombre: string;
}

//getAcces - REQUEST
export interface getAccess_Request_Interface {
  rfc?: string;
  curp?: string;
  noCtrl: string;
  emisorRFC: string;
  contrasenia?: string;
  correo?: string;
}

//getAcces - RESPONSE
export interface getAccess_Response_Interface {
  TokenAccess?: Token_getAccess_Response_Interface;
  EmpleadoRef?: EmpleadoRef_getAccess_Response_Interface;
  TokenActivation?: Token_getAccess_Response_Interface;
}

export interface Token_getAccess_Response_Interface {
  id: number;
  token: string;
  fCreated?: string;
  fRecicled?: string;
  fExpired?: any;

  sessionTime?: number;
  remainSession?: number;
}

export interface EmpleadoRef_getAccess_Response_Interface {
  id: number;
  primerApellido: string;
  segundoApellido?: string;
  nombres: string;
  rfc: string;
  curp: string;
  noCtrl: string;
  emisorRFC: string;
  emisor?: string;
  correo?: string;
}

export interface getActivationToken_Response_Interface  {
  TokenRef:Token_getAccess_Response_Interface
  EmpleadoRef: EmpleadoRef_getAccess_Response_Interface
}

/**************************************************** */


export interface getComprobantesToken_Request_Interface {
  token: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface getComprobantesToken_Response_Interface {
  id: number;
  rfcEmisor: string;
  serie: string;
  folio: string;
  UUID: string;
  fechaTimbrado: string;
  cancelado: boolean;
}

export interface getUserData_Response_Interface {
  CURP: string;
  RFC: string;
  NoCtrl: string;
  EmisorRFC: string;
  Emisor: string;
}



