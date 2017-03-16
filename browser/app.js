var socket = io(window.location.origin);
var thePainting = [];

socket.on('connect', function(){
	// console.log('I have made a persistent two-way connection with the server!')
});

socket.on('paint', function(obj){
	thePainting.push(obj)
	paintIt(thePainting);
});

canvas = document.getElementById('paint');
ctx = canvas.getContext('2d')
var clearCTX = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
};

socket.on('reset', function(){
	thePainting = [];
    clearCTX();
});

var undoMe = function(){
	socket.emit('undoMe');
};

var resetAll = function(){
	socket.emit('resetAll');
};

socket.on('undo',  function(undo){
	thePainting = undo;
	clearCTX();
	paintIt(thePainting);
});


window.whiteboard.on('draw', function (start, end, color) {
	thePainting.push({start: start, end: end, color: color});
	socket.emit('drawing', {start: start, end: end, color: color});
});

var paintIt = function(array){
	// console.log('paint it with this array =>', array)
	array.forEach(function(obj){
		// console.log('paint this =>', obj)
			window.whiteboard.draw(obj.start, obj.end, obj.color);
	});
};

