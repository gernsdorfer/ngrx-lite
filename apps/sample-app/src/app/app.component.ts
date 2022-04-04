import { Component } from '@angular/core';
import { of } from 'rxjs';
import { getDefaultState, StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'ngrx-lite-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private counterStore = this.storeFactory.getStore<number, never>('counter');
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
}
