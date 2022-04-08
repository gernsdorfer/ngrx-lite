import { createAction, props } from '@ngrx/store';
import { Movie } from '@ngrx-lite/movie';

export const loadMovies = createAction('[Movies Page] Load Movies');
export const loadMoviesSuccess = createAction(
  '[Movies API] Movies Loaded Success',
  props<{ movies: Movie[] }>()
);
