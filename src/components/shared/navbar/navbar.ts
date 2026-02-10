import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `<nav class="bg-gradient-to-r from-green-400 to-emerald-600 text-white sticky w-full z-20 top-0 start-0 shadow-lg mb-4 rounded-b-3xl">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center text-2xl font-bold whitespace-nowrap drop-shadow-md">MovieApp</span>
      </a>
      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button type="button" class="text-emerald-700 bg-white hover:bg-green-50 font-bold text-sm px-6 py-2 shadow-md">Get started</button>
          <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-full md:hidden hover:bg-white/20 focus:outline-none" aria-controls="navbar-sticky" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
          </button>
      </div>
      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 bg-white/10 md:bg-transparent rounded-2xl backdrop-blur-sm">
          <li>
            <a href="#" routerLink="/home" routerLinkActive="bg-white/30 text-white font-bold" class="block py-2 px-4 rounded-full text-white hover:bg-white/20 transition-all md:p-2 md:px-4" aria-current="page">Home</a>
          </li>
          <li>
            <a href="#" routerLink="/funciones" routerLinkActive="bg-white/30 text-white font-bold" class="block py-2 px-4 rounded-full text-white hover:bg-white/20 transition-all md:p-2 md:px-4">Funciones</a>
          </li>
          <li>
            <a href="#" routerLink="/cartelera" routerLinkActive="bg-white/30 text-white font-bold" class="block py-2 px-4 rounded-full text-white hover:bg-white/20 transition-all md:p-2 md:px-4">Cartelera</a>
          </li>
          <li>
            <a href="#" routerLink="/estrenos" routerLinkActive="bg-white/30 text-white font-bold" class="block py-2 px-4 rounded-full text-white hover:bg-white/20 transition-all md:p-2 md:px-4">Estrenos</a>
          </li>
          <li>
            <a href="#" routerLink="/series" routerLinkActive="bg-white/30 text-white font-bold" class="block py-2 px-4 rounded-full text-white hover:bg-white/20 transition-all md:p-2 md:px-4">Series</a>
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