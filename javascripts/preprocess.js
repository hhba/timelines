function preprocessData(data) {
	data.sort(function (a,b) {
		return (a.order - b.order);
	});

	var minOrder = data[0].order;
	console.log(data);
	var maxOrder = data[data.length-1].order;
	var universeLength = maxOrder - minOrder;
	var universeBox = universeLength/100;

	var eventList = {};
	for (d in data) {
		if (!eventList[data[d].character]) {
			eventList[data[d].character] = [];
		}
		eventList[data[d].character].name = data[d].character;
		if (!eventList[data[d].character].position) {
			eventList[data[d].character].position = [];
		}
		eventList[data[d].character].position.push({
			orderBox: (data[d].order - minOrder) / universeBox,
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

function merge_segments(events, places_position){
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
            character_time['segments'].push({'start': current});
            if(prev != null) {
                positions[position - 1]['end'] = current;
            }
            prev = current;
        }
        character_time['name'] = character['name'];
        result.push(character_time);
    }
    return result;
}
