import { Injectable, OnDestroy } from '@angular/core';
import { delay, of } from 'rxjs';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Injectable({providedIn: 'any'})
export class CounterStore implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    'serviceCounter'
  );

  public counterState$ = this.counterStore.state$;

  public inrement = this.counterStore.createLoadingEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(200))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
