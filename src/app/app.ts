import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './shared/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('pt-web-viago');

  constructor(
    public toastService: ToastService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      if (hostname.includes('admin') && (pathname === '/' || pathname === '')) {
        this.router.navigate(['/admin']);
      }
    }
  }
}
