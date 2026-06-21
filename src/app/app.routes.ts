import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      // ─── Tổng quan ────────────────────────────────────────────────
      {
        path: 'trangchu',
        loadComponent: () =>
          import('./featured/admin/trangchu/trangchu').then(
            (m) => m.TrangChuComponent
          ),
      },

      // ─── Quản lý đặt vé ───────────────────────────────────────────
      {
        path: 'dat-ve/moi',
        loadComponent: () =>
          import('./featured/admin/dat-ve/dat-ve-moi/dat-ve-moi').then(
            (m) => m.DatVeMoiComponent
          ),
      },
      {
        path: 'dat-ve/quan-ly',
        loadComponent: () =>
          import('./featured/admin/dat-ve/quan-ly-da-dat/quan-ly-da-dat').then(
            (m) => m.QuanLyDaDatComponent
          ),
      },

      // ─── Quản lý điều hành ────────────────────────────────────────
      {
        path: 'dieu-hanh/tuyen-xe',
        loadComponent: () =>
          import('./featured/admin/dieu-hanh/tuyen-xe/tuyen-xe').then(
            (m) => m.TuyenXeComponent
          ),
      },
      {
        path: 'dieu-hanh/lich-trinh',
        loadComponent: () =>
          import('./featured/admin/dieu-hanh/lich-trinh/lich-trinh').then(
            (m) => m.LichTrinhComponent
          ),
      },
      {
        path: 'dieu-hanh/phuong-tien',
        loadComponent: () =>
          import('./featured/admin/dieu-hanh/phuong-tien/phuong-tien').then(
            (m) => m.PhuongTienComponent
          ),
      },
      {
        path: 'dieu-hanh/tai-xe-phu-xe',
        loadComponent: () =>
          import('./featured/admin/dieu-hanh/tai-xe-phu-xe/tai-xe-phu-xe').then(
            (m) => m.TaiXePhuXeComponent
          ),
      },
      {
        path: 'dieu-hanh/diem-don-tra',
        loadComponent: () =>
          import('./featured/admin/dieu-hanh/diem-don-tra/diem-don-tra').then(
            (m) => m.DiemDonTraComponent
          ),
      },
      {
        path: 'khuyen-mai',
        loadComponent: () =>
          import('./featured/admin/khuyen-mai/khuyen-mai').then(
            (m) => m.KhuyenMaiComponent
          ),
      },

      // ─── Báo cáo ──────────────────────────────────────────────────
      {
        path: 'baocao/chi-tiet',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-chi-tiet/chi-tiet').then(
            (m) => m.BaoCaoChiTietComponent
          ),
      },
      {
        path: 'baocao/tuyen-xe',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-tuyen-xe/bao-cao-tuyen-xe').then(
            (m) => m.BaoCaoTuyenXeComponent
          ),
      },
      {
        path: 'baocao/khach-hang',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-khach-hang/bao-cao-khach-hang').then(
            (m) => m.BaoCaoKhachHangComponent
          ),
      },
      {
        path: 'baocao/hoan-huy',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-hoan-huy/bao-cao-hoan-huy').then(
            (m) => m.BaoCaoHoanHuyComponent
          ),
      },
      {
        path: 'baocao/tai-xe-phu-xe',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-tai-xe-phu-xe/bao-cao-tai-xe').then(
            (m) => m.BaoCaoTaiXeComponent
          ),
      },

      // ─── Default redirect ─────────────────────────────────────────
      {
        path: '',
        redirectTo: 'trangchu',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'admin/trangchu',
    pathMatch: 'full',
  },
];
