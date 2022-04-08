import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import { loadMovies, loadMoviesSuccess } from './movie.actions';
import { Movie } from '@ngrx-lite/movie';

export interface MovieStore {
  isLoading: boolean;
  item?: Movie[];
  error?: [];
}
export const initialState: MovieStore = { isLoading: false };

export const movieReducer = createReducer(
  initialState,
  on(loadMovies, (state) => ({ ...state, isLoading: true })),
  on(loadMoviesSuccess, (state, { movies }) => ({
    isLoading: false,
    item: movies,
  }))
);

export const selectMovieStore = createFeatureSelector<MovieStore>('movieStore');
