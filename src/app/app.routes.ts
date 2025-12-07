import {Routes} from '@angular/router';
import {cityRoutes} from './features/city/city.route';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/pages/signup/signup.page').then(m => m.SignupPage)
  },
  {path: 'cities', children: cityRoutes, canActivate: [authGuard]},
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/pages/admin-tools/admin-tools.page').then(m => m.AdminToolsPage),
    canActivate: [authGuard]
  },
  {path: '', redirectTo: '/cities', pathMatch: 'full'},
  {path: '**', redirectTo: '/cities'}
];
