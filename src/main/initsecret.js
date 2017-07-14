module.exports = function(){
  const settings = require('electron-settings');
  const uuidv4 = require('uuid/v4');
  const keytar = require('keytar');

  // Check if this app has id. unless, create one.
  if(keytar.getPassword('app', 'id') == null){
    keytar.setPassword('app', 'id', uuidv4());
  }
  // always update hostname when app launched
  settings.set('app.hostname', os.hostname());

  // Generate JWT Secret
  if(keytar.getPassword('app', 'jwt') == null){
    keytar.setPassword('app', 'jwt', uuidv4());
  }

  // Generate Secret for encryption
  if(keytar.getPassword('app', 'key') == null){
    keytar.setPassword('app', 'key', uuidv4());
  }
};
