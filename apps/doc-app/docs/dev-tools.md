---
sidebar_position: 4
---

# Store Devtools

For Debug the State with the [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension/), it's
only necessary to install and register the [@ngrx/store-devtools](https://ngrx.io/guide/store-devtools) in your root Module.

```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      // define the monitor Property here
      monitor: (state, action) => action,
    }),
  ],
})
export class AppModule {}
```

:::note It's important to set the `monitor` property in your devToolConfig, otherwise an State Import is not possible.
:::
