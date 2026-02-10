import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { Result } from '../../app/interfaces/interface';
import { MovieService } from '../../app/services/movieService';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-estrenos',
  imports: [MovieCard],
  templateUrl: './estrenos.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Estrenos implements OnInit {
  estrenos: Result[] = []
  originalEstrenos: Result[] = []
  movieS = inject(MovieService)
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.obtenerEstrenos();

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length === 0) {
          return [null];
        }
        return this.movieS.buscarMovies(query);
      })
    ).subscribe(pelis => {
      if (pelis === null) {
        this.estrenos = [...this.originalEstrenos];
      } else {
        this.estrenos = pelis.results;
      }
    });
  }

  obtenerEstrenos() {
    this.movieS.obtenerEstrenos().subscribe(
      {
        next: (pelis) => {
          this.originalEstrenos = pelis.results;
          this.estrenos = pelis.results;
        },
        error: (err) => console.log('Error', err)
      }
    )
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }
}
