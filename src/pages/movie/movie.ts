import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieDetail } from '../../app/interfaces/interface';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie',
  imports: [DecimalPipe, DatePipe, CurrencyPipe],
  templateUrl: './movie.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Movie {
  activeRoute = inject(ActivatedRoute)
  movieS = inject(MovieService)
  sanitizer = inject(DomSanitizer)
  movie!: MovieDetail
  playerUrl!: SafeResourceUrl

  constructor() {
    const id = this.activeRoute.snapshot.paramMap.get('id')
    console.log('ID de la pelicula: ', id)
    if (id) {
      this.obtenerMovie(id)
    }
  }

  //Declaracion de funcion para obtener los detalles de la pelicula
  obtenerMovie(id: string) {
    this.movieS.obtenerMovie(id).subscribe(
      {
        next: (movie) => {
          console.log(movie),
            this.movie = movie;
          this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://vidlink.pro/movie/${movie.id}`);
        },
        error: (err) => console.log('Error', err)
      }
    )
  }
}
