import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MovieDetail, Response } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  http = inject(HttpClient)
  API_URL = environment.api_url
  API_KEY = environment.api_key
  constructor() { }

  obtenerCartelera() {
    return this.http.get<Response>(`${this.API_URL}movie/now_playing?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerEstrenos() {
    return this.http.get<Response>(`${this.API_URL}movie/upcoming?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerMovie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}movie/${id}?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerSeries() {
    return this.http.get<Response>(`${this.API_URL}tv/top_rated?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerSerieDetail(id: string) {
    return this.http.get<any>(`${this.API_URL}tv/${id}?language=es-MX&api_key=${this.API_KEY}`)
  }

  buscarMovies(query: string) {
    return this.http.get<Response>(`${this.API_URL}search/movie?query=${query}&language=es-MX&api_key=${this.API_KEY}`)
  }

  buscarSeries(query: string) {
    return this.http.get<any>(`${this.API_URL}search/tv?query=${query}&language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerTemporada(id: string, seasonNumber: number) {
    return this.http.get<any>(`${this.API_URL}tv/${id}/season/${seasonNumber}?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerSimilares(id: string) {
    return this.http.get<Response>(`${this.API_URL}movie/${id}/similar?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerSeriesSimilares(id: string) {
    return this.http.get<Response>(`${this.API_URL}tv/${id}/similar?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerReparto(id: string) {
    return this.http.get<any>(`${this.API_URL}movie/${id}/credits?language=es-MX&api_key=${this.API_KEY}`)
  }

  obtenerRepartoSerie(id: string) {
    return this.http.get<any>(`${this.API_URL}tv/${id}/credits?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerSeriesPopulares() {
    return this.http.get<Response>(`${this.API_URL}tv/top_rated?language=es-ES&api_key=${this.API_KEY}`)
  }

  buscarContenido(query: string) {
    return this.http.get<any>(`${this.API_URL}search/multi?query=${query}&language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerPeliculasSimilares(id: string) {
    return this.http.get<Response>(`${this.API_URL}movie/${id}/similar?language=es-ES&api_key=${this.API_KEY}`)
  }
}
