import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieDetail, Result } from '../../app/interfaces/interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieCard } from '../../components/movie-card/movie-card';
import { ToastComponent } from '../../components/shared/toast/toast';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-movie',
  imports: [DecimalPipe, DatePipe, MovieCard, ToastComponent],
  templateUrl: './movie.html'
})
export class Movie {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  route = inject(ActivatedRoute);
  movieS = inject(MovieService);
  sanitizer = inject(DomSanitizer);

  movie!: MovieDetail;
  playerUrl!: SafeResourceUrl;
  servidorSeleccionado = 'vidsrc_icu';
  similares: Result[] = [];
  esFavorito = false;
  cast: any[] = [];

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadMovie(id);
    });
  }

  loadMovie(id: string) {
    this.movieS.obtenerMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.updatePlayer();
        this.loadSimilar(movie.id.toString());
        this.loadCast(movie.id.toString());
        this.checkFav(movie.id);
      },
      error: () => { }
    });
  }

  updatePlayer() {
    const key = (environment as any).vimeus_key;
    const url = `https://vidsrc.icu/embed/movie/${this.movie.id}?vsrc=${key}`;
    this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  cambiarServidor(servidor: string) {
    this.servidorSeleccionado = servidor;
    let url = '';
    const key = (environment as any).vimeus_key;
    switch (servidor) {
      case 'vidsrc_to': url = `https://vidsrc.to/embed/movie/${this.movie.id}`; break;
      case 'vidsrc_xyz': url = `https://vidsrc.xyz/embed/movie/${this.movie.id}`; break;
      case 'vidsrc_me': url = `https://vidsrc.me/embed/movie/${this.movie.id}`; break;
      case 'vidsrc_icu': url = `https://vidsrc.icu/embed/movie/${this.movie.id}?vsrc=${key}`; break;
      case 'vidsrc_net': url = `https://vidsrc.net/embed/movie/${this.movie.id}?vsrc=${key}`; break;
      case 'embed_su': url = `https://embed.su/embed/movie/${this.movie.id}`; break;
      case 'vidlink': url = `https://vidlink.pro/movie/${this.movie.id}`; break;
      case 'multiembed': url = `https://multiembed.mov/directstream.php?video_id=${this.movie.id}&tmdb=1`; break;
    }
    this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadSimilar(id: string) {
    this.movieS.obtenerPeliculasSimilares(id).subscribe({
      next: (resp) => this.similares = resp.results.slice(0, 12),
      error: () => { }
    });
  }

  loadCast(id: string) {
    this.movieS.obtenerReparto(id).subscribe({
      next: (resp) => this.cast = resp.cast.slice(0, 10),
      error: () => { }
    });
  }

  checkFav(id: number) {
    const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.esFavorito = favs.some((f: any) => f.id === id);
  }

  toggleFavorito() {
    let favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (this.esFavorito) {
      favs = favs.filter((f: any) => f.id !== this.movie.id);
    } else {
      favs.push({
        id: this.movie.id,
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        release_date: this.movie.release_date,
        vote_average: this.movie.vote_average,
        overview: this.movie.overview,
        isTV: false
      });
    }
    localStorage.setItem('favoritos', JSON.stringify(favs));
    this.esFavorito = !this.esFavorito;

    if (this.toast) {
      this.toast.show(
        this.esFavorito ? `"${this.movie.title}" añadida a Mi Lista` : `"${this.movie.title}" eliminada de Mi Lista`,
        true
      );
    }
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
