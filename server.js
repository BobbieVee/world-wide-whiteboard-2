var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express(); // the app returned by express() is a JavaScript Function. Not something we can pass to our sockets!

var socketio = require('socket.io');	

server.on('request', app);

var thePainting = [];
var io = socketio(server);
var _socket;	
io.on('connection', function(socket){
	_socket = socket;
	console.log('A new client has connected!');
	console.log(socket.id);
	// console.log('here is the painting: ', thePainting)
	thePainting.forEach(function(obj){
		socket.emit('paint', obj );
	});
	socket.on('disconnect', function(){
		console.log("Socket " + socket.id + " disconnected - sadly.")
	});
	socket.on('drawing', function(obj){
		thePainting.push(obj);
		// console.log('someone\'s a draw\'in here =>', thePainting);
		socket.broadcast.emit('paint', obj );
	});
});
var port = process.env.PORT || 1337;
server.listen(port, function () {
    console.log(`The server is listening on port ${port}!`);
});

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/reset', function(req, res, next){
	thePainting = [];
	_socket.broadcast.emit('reset');
	res.redirect('/');
});

app.get('/undo', function(req, res, next){
	for (var i = 0; i < 10; i++){
		thePainting.pop();
		// console.log("length = ",  thePainting.length)
	};
	_socket.emit('undo', thePainting);
	_socket.broadcast.emit('undo', thePainting)	
	res.redirect('/');
});
