const {ipcRenderer} = require('electron');
const electronRemote = require('electron').remote;
const {BrowserWindow} = electronRemote;
const path = require('path');
const url = require('url');

module.exports = {
  template: require('../res/layout/device.html').layout,
  methods: {
    openScannerModal: function () {
      if(this.isConnected){
        ipcRenderer.send("disconnect");
      }else{
        let scannerWindow = new BrowserWindow(
          {width: 300, height: 500,
            parent: electronRemote.getCurrentWindow(),
            modal: true});
        scannerWindow.webContents.openDevTools();
        // and load the index.html of the app.
        scannerWindow.loadURL(url.format({
          pathname: path.join(__dirname, '../res/layout/scanner.html'),
          protocol: 'file:',
          slashes: true
        }))
        // console.log("Looking for devices...");
        // ipcRenderer.send('bluetooth.find','new');
        // ipcRenderer.on('bluetooth.found', (event, arg) => {
        //   console.log(`bluetooth.found : ${arg}`);
        // });
      }
    },
    mounted: function(){
      this.$nextTick(()=>{
        ipcRenderer.send("isConnected");
        ipcRenderer.on("isConnected", (event, arg)=>{
          this.isConnected = arg;
          if(this.isConnected){
            this.buttontext = "diconnect";
          }
        })
      })
    }
  },
  data: function() {
    return{
      isConnected: null,
      buttontext: "connect"
    }
  }
};
