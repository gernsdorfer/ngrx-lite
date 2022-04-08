import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Movie, MovieService } from '@ngrx-lite/movie';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';

interface MoviesState {
  isLoading: boolean;
  item?: Movie[];
  error?: [];
}

@Injectable()
export class MovieStore extends ComponentStore<MoviesState> {
  constructor(private movieService: MovieService) {
    super({ isLoading: false });
  }

  readonly load = this.effect((movieId$: Observable<void>) => {
    return movieId$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.movieService.getAll().pipe(
          tapResponse(
            (movies: Movie[]) =>
              this.setState({ isLoading: false, item: movies }),
            () => this.setState({ isLoading: false, error: [] })
          ),
          catchError(() => EMPTY)
        )
      )
    );
  });
}
