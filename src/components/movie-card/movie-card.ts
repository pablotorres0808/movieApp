import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Result } from '../../app/interfaces/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [],
  template: ` <div class="bg-white block max-w-sm p-4 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 mb-4 border border-green-100">
                <img class="rounded-2xl shadow-md" src="https://image.tmdb.org/t/p/w500{{movie.poster_path}}" alt=""/>
                <h5 class="mt-4 mb-2 text-xl font-bold tracking-tight text-emerald-800">{{movie.title}}</h5>
                <p class="mb-4 text-sm text-gray-600"> 
                  {{
                      movie.overview.length > 50 ? movie.overview.substring
                      (0,80) + '...' : movie.overview
                  }}
                </p>
                <div class="flex flex-row gap-2">
                  <a (click)="navigateToDetails()" class="inline-flex items-center text-emerald-700 bg-green-100 hover:bg-green-200 font-bold text-sm px-4 py-2 cursor-pointer rounded-full mb-1">
                      Read more
                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmins="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                  </a>
                  <a class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 rounded-full transition-colors flex items-center justify-center gap-1 shadow-md mb-1" 
                     [href]="$any(movie).isTV ? 'https://vidlink.pro/tv/' + movie.id : 'https://vidlink.pro/movie/' + movie.id" target="_blank">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span class="text-sm">Play</span>
                  </a>
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
      // For now, series don't have a detail page, so we could just return or show an alert
      console.log('Series detail page not implemented yet');
      return;
    }
    this.router.navigateByUrl(`/movie/${this.movie.id}`)
  }
}