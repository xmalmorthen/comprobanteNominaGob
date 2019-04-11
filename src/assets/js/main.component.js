const mainComponentJS = {
    vars: {
        tablaComprobantesDom : null,
        tablaComprobantesDataTable : null,
    },
    init : () =>{


        mainComponentJS.vars.tablaComprobantesDom = $('#tablaComprobantes');
        mainComponentJS.vars.tablaComprobantesDom.LoadingOverlay("show", {image: "",fontawesome: "fa fa-cog fa-spin"});
        mainComponentJS.vars.tablaComprobantesDataTable = mainComponentJS.vars.tablaComprobantesDom.DataTable({
            stateSave: true,
            "language": {"url": "./assets/vendor/datatable/Spanish.txt"},
            "columnDefs": [{"orderable": false,"targets": [2]}],
            "order" : [[1]],
            "initComplete": function(settings, json) {
                mainComponentJS.vars.tablaComprobantesDom.removeClass('d-none');
                $('.bodyVew').LoadingOverlay("hide");
            }
        });
    }

}