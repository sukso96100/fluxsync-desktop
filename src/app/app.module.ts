import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { RouterModule } from '@angular/router';

//components
import { DeviceComponent } from './device.component'
import { ClipboardComponent } from './clipboard.component'
import { SmsComponent } from './sms.component'
import { SettingsComponent } from './settings.component'

@NgModule({
  imports:      [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'device',
        component: DeviceComponent
      },
      {
        path: 'clipboard',
        component: ClipboardComponent
      },
      {
        path: 'sms',
        component: SmsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    DeviceComponent,
    ClipboardComponent,
    SmsComponent,
    SettingsComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
