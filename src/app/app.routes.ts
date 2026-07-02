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
import { Profile } from './featured/customer/profile/profile.component';
import { CareersComponent } from './featured/customer/about/careers/careers.component';

// Import phần của Vanh (Admin)
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout';

export const routes: Routes = [
  // --- TUYẾN ĐƯỜNG ADMIN (CỦA VANH & NGHI) ---
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
          import('./featured/admin/dieu-phoi/tuyen-xe/tuyen-xe').then(
            (m) => m.QuanLyTuyenXeComponent
          ),
      },
      {
        path: 'dieuphoi/lich-trinh',
        loadComponent: () =>
          import('./featured/admin/dieu-phoi/lich-trinh/lich-trinh').then(
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
          import('./featured/admin/tai-xe-phu-xe/tai-xe').then((m) => m.TaiXeComponent),
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
          import('./featured/admin/bao-cao-khach-hang/baocao-khachhang').then(
            (m) => m.BaoCaoKhachHangComponent
          ),
      },
      {
        path: 'baocao/doanh-thu',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bao-cao-chi-tiet/bao-cao-chi-tiet').then(
            (m) => m.BaoCaoChiTietComponent
          ),
      },
      {
        path: 'baocao/tuyen',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bao-cao-tuyen-xe/bao-cao-tuyen-xe').then(
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
          import('./featured/admin/noi-dung/khuyen-mai/khuyen-mai').then(
            (m) => m.QuanLyKhuyenMaiComponent
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
        path: 'khachhang/do-that-lac',
        loadComponent: () =>
          import('./featured/admin/khach-hang/do-that-lac/do-that-lac').then(
            (m) => m.DoThatLacComponent
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
          import('./featured/admin/nhat-ky/nhat-ky').then(
            (m) => m.NhatKy
          ),
      },
      {
        path: 'baocao/tai-xe-phu-xe',
        loadComponent: () =>
          import('./featured/admin/bao-cao/bc-tai-xe-phu-xe/bao-cao-tai-xe-phu-xe').then(
            (m) => m.BaoCaoTaiXePhuXeComponent
          ),
      },
      {
        path: 'tin-tuc',
        loadComponent: () =>
          import('./featured/admin/noi-dung/tin-tuc/tin-tuc').then(
            (m) => m.TinTucComponent
          ),
      },
      {
        path: 'chinh-sach',
        loadComponent: () =>
          import('./featured/admin/noi-dung/chinh-sach/chinh-sach').then(
            (m) => m.ChinhSachComponent
          ),
      },
      {
        path: 'khuyen-mai',
        loadComponent: () =>
          import('./featured/admin/khuyen-mai/khuyen-mai').then(
            (m) => m.KhuyenMaiComponent
          ),
      },
      {
        path: 'tu-khoa-cam',
        loadComponent: () =>
          import('./featured/admin/noi-dung/tu-khoa-cam/tu-khoa-cam').then(
            (m) => m.TuKhoaCamComponent
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
      { path: 'profile', component: Profile },
      { path: 'tuyen-dung', component: CareersComponent }
    ]
  }
];
