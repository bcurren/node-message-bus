var http = require('http'),  
    io = require('socket.io'),
    MessageBus = require('./message-bus').MessageBus;

server = http.createServer(function(req, res){ 
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello world</h1>');
});
server.listen(80);

var socket = io.listen(server); 
socket.on('connection', function(client) {
  var bus = null;
  
  client.on('message', function(data) {
    var parsedMessage = JSON.parse(data);
    if (parsedMessage.command === "join") {
      bus = new MessageBus(parsedMessage.channel);
      bus.on("error", function(err) {
        console.log("Error " + err);
      });
      bus.on("message", function(message) {
        client.send(message);
      });
    } else {
      bus.send(data);
    }
  });
  
  client.on('disconnect', function() {
    if (bus == null) {
      bus.end();
    }
  });
});
