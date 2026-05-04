import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { MainPage } from './pages/main-page/main-page';
import { Layout } from './common-ui/layout/layout';
import { Sidebar } from './common-ui/sidebar/sidebar';

export const routes: Routes = [
  { path: '', component: Layout, children: [
      { path: 'main', component: MainPage }
    ]},
  { path: 'login', component: LoginPage },
];
