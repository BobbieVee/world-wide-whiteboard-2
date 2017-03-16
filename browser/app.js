var socket = io(window.location.origin);
var thePainting = [];

socket.on('connect', function(){
	console.log('I have made a persistent two-way connection with the server!')
});

socket.on('paint', function(obj){
	thePainting.push(obj)
	paintIt(thePainting);
});

window.whiteboard.on('draw', function (start, end, color) {
	thePainting.push({start: start, end: end, color: color});
	socket.emit('drawing', {start: start, end: end, color: color});
});

var paintIt = function(array){
	array.forEach(function(obj){
		// console.log('paint this =>', obj)
			window.whiteboard.draw(obj.start, obj.end, obj.color);
	});
};

