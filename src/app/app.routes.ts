import { Routes } from '@angular/router';
// Import phần của Nghi (Customer)
import { CustomerLayoutComponent } from './featured/customer/customer-layout/customer-layout.component';
import { HomeComponent } from './featured/customer/home/home.component';
import { NewsComponent } from './featured/customer/news/news.component';
import { ReviewsComponent } from './featured/customer/reviews/reviews.component';
import { ServicesComponent } from './featured/customer/services/services.component';
import { AboutComponent } from './featured/customer/about/about.component';
import { TicketLookupComponent } from './featured/customer/ticket-lookup/ticket-lookup.component';
import { InvoiceComponent } from './featured/customer/invoice/invoice.component';
import { ScheduleComponent } from './featured/customer/schedule/schedule.component';

// Import phần của Vanh (Admin)
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  // --- TUYẾN ĐƯỜNG ADMIN (CỦA VANH) ---
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

  // --- TUYẾN ĐƯỜNG CUSTOMER (CỦA NGHI) ---
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'tin-tuc', component: NewsComponent },
      { path: 'danh-gia', component: ReviewsComponent },
      { path: 'dich-vu', component: ServicesComponent },
      { path: 'gioi-thieu', component: AboutComponent },
      { path: 'tra-cuu-ve', component: TicketLookupComponent },
      { path: 'hoa-don', component: InvoiceComponent },
      { path: 'lich-trinh', component: ScheduleComponent }
    ]
  }
];