import { Component, OnDestroy } from '@angular/core';
import { getDefaultState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

@Component({
  selector: 'ngrx-lite-counter',
  templateUrl: 'basic.html',
})
export class CounterComponent implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>('counter');

  private incrementEffect = this.counterStore.createEffect(
    'increment',
    (counter: number) => of(counter + 1)
  );

  public counterState$ = this.counterStore.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number = 0) {
    this.incrementEffect(counter);
  }

  reset() {
    this.counterStore.setState({ ...getDefaultState() }, 'RESET');
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
