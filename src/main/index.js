const electron = require('electron');
const { Notification } = electron;

// Module to control application life.
const app = electron.app;
app.setAppUserModelId("orf,whatever.application-id");
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
console.log(process.version);
function createWindow () {
  //Load and show System Tray
  require('./tray').showTray(__dirname+'/../res/img/tray.png');
  // Init Secret
  require('./initsecret');
  // Start Websocket Server
  require('./server');
  // Create the browser window.
  let noti = new Notification({
    title: "Welcome to FluxSync",
    body: "Enjoy using FluxSync!"
  });
  noti.show();

  mainWindow = new BrowserWindow({width: 400, height: 600, titleBarStyle: 'hidden'});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../res/layout/shell.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  const bonjour = require('bonjour')();
  bonjour.unpublishAll(()=>{
    console.log("Service unpublished. closing...");
    app.quit()
  });

  // }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
