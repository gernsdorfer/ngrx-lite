---
sidebar_position: 3
---

# Store Devtools

To debug your state with the [Redux Devtools Extension](https://github.com/reduxjs/redux-devtools), install and
register [@ngrx/store-devtools](https://ngrx.io/guide/store-devtools).

```ts title="app.config.ts"
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({}),
    provideEffects([]),
    provideStoreDevtools({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: !isDevMode(),
      // define the monitor property here
      monitor: (state, action) => action,
    }),
  ],
};
```

:::caution
It's important to set the `monitor` property in your devtools config, otherwise importing a state is not possible.
The library reads the monitored actions to re-register reducers for stores that are not currently mounted.
:::

:::note
`maxAge` should be `5` or higher. With a lower value the library warns on the console, because too few retained
actions break the time-travel sync.
:::
