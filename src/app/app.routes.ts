import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { MainPage } from './pages/main-page/main-page';
import { Layout } from './common-ui/layout/layout';
import { Sidebar } from './common-ui/sidebar/sidebar';
import { canActivateAuth } from './guards/auth.access.guard';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [
  { path: '', component: Layout, children: [
      { path: 'main', component: MainPage }
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
];
