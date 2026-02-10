import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `<nav class="bg-black/95 backdrop-blur-md text-white sticky w-full z-50 top-0 border-b border-white/10">
    <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-6 py-4">
      <a href="/" class="flex items-center space-x-2">
        <span class="text-3xl font-black text-red-600">MOVIE</span>
        <span class="text-3xl font-light">APP</span>
      </a>
      <div class="flex md:order-2 space-x-3">
        <button data-collapse-toggle="navbar-sticky" type="button" 
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-white md:hidden hover:bg-white/10 rounded-md transition-all" 
          aria-controls="navbar-sticky" aria-expanded="false">
          <span class="sr-only">Open menu</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 md:flex-row md:mt-0 bg-black/50 md:bg-transparent rounded-lg md:rounded-none">
          <li>
            <a href="#" routerLink="/home" routerLinkActive="text-red-600 font-semibold" 
              class="block py-2 px-4 text-gray-300 hover:text-white transition-colors">
              Inicio
            </a>
          </li>
          <li>
            <a href="#" routerLink="/cartelera" routerLinkActive="text-red-600 font-semibold" 
              class="block py-2 px-4 text-gray-300 hover:text-white transition-colors">
              Películas
            </a>
          </li>
          <li>
            <a href="#" routerLink="/series" routerLinkActive="text-red-600 font-semibold" 
              class="block py-2 px-4 text-gray-300 hover:text-white transition-colors">
              Series
            </a>
          </li>
          <li>
            <a href="#" routerLink="/favoritos" routerLinkActive="text-red-600 font-semibold" 
              class="block py-2 px-4 text-gray-300 hover:text-white transition-colors">
              Mi Lista
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`,
  styles: `
      :host {
        display: block;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar { }