const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const parser = require('url');
const {ipcMain} = require('electron');

const os = require('os');
const httpHandler = require('./handlehttp');
const websocketHandler = require('./handlesocket');
const bonjour = require('bonjour')();
const jwt = require('jsonwebtoken');
const keytar = require('keytar');


console.log("Starting Server...");
app.listen(0); // Listen on random port

let currentPort = app.address().port
console.log(`Running server on ${currentPort}`);
keytar.getPassword('fluxsync', 'id').then(val => {
  // Publish network service on network
  bonjour.publish({ name: 'FluxSyncDesktopApp',
   type: 'http', port: currentPort,
   txt: { "deviceid": val, "hostname" : os.hostname()} });
  console.log("publishing service on network");

});

// handle http reqs
function handler (req, res) {
  let url = parser.parse(req.url, true);
  switch (url.pathname) {
    // case "/info": httpHandler.info(req, res); break;
    case "/reqkey": httpHandler.reqKey(req, res); break;
    default:
      res.writeHead(200);
      res.end("data");
  }
}

// handle websocket stream
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// Generate JWT
ipcMain.on('device.token', (event, arg) => {
  let secret, desktopId, mobileId, key;
  keytar.getPassword('fluxsync', 'jwt').then(val => {
    secret = val;
    mobileId = arg;
    return keytar.getPassword('fluxsync', 'id');
  }).then(val=>{
    desktopId = val;
    return keytar.getPassword('fluxsync', 'key');
  }).then(val=>{
    key = val;
    jwt.sign({ desktop:desktopId, mobile:mobileId}, secret, { expiresIn: '7d'},
    (err, token)=>{
      event.sender.send('device.token', JSON.stringify({
        'jwt' : token,
        'key' : key
      }))
    });
  });

});
