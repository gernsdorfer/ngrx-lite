import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { RouterStore } from './router-service';

const init = (routerStore: RouterStore) => () => routerStore.init();

@NgModule({
  imports: [],
  providers: [
    RouterStore,
    provideAppInitializer(() => {
      const initializerFn = init(inject(RouterStore));
      return initializerFn();
    }),
  ],
})
export class RouterStoreModule {}
