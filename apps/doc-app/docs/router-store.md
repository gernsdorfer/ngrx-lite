---
sidebar_position: 6

---

# RouterStore

Import the `RouterStoreModule` into your main application to debug your state across all visited URL's. This module
store's related URL to the current Store.  
So it's possible to replay your state changes by revisiting the related url.

```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';

@NgModule({
  imports: [RouterStoreModule]
})
export class AppModule {}

```

