import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [],
    template: `
    @if (visible()) {
      <div class="fixed top-4 right-4 z-50 animate-slide-in">
        <div class="bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]">
          <div class="flex-shrink-0">
            @if (isSuccess()) {
              <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            } @else {
              <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            }
          </div>
          <div class="flex-1">
            <p class="text-white font-semibold text-sm">{{ message() }}</p>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
    visible = signal(false);
    message = signal('');
    isSuccess = signal(true);

    show(message: string, isSuccess: boolean = true) {
        this.message.set(message);
        this.isSuccess.set(isSuccess);
        this.visible.set(true);

        setTimeout(() => {
            this.visible.set(false);
        }, 3000);
    }
}
