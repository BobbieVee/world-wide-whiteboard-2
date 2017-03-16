var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express(); // the app returned by express() is a JavaScript Function. Not something we can pass to our sockets!

var socketio = require('socket.io');	

server.on('request', app);

var thePainting = [];
var io = socketio(server);	
io.on('connection', function(socket){
	console.log('A new client has connected!');
	console.log(socket.id);
	// console.log('here is the painting: ', thePainting)
	thePainting.forEach(function(obj){
		socket.emit('paint', obj );
	});
	socket.on('disconnect', function(){
		// console.log("Socket " + socket.id + " disconnected - sadly.")
	});
	socket.on('drawing', function(obj){
		thePainting.push(obj);
		// console.log('someone\'s a draw\'in here =>', thePainting);
		socket.broadcast.emit('paint', obj );
	});
});

server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});