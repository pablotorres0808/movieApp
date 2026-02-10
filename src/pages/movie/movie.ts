import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieDetail, Result } from '../../app/interfaces/interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-movie',
  imports: [DecimalPipe, DatePipe, MovieCard],
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
  servidorSeleccionado: string = 'vidsrc_to' // Default al mejor para latino
  similares: Result[] = []
  esFavorito: boolean = false

  constructor() {
    const id = this.activeRoute.snapshot.paramMap.get('id')
    if (id) {
      this.obtenerMovie(id)
    }
  }

  //Declaracion de funcion para obtener los detalles de la pelicula
  obtenerMovie(id: string) {
    this.movieS.obtenerMovie(id).subscribe(
      {
        next: (movie) => {
          this.movie = movie;
          this.actualizarPlayer();
          this.obtenerSimilares(movie.id.toString());
          this.checkFavorito(movie.id);
        },
        error: (err) => { }
      }
    )
  }

  cambiarServidor(server: string) {
    this.servidorSeleccionado = server;
    this.actualizarPlayer();
  }

  actualizarPlayer() {
    let url = '';
    if (this.servidorSeleccionado === 'vidsrc_to') {
      // Servidor 1 - Vidsrc.to (Mejor para Latino)
      url = `https://vidsrc.to/embed/movie/${this.movie.id}`;
    } else if (this.servidorSeleccionado === 'vidsrc_me') {
      // Servidor 2 - Vidsrc.me (Alternativa Latino)
      url = `https://vidsrc.me/embed/movie?tmdb=${this.movie.id}`;
    } else if (this.servidorSeleccionado === 'embed_su') {
      // Servidor 3 - Embed.su (Multi-idioma)
      url = `https://embed.su/embed/movie/${this.movie.id}`;
    } else if (this.servidorSeleccionado === 'two_embed') {
      // Servidor 4 - 2embed (Buena cobertura)
      url = `https://www.2embed.cc/embed/${this.movie.id}`;
    } else if (this.servidorSeleccionado === 'vidlink') {
      // Servidor 5 - VidLink (Rápido)
      url = `https://vidlink.pro/movie/${this.movie.id}`;
    } else {
      // Servidor 6 - Multiembed (Backup)
      url = `https://multiembed.mov/?video_id=${this.movie.id}&tmdb=1`;
    }
    this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  obtenerSimilares(id: string) {
    this.movieS.obtenerSimilares(id).subscribe({
      next: (resp) => this.similares = resp.results.slice(0, 4),
      error: (err) => console.log('Error similares', err)
    })
  }

  checkFavorito(id: number) {
    const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.esFavorito = favorites.some((f: any) => f.id === id);
  }

  toggleFavorito() {
    const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (this.esFavorito) {
      const index = favorites.findIndex((f: any) => f.id === this.movie.id);
      favorites.splice(index, 1);
    } else {
      favorites.push({
        id: this.movie.id,
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        release_date: this.movie.release_date,
        vote_average: this.movie.vote_average,
        overview: this.movie.overview,
        isTV: false
      });
    }
    localStorage.setItem('favoritos', JSON.stringify(favorites));
    this.esFavorito = !this.esFavorito;
  }
}
