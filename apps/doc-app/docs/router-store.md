---
sidebar_position: 5
---

# RouterStore

Register the `RouterStoreModule` in your application to debug your state across all visited URLs. It stores the
related URL together with the current store, so you can replay your state changes by revisiting the related URL.

```ts title="app.config.ts"
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [provideStore({}), importProvidersFrom(RouterStoreModule)],
};
```

:::note
`RouterStoreModule` is an `NgModule`, so it is registered with `importProvidersFrom` in a standalone application.
It requires the Angular router to be provided.
:::
