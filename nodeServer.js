var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server),
    fs = require('fs');

var k_portnum = 8082;

console.log("messageServer is starting with command line arguments:");
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
if (process.argv.length < 3){
    console.log("usage: node myserver portnum");
    process.exit(1);
}
k_portnum=process.argv[2];

//****************************************************************************
var m_useRoot="/www";
app.use(express.static(__dirname + m_useRoot));
app.use(express.bodyParser());

server.listen(process.argv[2] || k_portnum);
console.log("Connected and listening on port " + k_portnum);

var connectionID = 0;

io.set("log level", 1);

io.sockets.on("connection", function (socket) {
  socket.myID = connectionID++;
  console.log("Got a connection, assigning myID = " + socket.myID);

  // socket.on("message", function (data) {
  //   console.log("Message received: " + data);
  // });

  socket.on("disconnect", function () {
    console.log("Socket with myID = " + socket.myID + " disconnected!");
  });
});


exports.server = server;
