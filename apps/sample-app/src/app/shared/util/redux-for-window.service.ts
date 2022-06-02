import { NgModule, NgZone } from '@angular/core';
import { LiftedState, StoreDevtools } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';
import { lastValueFrom, shareReplay } from 'rxjs';

declare global {
  interface Window {
    jumpToAction: StoreDevtools['jumpToAction'];
    importState: StoreDevtools['importState'];
    getLiftedState: (callback : (state:LiftedState) => void ) => void;
  }
}

@NgModule({
  imports: [BrowserModule],
})
export class ReduxForWindowModule {
  lastLiftedState = this.dev.liftedState.pipe(shareReplay(1));

  constructor(private dev: StoreDevtools, zone: NgZone) {
    window.jumpToAction = (id) => zone.run(() => dev.jumpToAction(id));
    window.importState = (state: LiftedState) =>
      zone.run(() => dev.importState(state));
    window.getLiftedState = (callback) =>
      lastValueFrom(this.lastLiftedState).then((state) => callback(state));
  }
}
