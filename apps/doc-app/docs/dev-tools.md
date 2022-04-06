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
    StoreDevtoolsModule.instrument({}),
  ],
})
export class AppModule {}

```


