import { Injectable } from '@angular/core';
import {select, Store} from '@ngrx/store';
import { loadMovies } from './movie.actions';
import {selectMovieStore} from "./movie.reducer";

@Injectable()
export class MovieStore {
  public movieState$ = this.store.pipe(select(selectMovieStore));

  constructor(private store: Store<{ movie: MovieStore }>) {}

  public load(): void {
    this.store.dispatch(loadMovies());
  }
}
