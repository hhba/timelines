/* Data...
   [
	   [
		   { // segmento1
			   start: [0,0],
			   end: [100,100]
			   attributes: {}
		   },
		   { // segmento2
			   ...
		   }
	   ]
   ]
 */
/*
 * config = {
 *	width
 *	heigth 
 *	kx constante para multiplicar en x
 *	ky constante para multiplicar en y
 * }
 */
function testValues() {
	var sol = [];
	sol[0] = {
		'name': 'pepe',
		'segments':
		[
		{
			attributes: { color: 'red'},
			start: [0,1],
			end: [1,1]
		},
		{
			attributes: { color: 'red'},
			start: [1,1],
			end: [2,3]
		},
		{
			attributes: { color: 'red'},
			start: [2,3],
			end: [4,1]
		},		{
			attributes: { color: 'red'},
			start: [4,1],
			end: [7,1]
		},
		{
			attributes: { color: 'red'},
			start: [7,1],
			end: [10,2]
		},
		{
			attributes: { color: 'red'},
			start: [10,2],
			end: [19,4]
		}

	]
	};
	sol[1] = {
		'name': 'asd',
		'segments':
		[
		{
			attributes: { color: 'blue'},
			start: [0,4],
			end: [3,5]
		},
		{
			attributes: { color: 'blue'},
			start: [3,5],
			end: [4,7]
		},
		{
			attributes: { color: 'blue'},
			start: [5,7],
			end: [7,8]
		},
		{
			attributes: { color: 'blue'},
			start: [7,8],
			end: [7,10]
		},
		{
			attributes: { color: 'blue'},
			start: [8,10],
			end: [9,12]
		}
	]
	};
/*	sol[2] = [
		{
			color: 'red', 
			start: [0,1],
			end: [1,1]
		},
		{
			color: 'red', 
			start: [0,1],
			end: [1,1]
		},
		{
			color: 'red', 
			start: [0,1],
			end: [1,1]
		},		{
			color: 'red', 
			start: [0,1],
			end: [1,1]
		},
		{
			color: 'red', 
			start: [0,1],
			end: [1,1]
		}
	]*/
	return sol;
}
var Graficador = function(div, config) {
	this.divId = div;
	this.config = config || {};
	$(this.divId).empty();
	this.paper = new Raphael(this.divId,  this.config.width, this.config.height);
};

Graficador.prototype.defaultText = {
	'text-anchor': 'end',
};

Graficador.prototype.defaultLine = {
    'stroke-width': 3 
};

Graficador.prototype.loadData = function (data, labels_y) {

	this.data = data;

	this.mergeSegments();

	this.paper.clear();
	
	// Draw time axis
	var xAxisDrawn = {};
	for(var i = 0; i < this.segments.length; i++) {
		var s = this.segments[i];
		var x1 = s.start[0];
		if (! xAxisDrawn[x1]) {
			this.drawXAxis(x1);
			xAxisDrawn[x1] = true;
		}
		x1 = s.end[0];
		if (! xAxisDrawn[x1]) {
			this.drawXAxis(x1);
			xAxisDrawn[x1] = true;
		}
	}

  // Draw segments
  this.nameDrawn = {};
	for(var i = 0; i < this.segments.length; i++) {
		this.drawSegmentGroup(this.segments[i]);
	}

	// Draw segment coordinates
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].segments.length ; j++){
			var segment = data[i].segments[j];
			this.drawSegmentPoints(segment, i);
		}
	}

	// Write labels on their x,y
	var writtenLabels = {}
	for (var i = 0; i < data.length; i++) {
		for (var ii = 0; ii < data[i].segments.length ; ii++) {
      var segment = data[i].segments[ii]
      var label_id = segment.group;
      if (! writtenLabels[label_id]) {
      	writtenLabels[label_id] = 1;
		    this.write(segment.group, 100, segment.start[1]);
      }
		}
	}

}

Graficador.prototype.mergeSegments = function() {
	this.segments = [];

	for (var i = 0; i < this.data.length; i++) {
		for (var j = 0; j < this.data[i].segments.length ; j++){
			var segment = this.data[i].segments[j];
			segment.owner = this.data[i].name;
			var k = this.segmentIsRepeated(segment);
			if (k >= 0) {
				var s = this.segments[k];
				s.members.push(segment);
			} else {
				var newSegment = {
					start: segment.start,
					end: segment.end,
					members: [segment],
				};
				this.segments.push(newSegment);
			}
		}
	}
}

Graficador.prototype.segmentIsRepeated = function(segment) {
	for(var i = 0; i < this.segments.length; i++) {
		var s = this.segments[i];
		if (s.start[0] == segment.start[0] && 
			s.end[0] == segment.end[0]) {
			if (s.start[1] == segment.start[1] &&
				s.end[1] == segment.end[1]) {
				return i;
			}
		}
	}
	return -1;
}

