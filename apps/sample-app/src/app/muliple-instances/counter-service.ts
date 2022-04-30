import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { delay, of } from 'rxjs';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export const MultipleCounterStoreName = new InjectionToken(
  'MultipleCounterStore'
);

@Injectable()
export class MultipleCounterStore implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    this.storeName
  );

  public counterState$ = this.counterStore.state$;

  public inrement = this.counterStore.createLoadingEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(200))
  );

  constructor(
    private storeFactory: StoreFactory,
    @Inject(MultipleCounterStoreName)
    private storeName: string = 'MultipleCounterStoreName'
  ) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
