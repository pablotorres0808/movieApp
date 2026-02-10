import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-series-detail',
    imports: [DecimalPipe, DatePipe],
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

    ngOnInit() {
        const id = this.activeRoute.snapshot.paramMap.get('id')
        if (id) {
            this.obtenerSerie(id)
        }
    }

    obtenerSerie(id: string) {
        this.movieS.obtenerSerieDetail(id).subscribe({
            next: (serie) => {
                console.log('Detalle de serie:', serie)
                this.serie = serie;
                this.playerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://vidlink.pro/tv/${serie.id}`);
            },
            error: (err) => console.log('Error al obtener serie', err)
        })
    }
}