Graficador.prototype.drawSegmentGroup = function(segmentGroup) {

	var numSegments = segmentGroup.members.length
	var numberOfSegmentsIsOdd = ( numSegments % 2);

	for(var i = 0; i < numSegments; i++) {
		var segment = segmentGroup.members[i];
		if (numberOfSegmentsIsOdd) {
			var delta = i - (numSegments - 1) / 2; 
		} else {
			var delta = 2 * (i - numSegments / 2 + 0.5);
		}

		// name
		if (! this.nameDrawn[segment.owner]) {
			name = segment.owner;
			this.nameDrawn[name] = true;
		} else {
			name = '';
		}
		this.drawSegment(segment, delta, name);
	}
}

Graficador.prototype.drawSegment = function(segment, delta, name) {

	// Calcular el midpoint
	function calcMiddle(a, b) {
		return a + 0.5 * (b - a);
	}

	//var shiftIndex = 0;

	var x1 = this.scaleX(segment.start[0], 0),
		x2 = this.scaleX(segment.end[0], 0),
		y1 = this.scaleY(segment.start[1], 0),
		y2 = this.scaleY(segment.end[1], 0);

	var mp = [calcMiddle(x1, x2), calcMiddle(y1, y2)];

	// make line
	var width = 0.1 * this.scaleX( Math.abs(segment.end[0] - segment.start[0]), 0);
	if (width > 15) {
		width = 15;
	}

	// linea blanca que borra
	var line = this.paper.path( 
		this.curve( x1, y1, mp[0], x2, y2, width, delta)
	)

	line.attr(
		{
			'stroke': '#ffffff', 
			'stroke-width': 5, 
			'stroke-linejoin': 'round', 
			'stroke-linecap': 'round'
		}
	);

	line.mouseover(function() {
		line.attr({'stroke-width': 8});
	}).mouseout(function() {
		line.attr({'stroke-width': 2});
	});

	// linea fina
	var line2 = this.paper.path( 
		this.curve( x1, y1, mp[0], x2, y2, width, delta)
	)

	line2.attr(
		{
			'stroke': segment.attributes.color, 
			'stroke-width': 2, 
			'stroke-linejoin': 'round', 
			'stroke-linecap': 'round'
		}
	);

	// endpoints
	this.drawCircle( x1, y1, 2, '#ff0000', '#00ff00');

	// write name if given
	if (name != '') {
		this.write(
			name, segment.start[0], segment.start[1] + 3 * delta, 
			{
				'fill': segment.attributes.color, 
				'font-size': '12px',
				'font-weight': 'bold',
			}
		);
	}

}

Graficador.prototype.drawSegmentPoints = function(segment) {

	//var shiftIndex = 0;

	var x1 = this.scaleX(segment.start[0]),
		x2 = this.scaleX(segment.end[0]),
		y1 = this.scaleY(segment.start[1]),
		y2 = this.scaleY(segment.end[1]);

	// endpoints
	this.drawCircle( x1, y1, 3, '#444', '#ffffff');
	this.drawCircle( x2, y2, 3, '#444', '#ffffff');

}

Graficador.prototype.drawCircle = function(x, y, r, color, borderColor) {
    var circle = this.paper.circle(x, y, r);
    circle.attr({'stroke-width': 1, 'fill': color, 'stroke': borderColor});
}

Graficador.prototype.curve = function(x1, y1, mx, x2, y2, w, offset) {

	var path;
	var delta = w * .2;
	var dx = 5;
	var dy = offset * 8;
	
	if (y1 == y2) {
		path = [
			["M", x1, y1], 
			["L", x2, y2]
		];
	} else if (y1 > y2) {
		path = [
			["M", x1, y1],
			["L", x1 + dx, y1 + dy],
			["L", mx - w - delta, y1 + dy ],
			["Q", mx - w, y1 + dy, mx - w + delta, y1 - delta + dy],
			["L", mx + w - delta, y2 + delta + dy],
			["Q", mx + w, y2 + dy, mx + w + delta, y2 + dy],
			["L", x2 - dx, y2 + dy],
			["L", x2, y2]
		];
	} else if (y1 < y2) {
		path = [
			["M", x1, y1],
			["L", x1 + dx, y1 + dy],
			["L", mx - w - delta, y1 + dy],
			["Q", mx - w, y1 + dy, mx - w + delta, y1 + delta + dy],
			["L", mx + w - delta, y2 - delta + dy],
			["Q", mx + w, y2 + dy, mx + w + delta, y2 + dy],
			["L", x2 - dx, y2 + dy],
			["L", x2, y2]
		];
	}
	
	return path;
}

Graficador.prototype.drawXAxis = function(x) {
	var x1 = this.scaleX(x);
	path = [
		["M", x1, 0],
		["L", x1, this.scaleY(100)]
	];
	
	// linea fina
	var line2 = this.paper.path(path);

	line2.attr(
		{
			'stroke': '#ddd', 
			'stroke-width': 1, 
			'stroke-linejoin': 'round', 
			'stroke-linecap': 'round',
			'stroke-dasharray': '- ',
		}
	);

}

