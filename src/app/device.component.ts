import { Component } from '@angular/core';

@Component({
  selector: 'device',
  templateUrl: 'res/layout/device.html'
})
export class DeviceComponent {
  disconnectFromDevice(){

  }

  findDevice(){
    console.log("Looking for device.")
  }
}
