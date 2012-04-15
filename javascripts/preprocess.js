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
            if (positions[position]['group'] == ""){
                    continue;
            }
            pos_y = places_position[positions[position]['group']];
            pos_x = positions[position]['orderBox'];
            var current = [pos_x, pos_y]
            character_time['segments'].push({'start': current, 
                        "group": positions[position]['group'],
                        "attributes":
                          {"color": character['color'] || colorFromName(character['name']) }
                         });
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
  var r="#"+intToARGB(hashCode(texto))
  return r
}
function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToARGB(i){
    return ((i>>16)&0xFF).toString(16) + 
           ((i>>8)&0xFF).toString(16) + 
           (i&0xFF).toString(16);
}
