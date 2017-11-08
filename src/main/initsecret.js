  const settings = require('electron-settings');
  const uuidv4 = require('uuid/v4');
  const keytar = require('keytar-prebuild');

  // Check if this app has id. unless, create one.
  keytar.getPassword('fluxsync', 'id').then(val=>{
    if(val == null){
      keytar.setPassword('fluxsync', 'id', uuidv4());
    }
  });


  // Generate JWT Secret
  keytar.getPassword('fluxsync', 'jwt').then(val=>{
    if(val == null){
    keytar.setPassword('fluxsync', 'jwt', uuidv4());
    }
  });

  // Generate Secret for encryption
  keytar.getPassword('fluxsync', 'key').then(val=>{
    if(val == null){
    keytar.setPassword('fluxsync', 'key', uuidv4());
    }
  });
