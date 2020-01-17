import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigatorRef } from '../navigator-ref/navigator-ref'

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
})
export class LocalComponent implements OnInit {

  @ViewChild('hardwareVideo', { static: true })
  hardwareVideo: any;

  _mediaStreamConstraints: MediaStreamConstraints = { audio: true, video: true };

  _navigator: Navigator;
  localStream;
  devices: Array<MediaDeviceInfo>;
  error;

  constructor(navigatorRef: NavigatorRef) {
    this._navigator = navigatorRef.navigator;
  }

  ngOnInit(): void {
    this._navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        this.devices = devices;
      })
      .catch(function (err) {
        this.error = err;
      });
  }

  startStream() {
    const video = this.hardwareVideo.nativeElement;

    this._navigator.mediaDevices.getUserMedia(this._mediaStreamConstraints)
      .then((stream) => {
        this.localStream = stream;
        video.src = window.URL.createObjectURL(stream);
        video.play();
      })
      .catch(function (err) {
        this.error = err;
      });
  }
  stopStream() {
    const tracks = this.localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  }
}
