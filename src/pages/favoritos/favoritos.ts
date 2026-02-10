import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Result } from '../../app/interfaces/interface';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [MovieCard],
  template: `
    <div class="w-full min-h-screen bg-black px-6 py-12">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Mi Lista</h1>
            <p class="text-gray-400">Tu colección personal de películas y series</p>
          </div>
          @if (favorites.length > 0) {
            <button 
              (click)="borrarTodos()" 
              class="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded transition-colors flex items-center gap-2 mt-4 md:mt-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Borrar Todo
            </button>
          }
        </div>

        @if (favorites.length === 0) {
          <div class="bg-zinc-900 rounded-lg p-20 text-center flex flex-col items-center">
            <div class="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Tu lista está vacía</h2>
            <p class="text-gray-400 mb-8 max-w-md">Explora nuestro catálogo y añade tus películas y series favoritas</p>
            <a href="/cartelera" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded transition-colors">
              Explorar Películas
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            @for (item of favorites; track item.id) {
              <app-movie-card [movie]="item"></app-movie-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #000000;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Favoritos implements OnInit {
  favorites: any[] = []

  ngOnInit() {
    this.obtenerFavoritos()
  }

  obtenerFavoritos() {
    const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.favorites = favorites;
  }

  borrarTodos() {
    if (confirm('¿Estás seguro de que quieres borrar todos tus favoritos?')) {
      localStorage.removeItem('favoritos');
      this.favorites = [];
    }
  }
}
