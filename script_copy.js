    async function getLineas() {
        var lineas = [];
        const res = await axios.get('https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/lineas-bilbobus/mapa-de-lineas?temporada_linea=VE&codLinea=22', {
            headers: {
                "Access-Control-Allow-Headers": [],
                "x-requested-With": "XMLHttpRequest",
            }
        });
        parser = new DOMParser();
        var elems = parser.parseFromString(res.data, "text/html");
        elems = elems.querySelectorAll("table.tparadas")
        elems.forEach(element => {
            var tr = element.querySelectorAll("tbody tr")
            tr.forEach(fila => {
                var otros = fila.querySelectorAll("td a");
                otros.forEach(otro => {
                    // Se imprimen los nombres de todas las líneas
                    var lineaString = otro.textContent;
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
        return lineas;
        console.log(lineas)
    }

    async function getTiempos() {
        var tiemposByParada = [];
        const response = await axios.get('https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/linea?temporada_linea=VE&codLinea=01&Trayecto1=1', {
            headers: {
                "Access-Control-Allow-Headers": [],
                "Access-Control-Allow-Origin": "*",
                "x-requested-With": "XMLHttpRequest",
            }
        });
        parser = new DOMParser();
        var htmlData = parser.parseFromString(response.data, "text/html");
        var tables = htmlData.querySelectorAll("table")
        var tiemposFila = tables[1].querySelectorAll("tbody tr");

        tiemposFila.forEach(element => {
            console.log(element)
        });

       /*  jQuery.ajax({
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
                if (infoParada.tiempo == "") {
                    var llegando = $(this).find("[headers='tiempoespera_ida']").find("[title='Llegando']");
                    if (llegando.length > 0) {
                        infoParada.tiempo = "LLEGANDO";
                    }
                }
                tiemposByParada.push(infoParada)
            })
            console.log("------ TIEMPOS PARADAS ------")
            console.log(tiemposByParada);
        }) */
    }
    //getLineas();
    getTiempos();
