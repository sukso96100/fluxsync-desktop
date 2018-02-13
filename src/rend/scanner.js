const Vue = require('vue/dist/vue.js');
const QRCode = require('qrcode');
const {ipcRenderer} = require('electron');
const electronRemote = require('electron').remote;
const os = electronRemote.require('os');

const scanner = new Vue({
  el: '#app',
  methods: {
    closeModal: function(){
      electronRemote.getCurrentWindow().close();
    },
    // refreshList: function(){
    //   if(!this.scanning){
    //     this.scanning = true;
    //     ipcRenderer.send('device.find', 'new');
    //   }
    // },
    startScan: function(){
      this.scanning = true;
      ipcRenderer.send('device.find', 'new');
      ipcRenderer.on('device.found', (event, arg)=>{
        this.devices.push(JSON.parse(arg));
        if(this.isManual){
          this.reqToken(arg.id);
        }
      });
    },
    reqToken: function(id){
      // Request token
      ipcRenderer.send('device.token', id);
      // Generate QR Code from token
      ipcRenderer.on('device.token', (event, arg)=>{
        this.waitForConnection()
        this.showQr = true;
        QRCode.toCanvas(document.getElementById('canvas'), arg,
        (error)=>{
          if (error) console.error(error)
          console.log('success!');
        });

      });
    },
    waitForConnection: function(){
        ipcRenderer.send('device.wait', 'connection');
        ipcRenderer.on('device.connected', (event, arg)=>{
          this.closeModal()
        });
    },
    connectManual: function(){
      ipcRenderer.send('device.getinfo', "");
      ipcRenderer.on('device.getinfo', (event, arg)=>{
        this.isManual = true;
        this.showQr = true;
        console.log(arg);
        QRCode.toCanvas(document.getElementById('canvas'), arg,
        (error)=>{
          if (error) console.error(error)
          console.log('success!');
        });
      })
    }
  },
  data: {
    devices: [],
    scanning: true,
    showQr: false,
    hostname: os.hostname(),
    isManual: false
  }
});

scanner.startScan();
