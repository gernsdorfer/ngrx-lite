import { NgModule, NgZone, inject, provideAppInitializer } from '@angular/core';
import { StoreDevtools } from '@ngrx/store-devtools';

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
};

@NgModule({
  imports: [],
  providers: [
    provideAppInitializer(() => {
      const initializerFn = init(inject(StoreDevtools), inject(NgZone));
      initializerFn();
      return;
    }),
  ],
})
export class ReduxForWindowModule {}
