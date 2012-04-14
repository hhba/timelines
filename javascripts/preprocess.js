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
			eventList[data[d].character] = [];
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
