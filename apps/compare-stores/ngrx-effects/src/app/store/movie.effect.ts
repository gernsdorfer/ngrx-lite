import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap } from 'rxjs';
import { MovieService } from '@ngrx-lite/movie';
import { loadMovies, loadMoviesSuccess } from './movie.actions';

@Injectable()
export class MovieEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMovies),
      mergeMap(() =>
        this.movieService.getAll().pipe(
          map((movies) => loadMoviesSuccess({ movies })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private movieService: MovieService) {}
}
