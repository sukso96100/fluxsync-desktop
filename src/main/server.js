const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

const httpHandler = require('./handlehttp');
const websocketHandler = require('./handlesocket');

console.log("Starting Server...");
app.listen(8080);

// handle http reqs
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// handle websocket stream
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
