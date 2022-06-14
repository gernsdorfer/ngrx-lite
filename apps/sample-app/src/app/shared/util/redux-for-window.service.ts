import {APP_INITIALIZER, NgModule, NgZone} from '@angular/core';
import {StoreDevtools} from '@ngrx/store-devtools';

declare global {
  interface Window {
    storeDevtools: StoreDevtools;
    zone: NgZone;
  }
}

const init = (storeDevtools: StoreDevtools, zone: NgZone) => () => {
  window.storeDevtools = storeDevtools;
  window.zone = zone;
  return true;
}


@NgModule({
  imports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [StoreDevtools, NgZone],
      multi: true
    },
  ]
})
export class ReduxForWindowModule {
}
