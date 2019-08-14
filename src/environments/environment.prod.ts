export const environment = {
  production: true,
  labels:{
    prefixTitle: 'Gobierno Colima - Recibos de Nómina'
  },
  recaptcha: {
    siteKey: '6Lc41J4UAAAAAFHaMaKZ3g_20mgDXszi2yQZBcE-'
  },
  apis: {
    wscuRP: {
      endPoint: 'http://apisnet.col.gob.mx/wscuRP',
      apiVersion: 'apiV1',
      apiAuth: 'Basic eG1hbG1vcnRoZW46YjE2ZjU1MGQxNDdiZjkyZTk0NTUwNzRkOWVkZmUwMTM='
    },
    wsStampingSat: {
      endPoint: 'http://apisnet.col.gob.mx/wsStampingSat',
      apiVersion: 'apiV1',
      apiAuth: 'Basic eG1hbG1vcnRoZW46YjE2ZjU1MGQxNDdiZjkyZTk0NTUwNzRkOWVkZmUwMTM='
    },
    wsMailSender:{
      endPoint: 'http://www.openapis.col.gob.mx/correos/v3/enviar',      
      apiAuth: 'Basic Y29tcHJvYmF0ZU5vbWluYTpNazBYSFI='
    }
  }
};