Graficador.prototype.scaleP = function(p) {
	var x = p[0] * this.config.kx + this.config['margin-left'];
	var y = p[1] * this.config.ky + this.config['margin-top'];
	return [x,y];
}
Graficador.prototype.scaleX = function(x) {
	return x * this.config.kx + this.config['margin-left'];
}
Graficador.prototype.scaleY = function(y) {
	return y * this.config.ky + this.config['margin-top'];
}


// escala y devuelve un string con las cordenadas
Graficador.prototype.p2String = function(p, shiftIndex) {
	var np = this.scaleP(p);
	return np[0] + ',' + np[1];
}

Graficador.prototype.animateIn = function() {
    this.defaultStroke = this.attr('stroke-width');
    this.mouseover(this.animate({"stroke-width": this.defaultStroke + 4}, 100));
};

Graficador.prototype.animateOut = function() {
    this.animate({"stroke-width": this.defaultStroke}, 100);
};

Graficador.prototype.makeRoundStringLine = function(arr) {
	var string = '';
}

Graficador.prototype.joinLine = function(segments) {
	var ret = [], 
		line = 0,
		attr = [];
	for (var i = 0; i < segments.length; i++) {
		if (!ret[line]) {
			ret[line] = [segments[i].start];
			attr[line] = segments[i].attributes;
		}
		if (ret[line][ret[line].length-1][0] == segments[i].start[0] && ret[line][ret[line].length-1][1] == segments[i].start[1])
			ret[line].push(segments[i].end);
		else {
			ret[++line] = [segments[i].start];
			attr[line] = segments[i].attributes;
			i--;
		}
	}
	return [ret, attr];
};

Graficador.prototype.makeRoundStringLine = function(arr, shiftY) {
	function midPoint(Ax, Ay, Bx, By) {
		var Zx = (Ax-Bx)/2 + Bx;
		var Zy = (Ay-By)/2 + By;
		return [Zx, Zy];
	}
  if (! shiftY ){
          shiftY = 0
  }
	var string = 'M';
	string += 'M'+ (arr[0][0]*this.config.kx+this.config['margin-left'])+','+(arr[0][1]*this.config.ky+this.config['margin-top']+shiftY);
	var Z = [
		arr[arr.length-2][0]*this.config.kx+this.config['margin-left'],
		arr[arr.length-2][1]*this.config.ky+this.config['margin-top']
	];
	for (var i=1; i < arr.length-1; i++) {
		string += 'Q'+(arr[i][0]*this.config.kx+this.config['margin-left'])+','+(arr[i][1]*this.config.ky+this.config['margin-top']+shiftY);
		Z = midPoint(arr[i][0]*this.config.kx+this.config['margin-left'], arr[i][1]*this.config.ky+this.config['margin-top']+shiftY, arr[i+1][0]*this.config.kx+this.config['margin-left'], arr[i+1][1]*this.config.ky+this.config['margin-top']+shiftY);
		string += " "+Z[0]+","+Z[1];
	}
	string += 'Q'+Z[0]+","+Z[1]+' '+(arr[arr.length-1][0]*this.config.kx+this.config['margin-left'])+','+(arr[arr.length-1][1]*this.config.ky+this.config['margin-top']+shiftY);
	return string;
};

Graficador.prototype.makeStringLine = function(arr) {
	var string = '';
	for (var i=0; i < arr.length; i++) {
		string += (i == 0)? 'M' : 'L';
		string += (arr[i][0]*this.config.kx+this.config['margin-left'])+','+(arr[i][1]*this.config.ky+this.config['margin-top']);
	}
	//string += 'Z';
	return string;
};
Graficador.prototype.writeLabel = function(label, pos) {
	var thisText = this.paper.text(
			300 + this.config['margin-left'],
      pos*this.config.ky+this.config['margin-top'],
			label
		),
		opts = {};
}

Graficador.prototype.drawGroupPos = function(tHash, shiftY) {
	var thisText = this.paper.text(
			this.config.textoffset + this.config['margin-left'] - 10,
			tHash.segments[0].start[1] * this.config.ky+this.config['margin-top'] + shiftY,
			tHash.name
		),
		opts = {};
	for (key in this.defaultText)
		opts[key] = this.defaultText[key];
	for (key in (tHash.attributes || {} )){
		if (['fill', 'fill-opacity', 'font', 'font-family', 'font-size', 'font-weight', 'stroke', 'text-anchor'].indexOf(key) > -1)
			opts[key] = tHash.attributes[key];
	}
	thisText.attr(opts);
};

Graficador.prototype.write = function(text, x, y, attributes) {
	var thisText = this.paper.text(
			x*this.config.kx-this.config.textoffset + this.config['margin-left'],
			y*this.config.ky+this.config['margin-top'],
      text
		),
		opts = {};
	for (key in this.defaultText)
		opts[key] = this.defaultText[key];
	for (key in (attributes || {} )){
		if (['fill', 'fill-opacity', 'font', 'font-family', 'font-size', 'font-weight', 'stroke', 'stroke-width', 'text-anchor'].indexOf(key) > -1)
			opts[key] = attributes[key];
	}
	thisText.attr(opts);
};
