import { Injectable } from '@angular/core';

function _navigator(): Navigator {
  return window.navigator;
}

@Injectable()
export class NavigatorRef {

  get navigator(): any {
    return _navigator();
  }
}
