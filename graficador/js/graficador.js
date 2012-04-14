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
	function rancolor() {
		if (Math.random() > 0.5)
			return 'red';
		return 'blue';
	}
	var ini = 0
	var ret = [];
	for (var i=0; i < 10; i++){
		ret[i] = [];
		for (var ii=0; ii < 5; ii++) {
			//var a = (ii == 0) ? 1 : ii;
			var a = ii;
			if (ii == 0) {
				a = ini;
				ini += 10;
			}
			var b = (!i) ? 1 : i;
			ret[i][ii] = {
				color: rancolor(),
				start: [Math.random()*10*b*ii,Math.random()*b*a+ini],
				end: [Math.random()*10*b*ii, Math.random()*b*a+ini]
			};
		}
	}
	return ret;
}
var Graficador = function(div, config) {
	this.divId = div;
	this.config = config || {};
	this.paper = new Raphael(this.divId,  this.config.width, this.config.height);
};

Graficador.prototype.loadData = function (data) {
	for (var i=0; i< data.length; i++) {
		for (var ii = 0; ii < data[i].length ; ii++){
			var thisStringLine = this.makeStringLine([data[i][ii].start, data[i][ii].end]);
			var thisLine = this.paper.path(thisStringLine);
			thisLine.attr({
				'stroke':data[i][ii].color,
				'color':data[i][ii].color
			});
		}
		
	}
};

Graficador.prototype.makeRoundStringLine = function(arr) {
	var string = '';
}
Graficador.prototype.makeStringLine = function(arr) {
	var string = '';
	for (var i=0; i < arr.length; i++) {
		string += (i == 0)? 'M' : 'L';
		string += (arr[i][0]*this.config.kx)+','+(arr[i][1]*this.config.ky);
	}
	//string += 'Z';
	return string;
};
