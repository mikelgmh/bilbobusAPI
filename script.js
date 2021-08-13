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
        console.log(lineas)
        return lineas;
    }

    async function getTiempos() {
        var tiemposByParada = [];
        const response = await axios.get('https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/linea?temporada_linea=VE&codLinea=01&Trayecto1=1', {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "x-requested-With": "XMLHttpRequest",
            }
        });
        parser = new DOMParser();
        var htmlData = parser.parseFromString(response.data, "text/html");
        var tables = htmlData.querySelectorAll("table")
        var tiemposFila = tables[1].querySelectorAll("tbody tr");

        tiemposFila.forEach(element => {
            var hrefParada = element.querySelectorAll("[headers='horas_de_paso_ida'] a");
            hrefParada.forEach(elemento => {
                var href = elemento.href;
                var Y = "parada="
                var codParada = parseInt(href.split(Y).pop());
                var infoParada = {
                    tiempo: element.querySelectorAll("[headers='tiempoespera_ida']")[0].textContent.replace("'", ''),
                    parada: element.querySelectorAll("[headers='parada_ida']")[0].textContent.trim(),
                    zona: element.querySelectorAll("[headers='zona_ida']")[0].textContent,
                    numparada: codParada,
                };
                if (infoParada.tiempo == "") {
                    var llegando = element.querySelectorAll("[headers='tiempoespera_ida'] [title='Llegando']");
                    if (llegando.length > 0) {
                        infoParada.tiempo = "LLEGANDO";
                    }
                }
                if(!containsObject(infoParada,tiemposByParada)){
                    tiemposByParada.push(infoParada)
                }
            });
        });
        console.log(tiemposByParada)
        return tiemposByParada;
    }

    async function getTiemposParada(parada){
        const response = await axios.get('https://cors.bridged.cc/https://www.bilbao.eus/cs/Satellite/bilbobus/es/horario?codLinea=01&temporada=VE', {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "x-requested-With": "XMLHttpRequest",
            },
            params:{
                parada: parada
            }
        });
        parser = new DOMParser();
        var htmlData = parser.parseFromString(response.data, "text/html");
        var tables = htmlData.querySelectorAll("table")
        var tiemposFila = tables[0].querySelectorAll("tbody tr");
        var tiempos = tiemposFila[1];
        var minutos = tiempos.querySelectorAll("td")[0].textContent.replace("'", '');
        if(minutos.trim() == ""){
            minutos = "LLEGANDO"
        }
        console.log(minutos)
        return minutos;
    }

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].numparada == obj.numparada) {
                return true;
            }
        }
    
        return false;
    }
    //getLineas();
    //getTiempos();
    getTiemposParada(1604);