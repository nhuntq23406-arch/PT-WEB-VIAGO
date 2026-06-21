import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './featured/customer/customer-layout/customer-layout.component';
import { HomeComponent } from './featured/customer/home/home.component';
import { NewsComponent } from './featured/customer/news/news.component';
import { ReviewsComponent } from './featured/customer/reviews/reviews.component';
import { ServicesComponent } from './featured/customer/services/services.component';
import { AboutComponent } from './featured/customer/about/about.component';
import { TicketLookupComponent } from './featured/customer/ticket-lookup/ticket-lookup.component';
import { InvoiceComponent } from './featured/customer/invoice/invoice.component';
import { ScheduleComponent } from './featured/customer/schedule/schedule.component';

import { NewsDetailComponent } from './featured/customer/news/news-detail/news-detail.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'tin-tuc', component: NewsComponent },
      { path: 'tin-tuc/chi-tiet/:id', component: NewsDetailComponent },
      { path: 'danh-gia', component: ReviewsComponent },
      { path: 'dich-vu', component: ServicesComponent },
      { path: 'gioi-thieu', component: AboutComponent },
      { path: 'tra-cuu-ve', component: TicketLookupComponent },
      { path: 'hoa-don', component: InvoiceComponent },
      { path: 'lich-trinh', component: ScheduleComponent }
    ]
  },
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
  }
];

