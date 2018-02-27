const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const parser = require('url');
const {ipcMain} = require('electron');

const os = require('os');
const httpHandler = require('./handlehttp');
const websocketHandler = require('./handlesocket');
const bonjour = require('bonjour')({multicast:true});
const jwt = require('jsonwebtoken');
const keytar = require('keytar');
let jwtSecret, desktopId, mobileId, key, waitEvent;

ipcMain.on('device.wait', (event, arg)=>{
  waitEvent = event;
})

console.log("Starting Server...");
app.listen(0); // Listen on random port

let currentPort = app.address().port
console.log(`Running server on ${currentPort}`);
keytar.getPassword('fluxsync', 'id').then(val => {
  // Publish network service on network
  bonjour.publish({ name: `${os.hostname()}-FluxSync`,
   type: 'fluxsync', port: currentPort,
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
  .on('connection', (socket)=>{
    let authTimeout = setTimeout(()=>{
      socket.disconnect('unauthorized');
    }, 10000); // Wait for 10 sec
    // authenticate
    socket.on('authenticate', (data)=>{
      clearTimeout(authTimeout);
      if(mobileId==undefined){
        keytar.getPassword('fluxsync','mobileId').then((val)=>{
          mobileId = val;
        });
      }
      jwt.verify(data.token, jwtSecret, {issuer: desktopId, audience: mobileId},
      (err, decoded)=>{
        if(err){
          // If error, disconnect with device
          socket.emit('unauthorized');
          socket.disconnect();
        }else if(!err && decoded){
          // no connected with device
          socket.emit('authenticated');
          waitEvent.sender.send('device.connected','connected');
          console.log("Connected!");
          keytar.setPassword('fluxsync','mobileId', mobileId);
        }
      })
    });

  })

// Generate JWT
ipcMain.on('device.token', (event, arg) => {
  keytar.getPassword('fluxsync', 'jwt').then(val => {
    jwtSecret = val;
    mobileId = arg;
    return keytar.getPassword('fluxsync', 'id');
  }).then(val=>{
    desktopId = val;
    return keytar.getPassword('fluxsync', 'key');
  }).then(val=>{
    key = val;
    jwt.sign({ iss:desktopId, aud:mobileId }, jwtSecret, { expiresIn: '7d'},
    (err, token)=>{
      event.sender.send('device.token', JSON.stringify({
        'jwt' : token,
        'key' : key
      }))
    });
  });

});

ipcMain.on('device.getinfo', (event, arg) => {
  keytar.getPassword('fluxsync', 'id').then(val => {
    require('dns').lookup(os.hostname(),  (err, add, fam)=> {
     event.sender.send('device.getinfo', JSON.stringify({

        'deviceId' : val,
        'ip': addr,
        'port': currentPort,
        'hostname': os.hostname()
     }))
    })
  })
});
