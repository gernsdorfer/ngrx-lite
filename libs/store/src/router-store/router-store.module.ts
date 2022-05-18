import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterStore } from './router-service';

@NgModule({
  imports: [BrowserModule],
  providers: [RouterStore],
})
export class RouterStoreModule {
  constructor(routerStore: RouterStore) {
    routerStore.init();
  }
}
