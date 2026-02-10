import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Result } from '../../app/interfaces/interface';

@Component({
    selector: 'app-series-detail',
    imports: [DecimalPipe, DatePipe, MovieCard],
    templateUrl: './series-detail.html',
    styles: `
    :host {
    display: block;
}
`,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SeriesDetail implements OnInit {
    activeRoute = inject(ActivatedRoute)
    movieS = inject(MovieService)
    sanitizer = inject(DomSanitizer)
    serie: any
    playerUrl!: SafeResourceUrl

    temporadaSeleccionada: number = 1
    episodioSeleccionado: number = 1
    episodios: any[] = []
    servidorSeleccionado: string = 'vidsrc_to' // Default al mejor para latino
    similares: Result[] = []
    esFavorito: boolean = false

    ngOnInit() {
        const id = this.activeRoute.snapshot.paramMap.get('id')
        if (id) {
            this.obtenerSerie(id)
        }
    }

    obtenerSerie(id: string) {
        this.movieS.obtenerSerieDetail(id).subscribe({
            next: (serie) => {
                this.serie = serie;
                this.cambiarTemporada(1); // Cargar temporada 1 por defecto
                this.obtenerSimilares(serie.id.toString());
                this.checkFavorito(serie.id);
            },
            error: (err) => { }
        })
    }

    cambiarTemporada(num: number) {
        this.temporadaSeleccionada = num;
        this.episodioSeleccionado = 1; // Reset a episodio 1 al cambiar temporada
        this.movieS.obtenerTemporada(this.serie.id, num).subscribe({
            next: (temp) => {
                this.episodios = temp.episodes;
                this.actualizarPlayer();
            },
            error: (err) => console.log('Error al obtener temporada', err)
        })
    }

    cambiarEpisodio(num: number) {
        this.episodioSeleccionado = num;
        this.actualizarPlayer();
    }

    actualizarPlayer() {
        let url = '';
        if (this.servidorSeleccionado === 'vidsrc_to') {
            // Servidor 1 - Vidsrc.to (Mejor para Latino)
            url = `https://vidsrc.to/embed/tv/${this.serie.id}/${this.temporadaSeleccionada}/${this.episodioSeleccionado}`;
        } else if (this.servidorSeleccionado === 'vidsrc_me') {
            // Servidor 2 - Vidsrc.me (Alternativa Latino)
            url = `https://vidsrc.me/embed/tv?tmdb=${this.serie.id}&season=${this.temporadaSeleccionada}&episode=${this.episodioSeleccionado}`;
        } else if (this.servidorSeleccionado === 'embed_su') {
            // Servidor 3 - Embed.su (Multi-idioma)
            url = `https://embed.su/embed/tv/${this.serie.id}/${this.temporadaSeleccionada}/${this.episodioSeleccionado}`;
        } else if (this.servidorSeleccionado === 'two_embed') {
            // Servidor 4 - 2embed (Buena cobertura)
            url = `https://www.2embed.cc/embedtv/${this.serie.id}&s=${this.temporadaSeleccionada}&e=${this.episodioSeleccionado}`;
        } else if (this.servidorSeleccionado === 'vidlink') {
            // Servidor 5 - VidLink (Rápido)
            url = `https://vidlink.pro/tv/${this.serie.id}/${this.temporadaSeleccionada}/${this.episodioSeleccionado}`;
        } else {
            // Servidor 6 - Multiembed (Backup)
            url = `https://multiembed.mov/?video_id=${this.serie.id}&tmdb=1&s=${this.temporadaSeleccionada}&e=${this.episodioSeleccionado}`;
        }
        this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    cambiarServidor(server: string) {
        this.servidorSeleccionado = server;
        this.actualizarPlayer();
    }

    obtenerSimilares(id: string) {
        this.movieS.obtenerSeriesSimilares(id).subscribe({
            next: (resp) => {
                this.similares = resp.results.slice(0, 4).map((tv: any) => ({
                    ...tv,
                    title: tv.name,
                    release_date: tv.first_air_date,
                    original_title: tv.original_name,
                    isTV: true
                }));
            },
            error: (err) => console.log('Error similares series', err)
        })
    }

    checkFavorito(id: number) {
        const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
        this.esFavorito = favorites.some((f: any) => f.id === id);
    }

    toggleFavorito() {
        const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
        if (this.esFavorito) {
            const index = favorites.findIndex((f: any) => f.id === this.serie.id);
            favorites.splice(index, 1);
        } else {
            favorites.push({
                id: this.serie.id,
                title: this.serie.name,
                poster_path: this.serie.poster_path,
                release_date: this.serie.first_air_date,
                vote_average: this.serie.vote_average,
                overview: this.serie.overview,
                isTV: true
            });
        }
        localStorage.setItem('favoritos', JSON.stringify(favorites));
        this.esFavorito = !this.esFavorito;
    }
}
