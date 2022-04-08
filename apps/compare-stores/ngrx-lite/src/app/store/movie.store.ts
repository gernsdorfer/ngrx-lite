import { Movie, MovieService } from '@ngrx-lite/movie';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class MovieStore implements OnDestroy {
  private movieStore = this.storeFactory.createStore<Movie[], []>('movieStore');

  public load = this.movieStore.createEffect('increment', () =>
    this.movieService.getAll()
  );

  public movieState$ = this.movieStore.state$;

  constructor(
    private storeFactory: StoreFactory,
    private movieService: MovieService
  ) {}

  ngOnDestroy() {
    this.movieStore.ngOnDestroy();
  }
}
