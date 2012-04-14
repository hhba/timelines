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

Graficador.prototype.loadData = function (data, labels) {
	this.paper.clear();
  for (label in labels){
      this.writeLabel(label,labels[label])
  }
	for (var i=0; i< data.length; i++) {
		this.writeText(data[i]);
		var linesAndData = this.joinLine(data[i].segments);
//		for (var ii = 0; ii < data[i].segments.length ; ii++){
		for (var ii = 0; ii < linesAndData[0].length ; ii++){
//			var thisStringLine = this.makeStringLine([data[i].segments[ii].start, data[i].segments[ii].end]);
			//var thisStringLine = this.makeStringLine(linesAndData[0][ii]);
			//var thisStringLinea = this.makeStringLine(linesAndData[0][ii]);
			//var thisLinea = this.paper.path(thisStringLinea);
			var thisStringLine = this.makeRoundStringLine(linesAndData[0][ii]);
			var thisLine = this.paper.path(thisStringLine);
			var opts = {};
			for (key in this.defaultLine)
				opts[key] = this.defaultLine[key];
			//opts['stroke'] = data[i].segments[ii].attributes.color;
			opts['stroke'] = linesAndData[1][ii].color;
			//opts['color'] = data[i].segments[ii].attributes.color;
			opts['color'] = linesAndData[1][ii].color;
			thisLine.attr(opts);
            thisLine.mouseover(this.animateIn);
            thisLine.mouseout(this.animateOut);
		}
	}
};


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

Graficador.prototype.makeRoundStringLine = function(arr) {
	function midPoint(Ax, Ay, Bx, By) {
		var Zx = (Ax-Bx)/2 + Bx;
		var Zy = (Ay-By)/2 + By;
		return [Zx, Zy];
	}
	var string = 'M';
	string += 'M'+ (arr[0][0]*this.config.kx+this.config['margin-left'])+','+(arr[0][1]*this.config.ky+this.config['margin-top']);
	var Z = [
		arr[arr.length-2][0]*this.config.kx+this.config['margin-left'],
		arr[arr.length-2][1]*this.config.ky+this.config['margin-top']
	];
	for (var i=1; i < arr.length-1; i++) {
		string += 'Q'+(arr[i][0]*this.config.kx+this.config['margin-left'])+','+(arr[i][1]*this.config.ky+this.config['margin-top']);
		Z = midPoint(arr[i][0]*this.config.kx+this.config['margin-left'], arr[i][1]*this.config.ky+this.config['margin-top'], arr[i+1][0]*this.config.kx+this.config['margin-left'], arr[i+1][1]*this.config.ky+this.config['margin-top']);
		string += " "+Z[0]+","+Z[1];
	}
	string += 'Q'+Z[0]+","+Z[1]+' '+(arr[arr.length-1][0]*this.config.kx+this.config['margin-left'])+','+(arr[arr.length-1][1]*this.config.ky+this.config['margin-top']);
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

Graficador.prototype.writeText = function(tHash) {
	var thisText = this.paper.text(
			tHash.segments[0].start[0]*this.config.kx-this.config.textoffset + this.config['margin-left'],
			tHash.segments[0].start[1]*this.config.ky+this.config['margin-top'],
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
