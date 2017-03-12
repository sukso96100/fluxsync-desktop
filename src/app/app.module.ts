import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { DeviceComponent } from './device.component'
import { RouterModule } from '@angular/router';



@NgModule({
  imports:      [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'device',
        component: DeviceComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    DeviceComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
