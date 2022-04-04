import {Component, OnDestroy} from '@angular/core';
import {getDefaultState, StoreFactory} from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';

@Component({
  selector: 'my-basic-app',
  templateUrl: 'basic.html',
})
export class BasicExampleComponent implements OnDestroy {
  private counterStore = this.storeFactory.getStore<number, never>('basicCounter');

  public counterState$ = this.counterStore.state$;

  public increment = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(200))
  );

  constructor(private storeFactory: StoreFactory) {}

  reset() {
    this.counterStore.setState({ ...getDefaultState() }, 'RESET');
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
