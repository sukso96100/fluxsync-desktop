const Vue = require('vue/dist/vue.js');
const {ipcRenderer} = require('electron');
const electronRemote = require('electron').remote;

const scanner = new Vue({
  el: '#app',
  methods: {
    closeModal: function(){
      electronRemote.getCurrentWindow().close();
    },
    refreshList: function(){
      if(!this.isScanning){
        this.isScanning = true;
        ipcRenderer.send('bluetooth.find', 'new');
      }
    },
    startScan: function(){
      this.isScanning = true;
      ipcRenderer.send('bluetooth.find', 'new');
      ipcRenderer.on('bluetooth.found', (event, arg)=>{
        let device = arg.split('\n')[0];
        this.devices.push({ name:device[0], address:device[1] });
      });
      ipcRenderer.on('bluetooth.done', (event, arg)=>{
        this.isScanning = false;
      });
    }
  },
  data: {
    devices: [],
    isScanning: true
  }
});

scanner.startScan();
scanner.devices.push({ name:"Youngbin Han's OnePlus 3T", address:"c0-ee-fb-e8-59-85"});
