"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ServerPort = 3000;

var wildcard = require('socketio-wildcard')();
io.use(wildcard);

// serve static content from public dir
app.use(express.static('web'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(ServerPort, function() {
	console.log('listening on *:' + ServerPort);
});