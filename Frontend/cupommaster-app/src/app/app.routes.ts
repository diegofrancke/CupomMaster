import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { CuponsList } from './pages/cupons-list/cupons-list';
import { CupomForm } from './pages/cupom-form/cupom-form';
import { LojasList } from './pages/lojas-list/lojas-list';
import { LojaForm } from './pages/loja-form/loja-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'cupons', component: CuponsList },
  { path: 'cupons/novo', component: CupomForm },
  { path: 'cupons/editar/:id', component: CupomForm },
  { path: 'lojas', component: LojasList },
  { path: 'lojas/nova', component: LojaForm },
  { path: 'lojas/editar/:id', component: LojaForm },
  { path: '**', redirectTo: '/dashboard' }
];
