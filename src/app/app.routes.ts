import { Routes } from '@angular/router';
// Import phần của Nghi (Customer)
import { CustomerLayoutComponent } from './featured/customer/customer-layout/customer-layout.component';
import { HomeComponent } from './featured/customer/home/home.component';
import { NewsComponent } from './featured/customer/news/news.component';
import { NewsDetailComponent } from './featured/customer/news/news-detail/news-detail.component';
import { ReviewsComponent } from './featured/customer/reviews/reviews.component';
import { ServicesComponent } from './featured/customer/services/services.component';
import { AboutComponent } from './featured/customer/about/about.component';
import { AboutUsComponent } from './featured/customer/about/about-us/about-us.component';
import { PoliciesComponent } from './featured/customer/about/policies/policies.component';
import { TermsComponent } from './featured/customer/about/terms/terms.component';
import { FaqComponent } from './featured/customer/about/faq/faq.component';
import { ContactComponent } from './featured/customer/about/contact/contact.component';
import { TicketLookupComponent } from './featured/customer/ticket-lookup/ticket-lookup.component';
import { InvoiceComponent } from './featured/customer/invoice/invoice.component';
import { ScheduleComponent } from './featured/customer/schedule/schedule.component';
import { CareersComponent } from './featured/customer/about/careers/careers.component';

// Import phần của Vanh (Admin)
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  // --- TUYẾN ĐƯỜNG ADMIN (CỦA VANH) ---
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'admin/login'
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./featured/admin/auth/login/login').then(
        (m) => m.Login
      ),
  },
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
        path: 'dieuphoi/tuyen',
        loadComponent: () =>
          import('./featured/admin/quan-ly-tuyen-xe/quan-ly-tuyen-xe').then(
            (m) => m.QuanLyTuyenXeComponent
          ),
      },
      {
        path: 'dieuphoi/lich-trinh',
        loadComponent: () =>
          import('./featured/admin/quan-ly-lich-trinh/quan-ly-lich-trinh').then(
            (m) => m.QuanLyLichTrinhComponent
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
        path: 'datve/moi',
        loadComponent: () =>
          import('./featured/admin/dat-ve/dat-ve-moi/dat-ve-moi').then(
            (m) => m.DatVeMoiComponent
          ),
      },
      {
        path: 'datve/danhsach',
        loadComponent: () =>
          import('./featured/admin/dat-ve/quan-ly-da-dat/danh-sach-ve').then(
            (m) => m.DanhSachVeComponent
          ),
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
        path: 'baocao/chi-tiet',
        loadComponent: () =>
          import('./featured/admin/bao-cao-chi-tiet/bao-cao-chi-tiet').then(
            (m) => m.BaoCaoChiTietComponent
          ),
      },
      {
        path: 'baocao/tuyen',
        loadComponent: () =>
          import('./featured/admin/bao-cao-tuyen-xe/bao-cao-tuyen-xe').then(
            (m) => m.BaoCaoTuyenXeComponent
          ),
      },
      {
        path: 'baocao/hoan-huy',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bao-cao-hoan-huy/hoan-huy').then(
            (m) => m.HoanHuyComponent
          ),
      },
      {
        path: 'khuyenmai',
        loadComponent: () =>
          import('./featured/admin/quan-ly-khuyen-mai/quan-ly-khuyen-mai').then(
            (m) => m.QuanLyKhuyenMaiComponent
          ),
      },
      {
        path: 'noidung/tin-tuc',
        loadComponent: () =>
          import('./featured/admin/quan-ly-tin-tuc/quan-ly-tin-tuc').then(
            (m) => m.QuanLyTinTuc
          ),
      },
      {
        path: 'khachhang/tai-khoan',
        loadComponent: () =>
          import('./featured/admin/khach-hang/quan-ly-tai-khoan-khach-hang/quan-ly-tai-khoan-khach-hang').then(
            (m) => m.QuanLyTaiKhoanKhachHang
          ),
      },
      {
        path: 'khachhang/danh-gia',
        loadComponent: () =>
          import('./featured/admin/khach-hang/danh-gia-phan-hoi/danh-gia-phan-hoi').then(
            (m) => m.DanhGiaPhanHoi
          ),
      },
      {
        path: 'khachhang/danh-gia-phan-hoi',
        loadComponent: () =>
          import('./featured/admin/khach-hang/danh-gia-phan-hoi/danh-gia-phan-hoi').then(
            (m) => m.DanhGiaPhanHoi
          ),
      },
      {
        path: 'nhanvien/tai-khoan',
        loadComponent: () =>
          import('./featured/admin/nhan-vien/quan-ly-tai-khoan-nhan-vien/quan-ly-tai-khoan-nhan-vien').then(
            (m) => m.QuanLyTaiKhoanNhanVien
          ),
      },
      {
        path: 'nhatky',
        loadComponent: () =>
          import('./featured/admin/quan-ly-nhat-ky/quan-ly-nhat-ky').then(
            (m) => m.QuanLyNhatKy
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
      { path: 'tin-tuc/chi-tiet/:id', component: NewsDetailComponent },
      { path: 'danh-gia', component: ReviewsComponent },
      { path: 'dich-vu', component: ServicesComponent },
      { path: 've-chung-toi', component: AboutUsComponent },
      { path: 'chinh-sach', component: PoliciesComponent },
      { path: 'dieu-khoan', component: TermsComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'lien-he', component: ContactComponent },
      { path: 'tra-cuu-ve', component: TicketLookupComponent },
      { path: 'hoa-don', component: InvoiceComponent },
      { path: 'lich-trinh', component: ScheduleComponent },
      { path: 'tuyen-dung', component: CareersComponent }
    ]
  }
];
