import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigatorRef } from '../navigator-ref/navigator-ref'

@Component({
  selector: 'device-browser',
  templateUrl: './device-browser.component.html',
})

export class DeviceBrowserComponent implements OnInit {
  navigator: Navigator;
  permissionsGranted: boolean = false;
  devices: Array<MediaDeviceInfo>;
  error;

  constructor(navigatorRef: NavigatorRef) {
    this.navigator = navigatorRef.navigator;
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  async loadDevices() {
    try {
      this.devices = await this.navigator.mediaDevices.enumerateDevices();
    } catch (e) {
      this.error = e;
      this.devices = [];
    }
  }
}
