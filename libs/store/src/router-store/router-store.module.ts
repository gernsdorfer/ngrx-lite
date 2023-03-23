import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterStore } from './router-service';

const init = (routerStore: RouterStore) => () => routerStore.init();

@NgModule({
  imports: [],
  providers: [
    RouterStore,
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [RouterStore],
      multi: true,
    },
  ],
})
export class RouterStoreModule {}
