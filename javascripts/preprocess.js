function preprocessData(data) {
  var groups = {};
  var characters = {};

	data.sort(function (a,b) {
		return (parseInt(a.order) - parseInt(b.order));
	});

	var minOrder = parseInt(data[0].order);
	console.log(data);
	var maxOrder = parseInt(data[data.length-1].order);
	var universeLength = maxOrder - minOrder;
	var universeBox = universeLength/100;

	var eventList = {};
	for (d in data) {
		if (!eventList[data[d].character]) {
			eventList[data[d].character] = {};
		}
		eventList[data[d].character].name = data[d].character;
		if (!eventList[data[d].character].position) {
			eventList[data[d].character].position = [];
		}
		eventList[data[d].character].position.push({
			orderBox: (parseInt(data[d].order) - minOrder) / universeBox,
			group: data[d].group
		});

		//Count groups
		if (!groups[data[d].group]) {
			groups[data[d].group] = 0;
		}
		groups[data[d].group]++;
	}

	return {eventList: eventList, groups: groups};
}

function mergeSegments(events, places_position){
    var result = Array();
    for(event in events){
        var pos_x = 0;
        var pos_y = 0;
        var character = events[event];
        var positions = character['position'];
        var character_time = {'segments': []};
        var prev = null;
        for (position in positions){
            pos_y = places_position[positions[position]['group']];
            pos_x = positions[position]['orderBox'];
            var current = [pos_x, pos_y]
            character_time['segments'].push({'start': current, "attributes":{"color": character['color'] || colorFromName(character['name']) }});
            if(prev != null) {
                character_time['segments'][character_time['segments'].length - 2]['end'] = current;
            }
            prev = current;
        }
        character_time['name'] = character['name'];
        character_time['segments'].pop();
        result.push(character_time);
    }
    return result;
}
function colorFromName(texto) {
        var valor = 0;
	var colores = Array(3);
        for(x=0;x<texto.length;x++){
                var chr = texto.charAt(x);
                var sumar = chr.charCodeAt(chr);
                sumar = (sumar/255);
                valor = valor + sumar;
		colores[x-1] = ((valor/texto.length)*255);
        }
	var colorcito = (Math.round(colores[2]) + "," + Math.round(colores[3]) + "," + Math.round(colores[1]));
	return("rgb(" + colorcito + ")");
}

