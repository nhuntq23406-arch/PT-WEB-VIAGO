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
        path: 'dieuphoi/don-tra',
        loadComponent: () =>
          import('./featured/admin/don-tra/don-tra').then(
            (m) => m.DonTraComponent
          ),
      },
      {
        path: 'dieuphoi/phuong-tien',
        loadComponent: () =>
          import('./featured/admin/phuong-tien/phuong-tien').then(
            (m) => m.PhuongTienComponent
          ),
      },
      {
        path: 'dieuphoi/tai-xe',
        loadComponent: () =>
          import('./featured/admin/tai-xe/tai-xe').then((m) => m.TaiXeComponent),
      },
      {
        path: 'thuexe',
        loadComponent: () =>
          import('./featured/admin/thue-xe-hop-dong/thue-xe-hop-dong').then(
            (m) => m.ThueXeHopDongComponent
          ),
      },
      {
        path: 'baocao/khach-hang',
        loadComponent: () =>
          import('./featured/admin/baocao-khachhang/baocao-khachhang').then(
            (m) => m.BaoCaoKhachHangComponent
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
