import { NgModule } from '@angular/core';
import { RouterStore } from './router-service';

@NgModule({
  imports: [],
  providers: [RouterStore],
})
export class RouterStoreModule {
  constructor(routerStore: RouterStore) {
    routerStore.init();
  }
}
