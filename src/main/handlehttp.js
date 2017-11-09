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
  reqKey: function(req, res) {
      if(deviceFindEvent != undefined){
        let query = url.parse(req.url, true).query;
        deviceFindEvent.sender.send('device.found',
          JSON.stringify({
          'hostname' : query.hostname,
          'id' : query.id
        }));
        res.writeHead(204);
        res.end(JSON.stringify({"result":"done"}));
      }else{
        res.writeHead(403);
        res.end();
      }

  }

};
