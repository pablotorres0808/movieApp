import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [DatePipe, DecimalPipe],
  template: `<div class="movie-card bg-zinc-900 rounded-lg overflow-hidden cursor-pointer group relative">
    <div class="relative overflow-hidden">
      <img 
        class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" 
        src="https://image.tmdb.org/t/p/w500{{movie.poster_path}}" 
        alt="{{movie.title || $any(movie).name}}"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <button 
            (click)="navigateToDetails()" 
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
    <div class="p-3">
      <h5 class="text-white font-semibold text-sm mb-1 truncate">{{movie.title || $any(movie).name}}</h5>
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          {{movie.vote_average ? (movie.vote_average | number:'1.1-1') : 'N/A'}}
        </span>
        <span>•</span>
        <span>{{movie.release_date ? (movie.release_date | date:'yyyy') : ($any(movie).first_air_date | date:'yyyy')}}</span>
      </div>
    </div>
  </div>`
  ,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MovieCard {
  @Input({ required: true }) movie!: Result
  router = inject(Router)

  //Declaracion del metodo navigateToDetails
  navigateToDetails() {
    if ((this.movie as any).isTV) {
      this.router.navigateByUrl(`/series/${this.movie.id}`)
      return;
    }
    this.router.navigateByUrl(`/movie/${this.movie.id}`)
  }
}