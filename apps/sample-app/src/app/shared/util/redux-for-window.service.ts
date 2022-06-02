import { NgModule, NgZone } from '@angular/core';
import { StoreDevtools } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';

declare global {
  interface Window {
    storeDevtools: StoreDevtools;
    zone: NgZone;
  }
}

@NgModule({
  imports: [BrowserModule],
})
export class ReduxForWindowModule {
  constructor( storeDevtools: StoreDevtools,  zone: NgZone) {
    window.storeDevtools = storeDevtools;
    window.zone = zone;
  }
}
