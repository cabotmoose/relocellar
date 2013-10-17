var express = require('express'),
    neighborhood = require('./routes/neighborhoods'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
    });

var server = http.createServer(app);
io = io.listen(server);

//io.configure(function () {
//io.set('authorization', function (handshakedata, callback) {
//	if (handsakedata.xdomain) {
//	    callback('Cross-domain connections are not allowed');
//	} else {
//	    callback(null, true);
//	}
//    });
//  });

server.listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
    });

app.get('/neighborhoods', neighborhood.findAll);
app.get('/neighborhoods/:id', neighborhood.findById);
app.post('/neighborhoods', neighborhood.addNeighborhood);
app.put('/neighborhoods/:id', neighborhood.updateNeighborhood);
app.delete('/neighborhoods/:id', neighborhood.deleteNeighborhood);

io.sockets.on('connection', function (socket) {
	
	socket.on('message', function (message) {
		console.log("Got message: " + message);
		io.sockets.emit('pageview', { 'url': message });
	    });
    });