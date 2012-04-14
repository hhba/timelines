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
            console.log(positions[position]);
            pos_y = places_position[positions[position]['group']];
            pos_x = positions[position]['orderBox'];
            var current = [pos_x, pos_y]
            console.log("current", current);
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
