---
sidebar_position: 5

---

# Testing

Import `storeTestingFactory` as a provider in your test, to mock the redux store.

```ts title="component.spec.ts"
import {TestBed} from '@angular/core/testing';
import {storeTestingFactory} from '@gernsdorfer/ngrx-lite/testing';
import {MyComponent} from "./my.component";

TestBed.configureTestingModule({
  declarations: [MyComponent],
  providers: [storeTestingFactory()],
});
```

:::note A full Test Example you can
find [here](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/src/app/basic/basic.component.spec.ts)
:::
