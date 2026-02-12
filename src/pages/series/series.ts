import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { ToastComponent } from '../../components/shared/toast/toast';

@Component({
  selector: 'app-series',
  imports: [MovieCard, ToastComponent],
  template: `
  <div class="w-full min-h-screen bg-black px-6 py-12">
    <div class="container mx-auto max-w-7xl">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-zinc-800 pb-6">
        <h1 class="text-4xl md:text-5xl font-bold text-white">Series Populares</h1>
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="text" (input)="onSearch($event)" 
            class="block w-full p-3 ps-10 text-sm text-white border border-zinc-700 rounded-full bg-zinc-900 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
            placeholder="Buscar series...">
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        @for (serie of series; track $index) {
          <app-movie-card [movie]="serie" (favoriteToggled)="onFavoriteToggled($event)"></app-movie-card>
        }
      </div>
    </div>
  </div>
  <app-toast></app-toast>`,
  styles: [`:host { display: block; background: #000000; }`]
})
export class Series implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  movieS = inject(MovieService);
  series: Result[] = [];

  ngOnInit() {
    this.movieS.obtenerSeriesPopulares().subscribe({
      next: (resp) => {
        this.series = resp.results.map(s => ({ ...s, isTV: true }));
      },
      error: () => { }
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    if (!query) {
      this.ngOnInit();
      return;
    }

    this.movieS.buscarContenido(query).subscribe({
      next: (resp: any) => {
        this.series = resp.results
          .filter((item: any) => item.media_type === 'tv')
          .map((s: any) => ({ ...s, isTV: true }));
      },
      error: () => { }
    });
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
