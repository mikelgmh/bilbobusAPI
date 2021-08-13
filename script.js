$(document).ready(function () {
    function getLineas() {
        var lineas = [];
        jQuery.ajax({
            url: "https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/lineas-bilbobus/mapa-de-lineas?temporada_linea=VE&codLinea=22",
            method: "GET",
            headers: {
                "Access-Control-Allow-Headers": [],
                "x-requested-With": "XMLHttpRequest",
                "x-requested-by": undefined
            }
        }).then(response => {
            var elems = $(response).find("table.tparadas"); // 3 tablas, la info está en la 2 y 3
            elems.each(function () {
                var elementos = $(this).find("tbody").find("tr");
                elementos.each(function () {

                    var otros = $(this).find("td").find("a");
                    otros.each(function () {

                        // Se imprimen los nombres de todas las líneas
                        var lineaString = $(this).text();
                        const parts = lineaString.split(":");
                        if (parts[1] != undefined) {

                            lineas.push({
                                numLinea: parts[0],
                                nombre: parts[1].trim(),
                            })
                        }

                    });
                });
            });
            console.log("------ LINEAS ------")
            console.log(lineas)
        }).catch(error => {
            console.log(error);
        })
    }

    function getTiempos() {
        var tiemposByParada = [];
        jQuery.ajax({
            url: "https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/linea?temporada_linea=VE&codLinea=01&Trayecto1=1",
            method: "GET",
            headers: {
                "Access-Control-Allow-Headers": [],
                "x-requested-With": "XMLHttpRequest",
                "x-requested-by": undefined
    
            }
        }).then(response => {
            var table = $(response).find("table");
            var tiemposFila = $(table[1]).find("tbody").find("tr");
            tiemposFila.each(function () {
                var hrefParada = $(this).find("[headers='horas_de_paso_ida']").find("a").attr('href');
                var Y = "parada="
                var codParada = parseInt(hrefParada.split(Y).pop());
                var infoParada = {
                    tiempo: $(this).find("[headers='tiempoespera_ida']").text().replace("'", ''),
                    parada: $(this).find("[headers='parada_ida']").text(),
                    zona: $(this).find("[headers='zona_ida']").text(),
                    numparada: codParada,
                };
                if(infoParada.tiempo == ""){
                   var llegando = $(this).find("[headers='tiempoespera_ida']").find("[title='Llegando']");
                   if(llegando.length >0){
                       infoParada.tiempo = "LLEGANDO";
                   }
                }
                tiemposByParada.push(infoParada)
            })
            console.log("------ TIEMPOS PARADAS ------")
            console.log(tiemposByParada);
        })
    }
    // getLineas();
    getTiempos();
  
});