import {Routes} from '@angular/router';
import {cityRoutes} from './city/city.route';
import {authGuard} from './auth/auth.guard';
import {LoginPage} from './auth/pages/login/login.page';
import {SignupPage} from './auth/pages/signup/signup.page';
import {AdminToolsPage} from './admin/pages/admin-tools/admin-tools.page';

export const routes: Routes = [
  {path: 'login', component: LoginPage},
  {path: 'signup', component: SignupPage},
  {path: 'cities', children: cityRoutes, canActivate: [authGuard]},
  {path: 'admin', component: AdminToolsPage, canActivate: [authGuard]},
  {path: '', redirectTo: '/cities', pathMatch: 'full'},
  {path: '**', redirectTo: '/cities'}
];
