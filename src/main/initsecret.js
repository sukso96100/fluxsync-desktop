  const settings = require('electron-settings');
  const uuidv4 = require('uuid/v4');
  const keytar = require('keytar');
  const {ipcMain} = require('electron');

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

  ipcMain.on("isConnected", async (event, arg) => {
    let id = await keytar.getPassword('fluxsync', 'id');
    let jwt = await keytar.getPassword('fluxsync', 'jwt');
    let key = await keytar.getPassword('fluxsync', 'key');
    let isConnected = (id != null && jwt != null && key != null);
    event.sender.send("isConnected", isConnected);
  });

  ipcMain.on("disconnect", async (event, arg) => {
    keytar.deletPassword('fluxsync', 'id');
    keytar.deletPassword('fluxsync', 'jwt');
    keytar.deletPassword('fluxsync', 'key');
})
