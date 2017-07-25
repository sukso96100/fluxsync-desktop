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
const ioJwt = require('socketio-jwt');
const keytar = require('keytar');
let secret, desktopId, mobileId, key;


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
io.sockets
  .on('connection', ioJwt.authorize({
    secret: secret,
    issuer: desktopId,
    audience: mobileId,
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', (socket)=>{
    //this socket is authenticated, we are good to handle more events from it.
    console.log('Connected with mobile device!');
  });

// Generate JWT
ipcMain.on('device.token', (event, arg) => {
  keytar.getPassword('fluxsync', 'jwt').then(val => {
    secret = val;
    mobileId = arg;
    return keytar.getPassword('fluxsync', 'id');
  }).then(val=>{
    desktopId = val;
    return keytar.getPassword('fluxsync', 'key');
  }).then(val=>{
    key = val;
    jwt.sign({ iss:desktopId, aud:mobileId }, secret, { expiresIn: '7d'},
    (err, token)=>{
      event.sender.send('device.token', JSON.stringify({
        'jwt' : token,
        'key' : key
      }))
    });
  });

});
