export const environment = {
  production: true,
  labels:{
    prefixTitle: 'Gobierno Colima - Recibos de Nómina'
  },
  recaptcha: {
    siteKey: '6Ld8oNMUAAAAABvk-R0FoGJ6cRdTrCn3y3kN4KJ7'
  },
  apis: {
    wscuRP: {
      endPoint: 'http://apisnet.col.gob.mx/wscuRP',
      apiVersion: 'apiV1',
      apiAuth: 'Basic aWNzaWM6MjA4M2FmMTc2ZDBmNDcwM2NkZDE1MzlhMWUxZTc3MmY='
    },
    wsStampingSat: {
      endPoint: 'http://apisnet.col.gob.mx/wsStampingSat',
      apiVersion: 'apiV1',
      apiAuth: 'Basic aWNzaWM6MjA4M2FmMTc2ZDBmNDcwM2NkZDE1MzlhMWUxZTc3MmY='
    },
    wsMailSender:{
      endPoint: 'http://www.openapis.col.gob.mx/correos/v3/enviar',      
      apiAuth: 'Basic Y29tcHJvYmF0ZU5vbWluYTpNazBYSFI='
    }
  },
  constanciaAnualInicio: 2019 //Año de inicio de expedición de constancia anual de percepciones
};
