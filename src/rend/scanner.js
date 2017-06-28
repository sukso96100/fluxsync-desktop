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
      if(!this.scanning){
        this.scanning = true;
        ipcRenderer.send('bluetooth.find', 'new');
      }
    },
    startScan: function(){
      this.scanning = true;
      ipcRenderer.send('bluetooth.find', 'new');
      ipcRenderer.on('bluetooth.found', (event, arg)=>{
        this.devices.push(JSON.parse(arg));
      });
      ipcRenderer.on('bluetooth.done', (event, arg)=>{
        this.scanning = false;
      });
    }
  },
  data: {
    devices: [],
    scanning: true
  }
});

scanner.startScan();
