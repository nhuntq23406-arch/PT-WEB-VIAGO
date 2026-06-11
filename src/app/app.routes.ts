import { Routes } from '@angular/router';
import { BoCuc } from './featured/admin/bo-cuc/bo-cuc';
import { TrangChu } from './featured/admin/trang-chu/trang-chu';
import { QuanLyVe } from './featured/admin/quan-ly-ve/quan-ly-ve';
import { QuanLyTinTuc } from './featured/admin/quan-ly-tin-tuc/quan-ly-tin-tuc';
import { QuanLyDieuHanh } from './featured/admin/quan-ly-dieu-hanh/quan-ly-dieu-hanh';
import { QuanLyTaiKhoanKhachHang } from './featured/admin/quan-ly-tai-khoan-khach-hang/quan-ly-tai-khoan-khach-hang';
import { QuanLyTaiKhoanNhanVien } from './featured/admin/quan-ly-tai-khoan-nhan-vien/quan-ly-tai-khoan-nhan-vien';
import { QuanLyChinhSach } from './featured/admin/quan-ly-chinh-sach/quan-ly-chinh-sach';
import { QuanLyTuKhoaCam } from './featured/admin/quan-ly-tu-khoa-cam/quan-ly-tu-khoa-cam';
import { BaoCao } from './featured/admin/bao-cao/bao-cao';
import { Login as AdminLogin } from './featured/admin/auth/login/login';
import { Routes as AdminRoutesComponent } from './featured/admin/routes/routes';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/trang-chu', pathMatch: 'full' },
  {
    path: 'admin',
    component: BoCuc,
    children: [
      { path: 'trang-chu', component: TrangChu },
      { path: 'quan-ly-ve', component: QuanLyVe },
      { path: 'quan-ly-tin-tuc', component: QuanLyTinTuc },
      { path: 'quan-ly-dieu-hanh', component: QuanLyDieuHanh },
      { path: 'quan-ly-tai-khoan-khach-hang', component: QuanLyTaiKhoanKhachHang },
      { path: 'quan-ly-tai-khoan-nhan-vien', component: QuanLyTaiKhoanNhanVien },
      { path: 'quan-ly-chinh-sach', component: QuanLyChinhSach },
      { path: 'quan-ly-tu-khoa-cam', component: QuanLyTuKhoaCam },
      { path: 'bao-cao', component: BaoCao },
      { path: 'auth/login', component: AdminLogin },
      { path: 'routes', component: AdminRoutesComponent },
    ]
  }
];
