/**
 * data tiene la siguiente estructura:
 *  [
 *    {
 *      order: “2009-10-10”,
 *      character:  “frodo”,
 *      group: “rivendel”,
 *      [...]
 *    },
 *    ...
 *  ]
 *
 * Y devuevle:
 *
 *    {
 *      eventList: [
 *        {
 *          // Gandalf
 *          name: ‘Gandalf’,
 *          position:
 *            [
 *              {orderBox: 20.3, group: ‘shire’},
 *              {orderBox: 30, group: ‘isengard’},
 *              {orderBox: 50, group: ‘mordor’},
 *              ...
 *            ]
 *        },
 *        {
 *          // Frodo
 *          name: ‘Frodo’
 *          position:
 *          [
 *            {orderBox: 10, group: ‘shirel’},
 *            {orderBox: 40, group: ‘mordor’},
 *            ...
 *          ],
 *        },
 *        ...
 *      ],
 *      groups: [‘shire’, ‘mordor’, ‘isengard’, … ]
 *    } 
 */

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
    eventList[data[d].character].color = data[d].color;
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

/*
 * Recibe el output de preprocessData y devuelve la siguiente estructura:
 *
 *  [
 *    // Gandalf
 *    {
 *      name: ”Gandalf”,
 *      segments: [
 *        { // segmento1
 *          start: [0,0],
 *          end: [100,100]
 *          attributes: {}
 *        }, 
 *        { // segmento2
 *        ...
 *        }
 *      ]
 *    },
 *    // Frodo
 *    ...
 *  ]
 */

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
  var r = intToARGB(hashCode(texto))
  return r
}
function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToARGB(i)
{
  var paleta = [
    '#26b5ff',
    '#087dd7',
    '#0a55bb',
    '#864db1',
    '#550790',
    '#c40808',
    '#fb8a11',
    '#ffeb0c',
    '#baeb35',
    '#298a0b',
    '#0adbe8',
    '#08aeb8',
    '#fe71a9',
    '#f3377f',
    '#c40808',
    '#fb8a11',
    '#ffeb0c',
    '#baeb35',
    '#298a0b',
    '#08aeb8',
    '#fe71a9',
    '#f3377f',

    '#aaaaaa',
    '#cccccc',
    '#999999',

  ];

  return paleta[ Math.abs(i) % paleta.length];
}