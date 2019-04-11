export interface responseService_Response_Interface {
  RESTService: RESTService_Response_Interface;
  Response: getEmisores_Response_Interface[] | getAccess_Response_Interface | getComprobantesToken_Response_Interface[];
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

export interface getAccess_Request_Interface {
  rfc?: string;
  curp?: string;
  noCtrl: string;
  emisorRFC: string;
}

export interface getAccess_Response_Interface {
  id: 5,
  token: string;
  fCreated: string;
  fExpired: string;
}

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