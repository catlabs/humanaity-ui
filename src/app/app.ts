import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = signal(this.authService.isAuthenticated());

  constructor() {
    // Update authentication status on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAuthenticated.set(this.authService.isAuthenticated());
      });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
