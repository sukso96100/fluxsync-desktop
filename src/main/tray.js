

exports.showTray = function(iconpath){
  const { app, Tray, Menu} = require('electron');

  let tray = null;
    console.log('starting system tray');
    console.log(__dirname);
    console.log(iconpath);
    tray = new Tray(iconpath);
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Item1', type: 'radio'},
      {label: 'Item2', type: 'radio'},
      {label: 'Item3', type: 'radio', checked: true},
      {label: 'Item4', type: 'radio'}
    ]);
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
    console.log('system tray started');

}
