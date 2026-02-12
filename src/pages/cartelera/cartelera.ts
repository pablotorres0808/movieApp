import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { ToastComponent } from '../../components/shared/toast/toast';

@Component({
  selector: 'app-cartelera',
  imports: [MovieCard, ToastComponent],
  templateUrl: './cartelera.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Cartelera implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  cartelera: Result[] = []
  originalCartelera: Result[] = []
  movieS = inject(MovieService)
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.obtenerCartelera();

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
        this.cartelera = [...this.originalCartelera];
      } else {
        this.cartelera = pelis.results;
      }
    });
  }

  obtenerCartelera() {
    this.movieS.obtenerCartelera().subscribe(
      {
        next: (pelis) => {
          this.originalCartelera = pelis.results;
          this.cartelera = pelis.results;
        },
        error: (err) => console.log('Error', err)
      }
    )
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  onFavoriteToggled(event: { added: boolean, title: string }) {
    if (this.toast) {
      this.toast.show(
        event.added ? `"${event.title}" añadida a Mi Lista` : `"${event.title}" eliminada de Mi Lista`,
        true
      );
    }
  }
}
