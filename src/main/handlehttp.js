const uuidv4 = require('uuid/v4');
const keytar = require('keytar');

module.exports = {
  info: function(req, res){
    os.hostname();
    res.writeHead(200);
    res.end(JSON.stringify({
      'type' : 'FluxSyncDesktopApp',
      'hostname' : os.hostname()
      'id' : keytar.getPassword('app', 'id')
    }));
  },
  genKey: function(req, res) {

  }
};
