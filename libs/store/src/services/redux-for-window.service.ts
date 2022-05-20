import { NgModule, NgZone } from '@angular/core';
import { LiftedState, StoreDevtools } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';

declare global {
  interface Window {
    jumpToAction: StoreDevtools['jumpToAction'];
    importState: StoreDevtools['importState'];
  }
}

@NgModule({
  imports: [BrowserModule],
})
export class ReduxForWindowModule {
  constructor(dev: StoreDevtools, zone: NgZone) {
    window.jumpToAction = (id) => zone.run(() => dev.jumpToAction(id));
    window.importState = (state: LiftedState) =>
      zone.run(() => dev.importState(state));
  }
}
