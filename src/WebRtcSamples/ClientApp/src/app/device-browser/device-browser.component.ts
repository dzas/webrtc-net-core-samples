import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigatorRef } from '../navigator-ref/navigator-ref'
import { Dictionary } from '../common/dictionary'

@Component({
  selector: 'device-browser',
  templateUrl: './device-browser.component.html',
})

export class DeviceBrowserComponent implements OnInit, OnDestroy {
  @ViewChild('elem', { static: false }) elem: ElementRef;
  //@ViewChild('audioElem', { static: false }) audioElem: ElementRef;

  navigator: Navigator;
  permissionsGranted: boolean = false;
  devices: Array<MediaDeviceInfo>;
  error;
  stream: MediaStream;
  tracks: MediaStreamTrack[];
  trackSettings: Dictionary<MediaTrackSettings>;
  attachedDevice: MediaDeviceInfo;

  constructor(navigatorRef: NavigatorRef, private changeDetectorRef: ChangeDetectorRef) {
    this.navigator = navigatorRef.navigator;
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  ngOnDestroy(): void {
    if (this.attachedDevice) {
      this.detach();
    }
  }

  attach(device: MediaDeviceInfo): void {
    this.attachedDevice = device;
    this.changeDetectorRef.detectChanges();
    console.log(this.elem.nativeElement);
    this.attachDeviceStream(device, this.elem.nativeElement);
  }

  detach(): void {
    this.tracks.forEach((track) => {
      track.stop();
    });
    this.attachedDevice = void 0;
  }

  async loadDevices() {
    try {
      this.devices = await this.navigator.mediaDevices.enumerateDevices();
    } catch (e) {
      this.error = e;
      this.devices = [];
    }
  }

  private createConstraint(device: MediaDeviceInfo): MediaStreamConstraints {
    let trackConstraints: MediaTrackConstraints = {
      deviceId: device.deviceId
    }

    if (device.kind == "audioinput") {
      return {
        audio: trackConstraints
      }
    } else if (device.kind == "videoinput") {
      return {
        video: trackConstraints
      }
    }
    else {
      throw new Error("Only videoinput or audioinput devices are supported.")
    }
  }

  async attachDeviceStream(device: MediaDeviceInfo, elem: HTMLMediaElement) {
    try {
      let constraints = this.createConstraint(device)

      let stream = await this.navigator.mediaDevices.getUserMedia(constraints);
      if (stream) {
        this.stream = stream;
        this.tracks = stream.getTracks();
        this.trackSettings = {};

        this.tracks.forEach((track) => {
          this.trackSettings[track.id] = track.getSettings();
        });

        elem.srcObject = stream;
        elem.play();
      }
    } catch (e) {
      throw e;
    }
  }
}
