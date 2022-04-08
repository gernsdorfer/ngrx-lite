import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface Movie {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  getAll(): Observable<Movie[]> {
    return of([{ id: 1, name: 'myMovie1' }]).pipe(delay(300));
  }
}
