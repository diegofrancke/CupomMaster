import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { CuponsList } from './pages/cupons-list/cupons-list';
import { CupomForm } from './pages/cupom-form/cupom-form';
import { LojasList } from './pages/lojas-list/lojas-list';
import { LojaForm } from './pages/loja-form/loja-form';
import { UsersList } from './pages/users-list/users-list';
import { UserForm } from './pages/user-form/user-form';
import { CupomUso } from './pages/cupom-uso/cupom-uso';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { AuthService } from './services/auth.service';

const rootRedirect = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};

export const routes: Routes = [
  { path: '', canActivate: [rootRedirect], children: [] },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'cupons', component: CuponsList, canActivate: [authGuard] },
  { path: 'cupons/novo', component: CupomForm, canActivate: [authGuard] },
  { path: 'cupons/editar/:id', component: CupomForm, canActivate: [authGuard] },
  { path: 'cupons/uso', component: CupomUso, canActivate: [authGuard] },
  { path: 'lojas', component: LojasList, canActivate: [authGuard] },
  { path: 'lojas/nova', component: LojaForm, canActivate: [authGuard] },
  { path: 'lojas/editar/:id', component: LojaForm, canActivate: [authGuard] },
  { path: 'usuarios', component: UsersList, canActivate: [authGuard] },
  { path: 'usuarios/novo', component: UserForm, canActivate: [authGuard] },
  { path: 'usuarios/editar/:id', component: UserForm, canActivate: [authGuard] },
  { path: '**', canActivate: [rootRedirect], children: [] }
];
