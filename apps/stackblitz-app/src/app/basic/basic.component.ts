import { Component } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';

@Component({
  selector: 'my-basic-app',
  templateUrl: 'basic.html',
})
export class BasicExampleComponent {
  private counterStore = this.storeFactory.getStore<number, never>('counter');

  public counterState$ = this.counterStore.state$;

  public inrement = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(500))
  );

  constructor(private storeFactory: StoreFactory) {}
}
