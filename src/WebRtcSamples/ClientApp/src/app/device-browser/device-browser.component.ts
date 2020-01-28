import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigatorRef } from '../navigator-ref/navigator-ref'
import { Dictionary } from '../common/dictionary'

@Component({
  selector: 'device-browser',
  templateUrl: './device-browser.component.html',
})

export class DeviceBrowserComponent implements OnInit, OnDestroy {
  @ViewChild('videoElem', { static: false }) videoElem: ElementRef;
  @ViewChild('audioElem', { static: false }) audioElem: ElementRef;

  navigator: Navigator;
  permissionsGranted: boolean = false;
  isAttachMode: boolean = false;
  devices: Array<MediaDeviceInfo>;
  error;
  stream: MediaStream;
  tracks: MediaStreamTrack[];
  trackSettings: Dictionary<MediaTrackSettings>;

  constructor(navigatorRef: NavigatorRef, private changeDetectorRef: ChangeDetectorRef) {
    this.navigator = navigatorRef.navigator;
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  ngOnDestroy(): void {

  }

  onClose() {
    this.isAttachMode = false
    console.log("detaching");
  }

  attach(device: MediaDeviceInfo): void {
    this.isAttachMode = true;
    this.changeDetectorRef.detectChanges();
    console.log(this.mediaElement(device.kind));
    this.attachDeviceStream(device, this.mediaElement(device.kind));
  }

  detach(): void {
    this.tracks.forEach((track) => {
      track.stop();
    });
    this.isAttachMode = false;
  }

  mediaElement(deviceKind: MediaDeviceKind): HTMLMediaElement {
    if (deviceKind == "audioinput") {
      return this.audioElem.nativeElement as HTMLMediaElement;
    } else if (deviceKind == "videoinput") {
      return this.videoElem.nativeElement as HTMLMediaElement;
    }

    throw new Error("Only videoinput or audioinput devices are supported.")
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
