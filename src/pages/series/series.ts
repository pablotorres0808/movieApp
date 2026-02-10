import { Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-series',
  imports: [MovieCard],
  template: `<div class="container mx-auto p-6 border border-green-50 m-4 rounded-3xl shadow-lg bg-white">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-green-100 pb-4">
        <h1 class="text-3xl font-bold text-emerald-800">Top Rated Series</h1>
        <div class="relative w-full md:w-96">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-emerald-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="text" (input)="onSearch($event)" 
                class="block w-full p-3 ps-10 text-sm text-gray-900 border border-green-200 rounded-full bg-green-50 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                placeholder="Buscar series...">
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (serie of series; track $index) {
          <!-- Reusing MovieCard but we might need to adapt it since TV interface is slightly different -->
            <app-movie-card [movie]="serie"></app-movie-card>
        }
    </div>
  </div>`
})
export class Series implements OnInit {

  movieService = inject(MovieService)
  series: Result[] = []
  originalSeries: Result[] = []
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.obtenerSeries();

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length === 0) {
          return [null];
        }
        return this.movieService.buscarSeries(query);
      })
    ).subscribe(data => {
      if (data === null) {
        this.series = [...this.originalSeries];
      } else {
        this.series = data.results.map((tv: any) => ({
          ...tv,
          title: tv.name,
          release_date: tv.first_air_date,
          original_title: tv.original_name,
          isTV: true
        }));
      }
    });
  }

  obtenerSeries() {
    this.movieService.obtenerSeries().subscribe({
      next: (data: any) => {
        // Mapping TV results to Movie interface to reuse the card component
        // TMDB returns 'name' for TV vs 'title' for Movie
        const mapped = data.results.map((tv: any) => ({
          ...tv,
          title: tv.name,
          release_date: tv.first_air_date,
          original_title: tv.original_name,
          isTV: true
        }))
        this.originalSeries = mapped;
        this.series = mapped;
        console.log(this.series);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

}
