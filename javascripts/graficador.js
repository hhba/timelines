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
	this.paper.clear();
	
  	// Draw segments
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].segments.length ; j++){
			var segment = data[i].segments[j];
			this.drawSegment(segment, i);
		}
		this.drawGroupPos(data[i], i * 10);
	}

	// Write labels on their x,y
	var writtenLabels = {}
	for (var i = 0; i < data.length; i++) {
		for (var ii = 0; ii < data[i].segments.length ; ii++) {
	        var segment = data[i].segments[ii]
	        var label_id = segment['start'] + segment['group']
	        if (! writtenLabels[label_id]){
	        	writtenLabels[label_id] = 1
	  		    this.write(segment['group'],segment['start'][0] + 5, segment['start'][1] - 5);
	        }
    	}
  	}
};

Graficador.prototype.drawSegment = function(segment, shiftIndex) {
	// Calcular el midpoint
	function calcMiddle(a, b) {
		return a + 0.5 * (b - a);
	}

	var x1 = segment.start[0],
		x2 = segment.end[0],
		y1 = segment.start[1],
		y2 = segment.end[1];

	var mp = [calcMiddle(x1,x2), calcMiddle(y1,y2)];

	// make line
	var width = 2;
	var out = 'M' + this.p2String([x1,y1], shiftIndex);
	out += 'L' + this.p2String([mp[0] - width, y1], shiftIndex);
	out += 'L' + this.p2String([mp[0] + width, y2], shiftIndex);
	out += 'L' + this.p2String([x2,y2], shiftIndex);
	var line = this.paper.path(out);

	line.attr(
		{'stroke': segment.attributes.color, 'stroke-width': 4, 'stroke-linejoin': 'round'}
	);
}

Graficador.prototype.scaleP = function(p, shiftIndex) {
	var x = p[0] * this.config.kx + this.config['margin-left'];
	var y = p[1] * this.config.ky + this.config['margin-top'] + shiftIndex * 10;
	return [x,y];
}

// escala y devuelve un string con las cordenadas
Graficador.prototype.p2String = function(p, shiftIndex) {
	var np = this.scaleP(p, 0);
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
Graficador.prototype.writeLabel = function(label,pos) {
	var thisText = this.paper.text(
			300 + this.config['margin-left'],
      pos*this.config.ky+this.config['margin-top'],
			label
		),
		opts = {};
}

Graficador.prototype.drawGroupPos = function(tHash,shiftY) {
	var thisText = this.paper.text(
			this.config.textoffset + this.config['margin-left'],
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

Graficador.prototype.write = function(text,x,y,attributes) {
	var thisText = this.paper.text(
			x*this.config.kx-this.config.textoffset + this.config['margin-left'],
			y*this.config.ky+this.config['margin-top'],
      text
		),
		opts = {};
	for (key in this.defaultText)
		opts[key] = this.defaultText[key];
	for (key in (attributes || {} )){
		if (['fill', 'fill-opacity', 'font', 'font-family', 'font-size', 'font-weight', 'stroke', 'text-anchor'].indexOf(key) > -1)
			opts[key] = attributes[key];
	}
	thisText.attr(opts);
};
