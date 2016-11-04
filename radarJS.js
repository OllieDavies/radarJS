/**
 * radarJS - a lightweight JavaScript plugin for generating a radar chart visualisation.
 * Copyright (C) 2015 Oliver Davies - olliedaviess(at)icloud(dot)com | http://www.olliedavies.co.uk
 * Licensed under MIT.
 * Date: 07/04/2015
 * @author Oliver Davies (@OllieDaavies)
 * @version 0.1
 *
 */


radarJS = function(config){
	//debug options
	if (!config.id) {alert('Missing id parameter for radar!'); return false;}
	if (!config.data) {alert('No data inputted!'); return false;}
	if (config.data.length < 3) {alert('Not enough data inputted! At least 3 data points are required!'); return false;}
	if (!document.getElementById(config.id)) {alert('No element with id: \''+config.id+'\' found!'); return false;} 

	// configurable parameters
	this.config = {
		// id : string 
		// this is container element id
		id : config.id,

		// textColor : string
		// color of tick values and labels
		textColor : (config.textColor) ? config.textColor : '#7f8c8d',

		// lineColor : string
		// color of line
		lineColor : (config.lineColor) ? config.lineColor : '#444444',
		
		// lineWidth : int
		// thickness of the line
		lineWidth : (config.lineWidth) ? config.lineWidth : 2,

		// font : string
		// font to be used for date and hour marks
		font : (config.font) ? config.font : 'Trebuchet MS',
		
		// tickFontWeight : int
		// font weight to be used for ticks
		tickFontWeight : (config.tickFontWeight) ? config.tickFontWeight : 500,
		
		// data : array
		// data to be displayed
		data : (config.data) ? config.data : [],
		
		// labels : array
		// labels to displayed
		labels : (config.labels) ? config.labels : [],
		
		// backgroundColor : string
		// color of the background circle
		backgroundColor : (config.backgroundColor) ? config.backgroundColor : 'rgb(40, 40, 100)',
		
		// fillColor : string
		// color of the background circle
		fillColor : (config.fillColor) ? config.fillColor : 'rgba(52, 152, 219,0.4)'
	};
	
	// canvas
	document.getElementById(this.config.id).innerHTML = '';	
	this.canvas = Raphael(this.config.id, '100%', '100%');
	
	// canvas dimensions
	var canvasW = document.defaultView.getComputedStyle(document.getElementById(this.config.id), '').getPropertyValue('width').slice(0, -2);
	var canvasH = document.defaultView.getComputedStyle(document.getElementById(this.config.id), '').getPropertyValue('height').slice(0, -2);

	// widget dimensions
	var widgetW, widgetH;
	
	if (canvasW > canvasH) {
		widgetW = canvasH;
		widgetH = canvasH;
	} else {
		widgetW = canvasW;
		widgetH = canvasW;
	}

	//delta
	var dx = widgetW/2;
	var dy = widgetH/2;

	//radius
	var rad = widgetW/2;
	
	//max
	var max = Math.max.apply(null, this.config.data) + 1;
	
	//len
	var len = this.config.data.length;
	
	//draw ticks
	for(i = 0; i < len; i++){
		var sx = rad + Math.round(rad * Math.cos((360 / len) * i * Math.PI / 180));
		var sy = rad + Math.round(rad * Math.sin((360 / len) * i * Math.PI / 180));
		var ex = dx;
		var ey = dy;

		this.canvas.path("M" + sx + " " + sy + "L" + ex + " " + ey).attr({'stroke':this.config.lineColor, 'opacity':0.3, 'stroke-linecap':'round'});
		this.canvas.text(sx, sy, this.config.labels[i]).attr({'font-size':'10%','font-family':this.config.font, 'text-anchor':'middle', 'font-weight': this.config.tickFontWeight, 'fill':this.config.textColor});
	}
		
	//draw background circle object
	for(i = 0; i <= max; i++){
		this.canvas.circle(dx, dy, rad * i/max).attr({'stroke-width': 1, 'stroke': this.config.lineColor, 'opacity':0.1, 'fill':'rgba(50,50,50,0.05)'});
	}
	
//	this.dataLine = this.canvas.path(getCurveString(this.config.data)).attr({'stroke':this.config.lineColor, 'fill':this.config.fillColor, 'stroke-width':this.config.lineWidth, 'stroke-linecap':'round','opacity':0});
//	this.dataLine.id = this.config.id + '-dataLine';
//	this.canvas.getById(this.config.id + '-dataLine').animate({'opacity': 1}, 500, '<>');
	
	this.dataLine = this.canvas.path(getStartingCurve(this.config.data, max)).attr({'stroke':this.config.lineColor, 'fill':this.config.fillColor, 'stroke-width':this.config.lineWidth, 'stroke-linecap':'round','opacity':0.0});
	this.dataLine.id = this.config.id + '-dataLine';
	this.canvas.getById(this.config.id + '-dataLine').animate({path: getCurveString(this.config.data), 'opacity': 1}, 1000, '<>');

	//function to get the xy coords
	//getXYCoords([Val],[Iteration])
	function getXYCoords(d, i){
		var ret = [];
		ret[0] = rad + (rad * d / max) * Math.cos(360 / len * i * Math.PI / 180); //x
		ret[1] = rad + (rad * d / max) * Math.sin(360 / len * i * Math.PI / 180); //y
		return ret;
	};
	
	function getAllCoords(d){
		var ret = [];
		for(i = 0; i != len; i++){
			ret.push([getXYCoords(d[i], i)[0],getXYCoords(d[i],i)[1]]);
		}
		return ret
	}
	
	function getCurveString(data){
		var d = getAllCoords(data), ret = '', p = d[0];
		ret += 'M' + p[0] + ',' + p[1] + 'R';
		for (i = 1; i < d.length; i++){
			p = d[i];
			ret += ' ' + p[0] + ',' + p[1];
		}
		ret += 'Z';
		return ret;
	}
	
	function getStartingCurve(data, max){
		var x = [];
		for(item in data){
			x[item] = max/2;
		}
		var d = getAllCoords(x), ret = '', p = d[0];
		
		ret += 'M' + p[0] + ',' + p[1] + 'R';
		for (i = 1; i < d.length; i++){
			p = d[i];
			ret += ' ' + p[0] + ',' + p[1];
		}
		ret += 'Z';
		return ret;
	
	}
	
	radarJS.prototype.refresh = function(d) {
		this.canvas.getById(this.config.id + '-dataLine').animate({path: getCurveString(d)}, 1000, '<>');
	};

	
};