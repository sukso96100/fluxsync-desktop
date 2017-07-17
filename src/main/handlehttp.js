const uuidv4 = require('uuid/v4');
const keytar = require('keytar');
const os = require('os');
const url = require('url');
const { ipcMain } = require('electron');

let deviceFindEvent = undefined;
ipcMain.on('device.find', (event, arg) => {
  deviceFindEvent = event;
});

module.exports = {
  info: function(req, res){
    os.hostname();
    res.writeHead(200);
    keytar.getPassword('fluxsync', 'id').then(val => {
      res.end(JSON.stringify({
        'type' : 'FluxSyncDesktopApp',
        'hostname' : os.hostname(),
        'id' : val
      }));
    });

  },
  reqKey: function(req, res) {

      if(deviceFindEvent != undefined){
        let query = url.parse(req.url, true).query;
        deviceFindEvent.sender.send('device.found',
          JSON.stringify({
          'hostname' : query.hostname,
          'id' : query.id
        }));
        res.writeHead(204);
        res.end();
      }else{
        res.writeHead(403);
        res.end();
      }

  }
  // getBody: function(req){
  //   return new new Promise(function(resolve, reject) {
  //     let body = [];
  //     req.on('error', (err) => {
  //       console.error(err);
  //       reject(err);
  //     }).on('data', (chunk) => {
  //       body.push(chunk);
  //     }).on('end', () => {
  //       body = Buffer.concat(body).toString();
  //       resolve(body);
  //     });
  //   });
  // }
};
