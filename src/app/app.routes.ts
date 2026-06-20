import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'trangchu',
        loadComponent: () =>
          import('./featured/admin/trangchu/trangchu').then(
            (m) => m.TrangChuComponent
          ),
      },
      {
        // Redirect /admin → /admin/trangchu
        path: '',
        redirectTo: 'trangchu',
        pathMatch: 'full',
      },
    ],
  },
  {
    // Redirect root → /admin/trangchu
    path: '',
    redirectTo: 'admin/trangchu',
    pathMatch: 'full',
  },
];
