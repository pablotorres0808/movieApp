import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Result } from '../../app/interfaces/interface';
import { ToastComponent } from '../../components/shared/toast/toast';

@Component({
    selector: 'app-series-detail',
    imports: [DecimalPipe, DatePipe, MovieCard, ToastComponent],
    templateUrl: './series-detail.html'
})
export class SeriesDetail implements OnInit {
    @ViewChild(ToastComponent) toast!: ToastComponent;

    route = inject(ActivatedRoute);
    movieS = inject(MovieService);
    sanitizer = inject(DomSanitizer);

    serie: any;
    playerUrl!: SafeResourceUrl;
    temporadaSeleccionada = 1;
    episodioSeleccionado = 1;
    episodios: any[] = [];
    servidorSeleccionado = 'vidsrc_to';
    similares: Result[] = [];
    esFavorito = false;
    cast: any[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) this.loadSerie(id);
        });
    }

    loadSerie(id: string) {
        this.movieS.obtenerSerieDetail(id).subscribe({
            next: (serie) => {
                this.serie = serie;
                this.cambiarTemporada(1);
                this.loadSimilar(serie.id.toString());
                this.loadCast(serie.id.toString());
                this.checkFav(serie.id);
            },
            error: () => { }
        });
    }

    cambiarTemporada(temp: number) {
        this.temporadaSeleccionada = temp;
        this.movieS.obtenerTemporada(this.serie.id.toString(), temp.toString()).subscribe({
            next: (data) => {
                this.episodios = data.episodes;
                if (this.episodios.length > 0) {
                    this.episodioSeleccionado = 1;
                    this.updatePlayer();
                }
            },
            error: () => { }
        });
    }

    cambiarEpisodio(ep: number) {
        this.episodioSeleccionado = ep;
        this.updatePlayer();
    }

    updatePlayer() {
        const url = `https://vidsrc.to/embed/tv/${this.serie.id}/${this.temporadaSeleccionada}/${this.episodioSeleccionado}`;
        this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    cambiarServidor(servidor: string) {
        this.servidorSeleccionado = servidor;
        let url = '';
        const s = this.temporadaSeleccionada;
        const e = this.episodioSeleccionado;
        switch (servidor) {
            case 'vidsrc_to': url = `https://vidsrc.to/embed/tv/${this.serie.id}/${s}/${e}`; break;
            case 'vidsrc_xyz': url = `https://vidsrc.xyz/embed/tv/${this.serie.id}/${s}/${e}`; break;
            case 'vidsrc_cc': url = `https://vidsrc.cc/v2/embed/tv/${this.serie.id}/${s}/${e}`; break;
            case 'vidsrc_me': url = `https://vidsrc.me/embed/tv/${this.serie.id}/${s}/${e}`; break;
            case 'vidlink': url = `https://vidlink.pro/tv/${this.serie.id}/${s}/${e}`; break;
            case 'multiembed': url = `https://multiembed.mov/directstream.php?video_id=${this.serie.id}&tmdb=1&s=${s}&e=${e}`; break;
        }
        this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    loadSimilar(id: string) {
        this.movieS.obtenerSeriesSimilares(id).subscribe({
            next: (resp) => {
                this.similares = resp.results.slice(0, 12).map(s => ({ ...s, isTV: true }));
            },
            error: () => { }
        });
    }

    loadCast(id: string) {
        this.movieS.obtenerRepartoSerie(id).subscribe({
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
            favs = favs.filter((f: any) => f.id !== this.serie.id);
        } else {
            favs.push({
                id: this.serie.id,
                title: this.serie.name,
                poster_path: this.serie.poster_path,
                release_date: this.serie.first_air_date,
                vote_average: this.serie.vote_average,
                overview: this.serie.overview,
                isTV: true
            });
        }
        localStorage.setItem('favoritos', JSON.stringify(favs));
        this.esFavorito = !this.esFavorito;

        if (this.toast) {
            this.toast.show(
                this.esFavorito ? `"${this.serie.name}" añadida a Mi Lista` : `"${this.serie.name}" eliminada de Mi Lista`,
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
