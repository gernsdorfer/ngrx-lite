import { Component } from '@angular/core';
import { MovieStore } from './store/movie.store';

@Component({
  selector: 'ngrx-lite-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  movieState$ = this.movieStore.movieState$;

  constructor(private movieStore: MovieStore) {}

  loadMovies() {
    this.movieStore.load(undefined);
  }
}
