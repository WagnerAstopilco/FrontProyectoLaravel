import $ from 'jquery';
import 'datatables.net';

$.extend(true, $.fn.dataTable.defaults, {
    language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 a 0 de 0 registros",
        infoFiltered: "(filtrado de _MAX_ registros en total)",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
            first: "<<",
            previous: "<",
            next: ">",
            last: ">>"
        },
        aria: {
            sortAscending: ": activar para ordenar la columna de manera ascendente",
            sortDescending: ": activar para ordenar la columna de manera descendente"
        }
    }
});

$(document).ready(function () {
    $(".dataTables_filter").css("margin-bottom", "10px");
});