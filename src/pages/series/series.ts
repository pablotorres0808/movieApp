import { Component, inject } from '@angular/core';
import { MovieService } from '../../app/services/movieService';
import { Result } from '../../app/interfaces/interface';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-series',
  imports: [MovieCard],
  template: `<div class="container mx-auto p-6 border border-green-50 m-4 rounded-3xl shadow-lg bg-white">
    <h1 class="text-3xl font-bold mb-6 text-emerald-800 border-b border-green-100 pb-4">Top Rated Series</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (serie of series; track $index) {
          <!-- Reusing MovieCard but we might need to adapt it since TV interface is slightly different -->
            <app-movie-card [movie]="serie"></app-movie-card>
        }
    </div>
  </div>`
})
export class Series {

  movieService = inject(MovieService)
  series: Result[] = []

  ngOnInit() {
    this.movieService.obtenerSeries().subscribe({
      next: (data: any) => {
        // Mapping TV results to Movie interface to reuse the card component
        // TMDB returns 'name' for TV vs 'title' for Movie
        this.series = data.results.map((tv: any) => ({
          ...tv,
          title: tv.name,
          release_date: tv.first_air_date,
          original_title: tv.original_name,
          isTV: true
        }))
        console.log(this.series);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
