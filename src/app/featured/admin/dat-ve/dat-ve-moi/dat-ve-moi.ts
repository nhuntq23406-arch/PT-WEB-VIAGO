import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type PhuongThucThanhToan = 'tien-mat' | 'chuyen-khoan' | 'the';
type TrangThaiDonHang = 'cho-thanh-toan' | 'da-thanh-toan';
type TrangThaiVe = 'cho-khoi-hanh' | 'da-hoan-thanh' | 'da-huy';
type TrangThaiGhe = 'trong' | 'dang-chon' | 'giu-cho' | 'da-thanh-toan';
type NguonDat = 'tai-quay' | 'hotline' | 'online';
type BoLocGio = 'tat-ca' | 'sang' | 'chieu' | 'toi' | 'dem';
type LoaiXeId = 'limousine' | 'giuong-nam' | 'cabin';
type LoaiGheId = 'giuong-nam' | 'limousine' | 'cabin-don' | 'cabin-doi';

interface LoaiXeOption {
  id: LoaiXeId;
  ten: string;
  soCho: number;
  moTa: string;
  loaiGhe: string;
  icon: string;
}

interface XeKhach {
  maXe: string;
  tenXe: string;
  bienSo: string;
  loaiXe: LoaiXeId;
  soCho: number;
  hanDangKiem: string;
  tienIch: string[];
}

interface SoDoGhe {
  title: string;
  subtitle: string;
  rows: string[][];
}

interface VeXe {
  MaVe: string;
  MaDonHang: string;
  MaKhachHang?: string;
  MaNVBanVe?: string;
  HoTenNguoiDi: string;
  SdtNguoiDi: string;
  EmailNguoiDi?: string;
  ThoiGianDat: string;
  SoLuongVeDaDat?: number;
  TienBaoHiem?: number;
  TongGiaVe?: number;
  ThoiGianXuatVe?: string;
  MaQRVe?: string;
  MaLichTrinh: string;
  MaXe?: string;
  MaGheChuyen?: string;
  LoaiXe?: string;
  LoaiGhe?: string;
  TenXe?: string;
  BienSoXe?: string;
  TenTuyenXe: string;
  NgayKhoiHanh: string;
  GioKhoiHanh: string;
  SoGhe: string;
  GiaVe: number;
  MaGiamGia?: string;
  GiamGia?: number;
  MaDiemDon: string;
  MaDiemTra: string;
  PhuongThucThanhToan: PhuongThucThanhToan;
  TrangThaiDonHang: TrangThaiDonHang;
  TrangThaiVe: TrangThaiVe;
  GhiChu?: string;
  NguonDat?: NguonDat;
  SoLanDaSua?: number;
  NguoiHuy?: string;
  ThoiGianHuy?: string;
  TrangThaiGiaoDich?: 'da-hoan' | 'chua-hoan';
}

interface GheXe {
  SoGhe: string;
  Tang: 'A' | 'B';
  LoaiGhe: LoaiGheId;
  GiaVe: number;
  TrangThai: TrangThaiGhe;
  Ve?: VeXe;
}

interface TenTuyenXe {
  id: string;
  name: string;
  loaiXe: string;
  khoangCach: string;
  thoiGian: string;
  soChuyenNgay: string;
  bienSo: string;
  maXe: string;
  taiXe: string;
  phuXe: string;
  giaGoc: number;
  ghiChu: string;
  MaDiemDon: string[];
  MaDiemTra: string[];
  diemDung: string[];
  diemTrungChuyen: string[];
  gioCoMatTruocPhut: number;
}

@Component({
  selector: 'app-dat-ve-moi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dat-ve-moi.html',
  styleUrl: './dat-ve-moi.css'
})
export class DatVeMoiComponent implements OnInit {
  readonly storageKey = 'viago_ticket_bookings_v3';
  readonly loaiXeList: LoaiXeOption[] = [
    {
      id: 'limousine',
      ten: 'Limousine',
      soCho: 9,
      moTa: '9 chỗ',
      loaiGhe: 'Ghế VIP',
      icon: 'airline_seat_recline_extra'
    },
    {
      id: 'giuong-nam',
      ten: 'Giường nằm',
      soCho: 34,
      moTa: '34 chỗ',
      loaiGhe: 'Giường đơn',
      icon: 'airline_seat_individual_suite'
    },
    {
      id: 'cabin',
      ten: 'Cabin',
      soCho: 22,
      moTa: '22 phòng',
      loaiGhe: 'Cabin đơn, Cabin đôi',
      icon: 'bed'
    }
  ];

  readonly danhSachXe: XeKhach[] = [
    {
      maXe: 'LIMO01',
      tenXe: 'VIAGO Limousine 01',
      bienSo: '51B-123.45',
      loaiXe: 'limousine',
      soCho: 9,
      hanDangKiem: '15/12/2026',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'LIMO02',
      tenXe: 'VIAGO Limousine 02',
      bienSo: '51B-234.56',
      loaiXe: 'limousine',
      soCho: 9,
      hanDangKiem: '28/09/2026',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'LIMO03',
      tenXe: 'VIAGO Limousine 03',
      bienSo: '51B-345.67',
      loaiXe: 'limousine',
      soCho: 9,
      hanDangKiem: '10/03/2027',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'GN01',
      tenXe: 'VIAGO Giường Nằm 01',
      bienSo: '51F-456.78',
      loaiXe: 'giuong-nam',
      soCho: 34,
      hanDangKiem: '22/11/2026',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'GN02',
      tenXe: 'VIAGO Giường Nằm 02',
      bienSo: '51F-567.89',
      loaiXe: 'giuong-nam',
      soCho: 34,
      hanDangKiem: '05/01/2027',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'GN03',
      tenXe: 'VIAGO Giường Nằm 03',
      bienSo: '51F-678.90',
      loaiXe: 'giuong-nam',
      soCho: 34,
      hanDangKiem: '18/08/2026',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'CAB01',
      tenXe: 'VIAGO Cabin 01',
      bienSo: '51F-789.12',
      loaiXe: 'cabin',
      soCho: 22,
      hanDangKiem: '30/04/2027',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'CAB02',
      tenXe: 'VIAGO Cabin 02',
      bienSo: '51F-890.23',
      loaiXe: 'cabin',
      soCho: 22,
      hanDangKiem: '12/06/2027',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'CAB03',
      tenXe: 'VIAGO Cabin 03',
      bienSo: '51F-901.34',
      loaiXe: 'cabin',
      soCho: 22,
      hanDangKiem: '25/10/2026',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    },
    {
      maXe: 'GN04',
      tenXe: 'VIAGO Giường Nằm 04',
      bienSo: '51F-112.45',
      loaiXe: 'giuong-nam',
      soCho: 34,
      hanDangKiem: '14/02/2027',
      tienIch: ['Wifi', 'Tivi', 'Ổ sạc USB', 'Nước uống & khăn ướt', 'GPS', 'Điều hòa']
    }
  ];

  readonly seatLayouts: Record<LoaiXeId, SoDoGhe[]> = {
    limousine: [
      {
        title: 'Sơ đồ ghế (9 chỗ)',
        subtitle: 'Ghế VIP',
        rows: [
          ['1A', '', '2A'],
          ['3A', '', '4A'],
          ['5A', '', '6A'],
          ['7A', '8A', '9A']
        ]
      }
    ],
    'giuong-nam': [
      {
        title: 'Tầng dưới',
        subtitle: 'Giường đơn',
        rows: [
          ['1A', '', '2A'],
          ['3A', '4A', '5A'],
          ['6A', '7A', '8A'],
          ['9A', '10A', '11A'],
          ['12A', '13A', '14A'],
          ['15A', '16A', '17A']
        ]
      },
      {
        title: 'Tầng trên',
        subtitle: 'Giường đơn',
        rows: [
          ['1B', '', '2B'],
          ['3B', '4B', '5B'],
          ['6B', '7B', '8B'],
          ['9B', '10B', '11B'],
          ['12B', '13B', '14B'],
          ['15B', '16B', '17B']
        ]
      }
    ],
    cabin: [
      {
        title: 'Tầng dưới',
        subtitle: 'Cabin đơn hoặc Cabin đôi',
        rows: [
          ['1A', '2A'],
          ['3A', '4A'],
          ['5A', '6A'],
          ['7A', '8A'],
          ['9A', '10A'],
          ['11A', '12A']
        ]
      },
      {
        title: 'Tầng trên',
        subtitle: 'Cabin đơn hoặc Cabin đôi',
        rows: [
          ['1B', '2B'],
          ['3B', '4B'],
          ['5B', '6B'],
          ['7B', '8B'],
          ['9B', '10B']
        ]
      }
    ]
  };

  readonly maGiamGiaList = [
    { code: '', label: 'Không dùng mã giảm giá', amount: 0 },
    { code: 'VIP10', label: 'VIP10 - giảm 10%', amount: 0, percent: 10 },
    { code: 'VIAGO50', label: 'VIAGO50 - giảm 50.000đ', amount: 50000 }
  ];

  tuyenList: TenTuyenXe[] = [
    {
      id: 'HCM-CT',
      name: 'TP.HCM ↔ Cần Thơ',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '170 km',
      thoiGian: '3.5 tiếng',
      soChuyenNgay: '12 chuyến/ngày',
      bienSo: '51B-123.45',
      maXe: 'XE001',
      taiXe: 'Nguyễn Ngọc Duy Anh',
      phuXe: 'Trần Minh Hải',
      giaGoc: 180000,
      ghiChu: 'Qua Trung Lương, Cai Lậy, Vĩnh Long. Có trung chuyển nội thành TP.HCM và Cần Thơ.',
      MaDiemDon: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
      MaDiemTra: ['Bến xe Trung tâm Cần Thơ', 'Văn phòng Ninh Kiều', 'Bến Ninh Kiều', 'Đại học Cần Thơ'],
      diemDung: ['Trung Lương', 'Cai Lậy', 'Cái Bè', 'Vĩnh Long'],
      diemTrungChuyen: ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức', 'Vincom Xuân Khánh', 'LOTTE Mart Cần Thơ'],
      gioCoMatTruocPhut: 15
    },
    {
      id: 'HCM-VT',
      name: 'TP.HCM ↔ Vũng Tàu',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '100 km',
      thoiGian: '2 tiếng',
      soChuyenNgay: '20 chuyến/ngày',
      bienSo: '51B-888.99',
      maXe: 'XE002',
      taiXe: 'Lê Văn Tám',
      phuXe: 'Phạm Đăng Khoa',
      giaGoc: 180000,
      ghiChu: 'Tuyến ngắn qua Long Thành, Bà Rịa; phù hợp khách đi trong ngày.',
      MaDiemDon: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
      MaDiemTra: ['Bến xe Vũng Tàu', 'Văn phòng Vũng Tàu', 'Bãi Sau', 'Bãi Trước'],
      diemDung: ['Long Thành', 'Bà Rịa'],
      diemTrungChuyen: ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức', 'LOTTE Mart Vũng Tàu', 'Bãi Sau'],
      gioCoMatTruocPhut: 20
    },
    {
      id: 'DL-BMT',
      name: 'Đà Lạt ↔ Buôn Ma Thuột',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '210 km',
      thoiGian: '5 tiếng',
      soChuyenNgay: '8 chuyến/ngày',
      bienSo: '49B-456.78',
      maXe: 'XE003',
      taiXe: 'Võ Minh Quân',
      phuXe: 'Nguyễn Quốc Bảo',
      giaGoc: 220000,
      ghiChu: 'Tuyến Tây Nguyên qua Liên Khương và Krông Pắc.',
      MaDiemDon: ['Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt', 'Hồ Xuân Hương', 'Quảng trường Lâm Viên'],
      MaDiemTra: ['Bến xe Phía Nam Buôn Ma Thuột', 'Ngã Sáu Buôn Ma Thuột', 'Coopmart Buôn Ma Thuột'],
      diemDung: ['Liên Khương', 'Krông Pắc'],
      diemTrungChuyen: ['Quảng trường Lâm Viên', 'Big C Đà Lạt', 'Coopmart Buôn Ma Thuột', 'Ngã Sáu Buôn Ma Thuột'],
      gioCoMatTruocPhut: 30
    },
    {
      id: 'DL-NT',
      name: 'Đà Lạt ↔ Nha Trang',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '140 km',
      thoiGian: '3 tiếng',
      soChuyenNgay: '15 chuyến/ngày',
      bienSo: '49B-234.56',
      maXe: 'XE004',
      taiXe: 'Hoàng Đức Bình',
      phuXe: 'Lâm Tuấn Kiệt',
      giaGoc: 220000,
      ghiChu: 'Di chuyển theo cung đường Khánh Vĩnh, cảnh đẹp đèo núi.',
      MaDiemDon: ['Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt', 'Hồ Xuân Hương', 'Quảng trường Lâm Viên'],
      MaDiemTra: ['Bến xe phía Nam Nha Trang', 'Ga Nha Trang', 'Quảng trường 2/4', 'Vinpearl Harbour'],
      diemDung: ['Khánh Vĩnh'],
      diemTrungChuyen: ['Quảng trường Lâm Viên', 'Big C Đà Lạt', 'Vincom Plaza Nha Trang', 'Tháp Trầm Hương'],
      gioCoMatTruocPhut: 15
    },
    {
      id: 'CT-RG',
      name: 'Cần Thơ ↔ Rạch Giá',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '115 km',
      thoiGian: '2.5 tiếng',
      soChuyenNgay: '10 chuyến/ngày',
      bienSo: '65B-222.33',
      maXe: 'XE005',
      taiXe: 'Trần Quốc Huy',
      phuXe: 'Nguyễn Minh Phúc',
      giaGoc: 180000,
      ghiChu: 'Kết nối miền Tây qua Thốt Nốt và Long Xuyên.',
      MaDiemDon: ['Bến xe Trung tâm Cần Thơ', 'Văn phòng Ninh Kiều', 'Bến Ninh Kiều', 'Đại học Cần Thơ'],
      MaDiemTra: ['Bến xe Rạch Giá', 'Bến tàu Rạch Giá', 'Văn phòng Rạch Giá'],
      diemDung: ['Thốt Nốt', 'Long Xuyên'],
      diemTrungChuyen: ['Vincom Xuân Khánh', 'LOTTE Mart Cần Thơ', 'Coopmart Rạch Giá', 'Bến tàu Rạch Giá'],
      gioCoMatTruocPhut: 15
    },
    {
      id: 'HCM-PT',
      name: 'TP.HCM ↔ Phan Thiết',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '200 km',
      thoiGian: '4 tiếng',
      soChuyenNgay: '18 chuyến/ngày',
      bienSo: '86B-678.90',
      maXe: 'XE006',
      taiXe: 'Phan Thanh Sang',
      phuXe: 'Đỗ Hoàng Nam',
      giaGoc: 220000,
      ghiChu: 'Tuyến biển qua Long Thành, Dầu Giây, Hàm Thuận Nam.',
      MaDiemDon: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
      MaDiemTra: ['Bến xe Phan Thiết', 'Chợ Phan Thiết', 'Mũi Né', 'NovaWorld Phan Thiết'],
      diemDung: ['Long Thành', 'Dầu Giây', 'Hàm Thuận Nam'],
      diemTrungChuyen: ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức', 'NovaWorld Phan Thiết', 'Mũi Né'],
      gioCoMatTruocPhut: 20
    },
    {
      id: 'HCM-DL',
      name: 'TP.HCM ↔ Đà Lạt',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '310 km',
      thoiGian: '7 tiếng',
      soChuyenNgay: '25 chuyến/ngày',
      bienSo: '51B-777.88',
      maXe: 'XE007',
      taiXe: 'Bùi Anh Khoa',
      phuXe: 'Võ Gia Huy',
      giaGoc: 320000,
      ghiChu: 'Tuyến cao điểm, nhiều khung giờ trong ngày qua Bảo Lộc và Di Linh.',
      MaDiemDon: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
      MaDiemTra: ['Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt', 'Hồ Xuân Hương', 'Quảng trường Lâm Viên'],
      diemDung: ['Dầu Giây', 'Bảo Lộc', 'Di Linh'],
      diemTrungChuyen: ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức', 'Quảng trường Lâm Viên', 'Big C Đà Lạt'],
      gioCoMatTruocPhut: 30
    },
    {
      id: 'HCM-NT',
      name: 'TP.HCM ↔ Nha Trang',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '435 km',
      thoiGian: '8.5 tiếng',
      soChuyenNgay: '22 chuyến/ngày',
      bienSo: '51B-909.19',
      maXe: 'XE008',
      taiXe: 'Đặng Hoài Nam',
      phuXe: 'Lê Quốc Việt',
      giaGoc: 420000,
      ghiChu: 'Tuyến dài qua Dầu Giây, Phan Thiết, Phan Rang, Cam Ranh.',
      MaDiemDon: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
      MaDiemTra: ['Bến xe phía Nam Nha Trang', 'Ga Nha Trang', 'Quảng trường 2/4', 'Vinpearl Harbour'],
      diemDung: ['Dầu Giây', 'Phan Thiết', 'Phan Rang', 'Cam Ranh'],
      diemTrungChuyen: ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức', 'Vincom Plaza Nha Trang', 'Tháp Trầm Hương'],
      gioCoMatTruocPhut: 30
    },
    {
      id: 'NT-DN',
      name: 'Nha Trang ↔ Đà Nẵng',
      loaiXe: 'Limousine, Giường nằm, Cabin',
      khoangCach: '530 km',
      thoiGian: '11 tiếng',
      soChuyenNgay: '14 chuyến/ngày',
      bienSo: '79B-345.67',
      maXe: 'XE009',
      taiXe: 'Ngô Minh Trí',
      phuXe: 'Phạm Thành Long',
      giaGoc: 380000,
      ghiChu: 'Tuyến ven biển miền Trung qua Quy Nhơn, Quảng Ngãi, Tam Kỳ.',
      MaDiemDon: ['Bến xe phía Nam Nha Trang', 'Ga Nha Trang', 'Quảng trường 2/4', 'Vinpearl Harbour'],
      MaDiemTra: ['Bến xe Trung tâm Đà Nẵng', 'Sân bay Đà Nẵng', 'Công viên Biển Đông', 'Cầu Rồng'],
      diemDung: ['Cam Ranh', 'Phan Rang', 'Quy Nhơn', 'Quảng Ngãi', 'Tam Kỳ'],
      diemTrungChuyen: ['Vincom Plaza Nha Trang', 'Tháp Trầm Hương', 'Vincom Đà Nẵng', 'Cầu Rồng'],
      gioCoMatTruocPhut: 30
    }
  ];

  gioList = [
    '05:30', '05:45', '06:00', '06:15', '06:30', '07:00', '07:30', '08:00',
    '08:30', '09:00', '09:30', '10:00', '10:45', '11:30', '12:00', '13:00',
    '14:00', '15:00', '16:00', '18:00', '19:30', '21:00', '22:15', '23:00'
  ];

  tuyenDuocChon = signal('HCM-CT');
  loaiXeDuocChon = signal<LoaiXeId>('limousine');
  maXeDuocChon = signal('LIMO01');
  tuyenTimKiem = signal('');
  showTuyenSuggestions = signal(false);
  NgayKhoiHanh = signal(this.todayString());
  gioChayDuocChon = signal('10:45');
  boLocGio = signal<BoLocGio>('tat-ca');
  tuKhoaNhanh = signal('');

  danhSachVe = signal<VeXe[]>([]);
  gheDangChon = signal<string[]>([]);
  veDangSua = signal<VeXe | null>(null);
  veDangIn = signal<VeXe[]>([]);
  showBookingModal = signal(false);
  showCancelSeatConfirm = signal(false);
  showPrintModal = signal(false);

  seatToTransfer = signal<VeXe | null>(null);
  showTransferModal = signal(false);
  selectedNewSeat = signal('');
  selectedCancelReason = signal('Tôi đổi kế hoạch');
  applyCancelToGroup = signal(true);
  showConfirmChangesModal = signal(false);
  danhSachThayDoi = signal<{ truong: string; nhan: string; cu: string; moi: string }[]>([]);
  applyUpdateToGroup = signal(false);

  readonly cancelReasons = [
    'Tôi đổi kế hoạch',
    'Đặt nhầm ngày/giờ',
    'Muốn đổi sang chuyến khác',
    'Trễ xe / Không kịp giờ',
    'Lý do cá nhân'
  ];

  readonly cancelPolicies = [
    { title: 'Hoàn 100%', description: 'Hủy trước 24 giờ khởi hành: hoàn 100% giá trị vé.' },
    { title: 'Hoàn 50%', description: 'Hủy từ 12 đến 24 giờ trước khởi hành: hoàn 50% giá trị vé.' },
    { title: 'Không hoàn', description: 'Hủy dưới 12 giờ trước khởi hành: không hoàn tiền.' }
  ];

  formSdt = signal('');
  formTen = signal('');
  formEmail = signal('');
  formDiemDon = signal('');
  formDiemTra = signal('');
  formHinhThuc = signal<PhuongThucThanhToan>('tien-mat');
  formTrangThaiThanhToan = signal<TrangThaiDonHang>('da-thanh-toan');
  formNguonDat = signal<NguonDat>('tai-quay');
  formMaGiamGia = signal('');
  formGhiChu = signal('');
  showPromoSuggestions = signal(false);

  showPaymentConfirmModal = signal(false);

  toast = signal<{ msg: string; type: 'success' | 'danger' } | null>(null);


  LayNguonVe(ve: VeXe) {
    if (ve.NguonDat === 'hotline') return 'HL';
    if (ve.NguonDat === 'online') return 'OL';
    if (ve.TenTuyenXe.includes('TP.HCM')) return 'VPHCM';
    if (ve.TenTuyenXe.includes('Đà Lạt')) return 'VPDL';
    if (ve.TenTuyenXe.includes('Nha Trang')) return 'VPNT';
    if (ve.TenTuyenXe.includes('Cần Thơ')) return 'VPCT';
    return 'VP';
  }

  LayGhiChuSach(ghiChu?: string): string {
    if (!ghiChu) return '';
    return ghiChu.split(' | ')
      .filter(part =>
        !part.includes('Đã hủy lúc') &&
        !part.includes('Đổi ghế từ') &&
        !part.includes('Xác nhận thanh toán')
      )
      .join(' | ');
  }

  MoXacNhanThanhToan() {
    this.showPaymentConfirmModal.set(true);
  }

  onPromoBlur() {
    setTimeout(() => this.showPromoSuggestions.set(false), 200);
  }

  SelectPromoCode(code: string) {
    this.formMaGiamGia.set(code);
    this.showPromoSuggestions.set(false);
  }

  gheConfig = signal<Record<string, 'don' | 'doi'>>({});

  CapNhatGheConfig(ghe: string, type: string) {
    const loaiCabin = type === 'doi' ? 'doi' : 'don';
    this.gheConfig.set({ ...this.gheConfig(), [ghe]: loaiCabin });
  }

  LaySoLuongGheLienQuan(ve: VeXe): number {
    return this.NhomVeCungDon(ve).length;
  }

  thongTinChuyen = computed(() => {
    return this.tuyenList.find(t => t.id === this.tuyenDuocChon()) ?? this.tuyenList[0];
  });

  loaiXeDangChon = computed(() => {
    return this.loaiXeList.find(item => item.id === this.loaiXeDuocChon()) ?? this.loaiXeList[0];
  });

  xeTheoLoaiDangChon = computed(() => {
    return this.danhSachXe.filter(xe => xe.loaiXe === this.loaiXeDuocChon());
  });

  xeDangChon = computed(() => {
    return this.danhSachXe.find(xe => xe.maXe === this.maXeDuocChon())
      ?? this.xeTheoLoaiDangChon()[0]
      ?? this.danhSachXe[0];
  });

  tienIchXeDangChon = computed(() => this.xeDangChon().tienIch.join(', '));

  soDoGheDangChon = computed(() => this.seatLayouts[this.loaiXeDuocChon()]);

  totalSeats = computed(() => {
    return this.soDoGheDangChon().reduce((sum, deck) => {
      return sum + deck.rows.reduce((deckSum, row) => deckSum + row.filter(Boolean).length, 0);
    }, 0);
  });

  goiYTuyenLoc = computed(() => {
    const query = this.tuyenTimKiem();
    if (!query) return this.tuyenList;
    return this.tuyenList.filter(tuyen => this.KhopLocTuyenMotChieu(tuyen.name, query));
  });

  seatCodes = computed(() => this.soDoGheDangChon().flatMap(deck => deck.rows.flat()).filter(Boolean));

  veTheoChuyen = computed(() => {
    const chuyen = this.thongTinChuyen();
    return this.danhSachVe().filter(v =>
      v.TenTuyenXe === chuyen.name &&
      this.VeThuocLoaiXeDangChon(v) &&
      v.NgayKhoiHanh === this.NgayKhoiHanh() &&
      v.GioKhoiHanh === this.gioChayDuocChon() &&
      v.TrangThaiVe !== 'da-huy'
    );
  });

  gheList = computed<GheXe[]>(() => {
    const selected = this.gheDangChon();
    const activeTickets = this.veTheoChuyen();

    return this.seatCodes().map(soGhe => {
      const ticket = activeTickets.find(v => v.SoGhe === soGhe);
      const loaiGhe = this.LoaiGheTheoSoGhe(soGhe);
      let trangThai: TrangThaiGhe = 'trong';

      if (ticket) {
        trangThai = ticket.TrangThaiDonHang === 'da-thanh-toan' ? 'da-thanh-toan' : 'giu-cho';
      } else if (selected.includes(soGhe)) {
        trangThai = 'dang-chon';
      }

      return {
        SoGhe: soGhe,
        Tang: soGhe.endsWith('B') ? 'B' : 'A',
        LoaiGhe: loaiGhe,
        GiaVe: this.GiaVeTheoLoaiGhe(loaiGhe),
        TrangThai: trangThai,
        Ve: ticket
      };
    });
  });

  thongKeChuyen = computed(() => this.ThongKeTheoGio(this.gioChayDuocChon()));

  tamTinh = computed(() => {
    const selected = this.veDangSua();
    if (selected) return selected.GiaVe;
    return this.gheDangChon().reduce((sum, soGhe) => sum + this.GiaVeTheoSoGhe(soGhe), 0);
  });

  soTienGiam = computed(() => this.TinhGiamGia(this.tamTinh()));

  tongTien = computed(() => Math.max(0, this.tamTinh() - this.soTienGiam()));

  tongTienIn = computed(() => this.veDangIn().reduce((sum, ve) => sum + ve.GiaVe, 0));

  gheDangIn = computed(() => this.veDangIn().map(ve => ve.SoGhe).join(', '));

  emptySeatsList = computed(() => {
    return this.gheList().filter(g => g.TrangThai === 'trong').map(g => g.SoGhe);
  });

  lichSuGiaoDich = computed(() => {
    const sdt = this.formSdt().trim();
    if (sdt.length < 9) return [];
    const cleanInput = sdt.replace(/\D/g, '');
    return this.danhSachVe()
      .filter(v => v.SdtNguoiDi.replace(/\D/g, '') === cleanInput)
      .sort((a, b) => b.ThoiGianDat.localeCompare(a.ThoiGianDat));
  });

  bangTongQuanChuyen = computed(() => {
    const chuyen = this.thongTinChuyen();
    const date = this.NgayKhoiHanh();
    const list = this.danhSachVe().filter(v =>
      v.TenTuyenXe === chuyen.name &&
      this.VeThuocLoaiXeDangChon(v) &&
      v.NgayKhoiHanh === date &&
      v.TrangThaiVe !== 'da-huy'
    );

    return this.gioList.map(gio => {
      const tickets = list.filter(v => v.GioKhoiHanh === gio);
      const daThanhToan = tickets.filter(v => v.TrangThaiDonHang === 'da-thanh-toan').length;
      const giuCho = tickets.filter(v => v.TrangThaiDonHang === 'cho-thanh-toan').length;
      const total = this.totalSeats();
      const empty = Math.max(0, total - daThanhToan - giuCho);
      const pct = Math.round(((total - empty) / total) * 100);
      return { gio, daThanhToan, giuCho, empty, pct };
    });
  });

  noiDungChuyenKhoan = computed(() => {
    const selected = this.veDangSua();
    const seats = selected ? selected.SoGhe : this.gheDangChon().join('-') || 'GHE';
    const date = this.NgayKhoiHanh().replaceAll('-', '');
    return `VIAGO ${date} ${this.gioChayDuocChon().replace(':', '')} ${seats}`;
  });

  veChoThanhToan = computed(() => {
    return this.veTheoChuyen()
      .filter(v => v.TrangThaiDonHang === 'cho-thanh-toan')
      .slice(0, 5);
  });

  gioHienThi = computed(() => {
    const filter = this.boLocGio();

    return this.gioList.filter(gio => {
      const hour = Number(gio.split(':')[0]);
      let matchFilter = true;

      if (filter === 'sang') matchFilter = hour >= 5 && hour < 12;
      if (filter === 'chieu') matchFilter = hour >= 12 && hour < 18;
      if (filter === 'toi') matchFilter = hour >= 18 && hour < 22;
      if (filter === 'dem') matchFilter = hour >= 22 || hour < 5;

      return matchFilter;
    });
  });

  ketQuaTraCuuNhanh = computed(() => {
    const keyword = this.tuKhoaNhanh().trim().toLowerCase();
    if (keyword.length < 2) return [];

    return this.danhSachVe()
      .filter(v => {
        const haystack = [v.MaVe, v.HoTenNguoiDi, v.SdtNguoiDi, v.SoGhe, v.TenTuyenXe].join(' ').toLowerCase();
        return haystack.includes(keyword);
      })
      .slice(0, 6);
  });

  constructor(private router: Router) {}

  @HostListener('document:click', ['$event'])
  DongGoiYTuyenKhiClickNgoai(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.route-filter-wrapper')) {
      this.showTuyenSuggestions.set(false);
    }
  }

  ngOnInit() {
    this.TaiDuLieu();
    this.ResetForm();
    this.tuyenTimKiem.set(this.HienThiTuyen(this.thongTinChuyen().name));
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.TaiDuLieu();
      }
    });

  }

  ChonGhe(soGhe: string, forceSelect = false) {
    if (!this.tuyenDuocChon() || !this.loaiXeDuocChon()) {
      this.HienToast('Vui lòng chọn tuyến và loại xe trước khi đặt ghế.', 'danger');
      return;
    }

    const item = this.GheTheoMa(soGhe);
    if (!item) return;

    if (item.Ve) {
      if (!forceSelect && this.veDangSua()?.SoGhe === soGhe) {
        this.BoChonTatCa();
        return;
      }
      this.veDangSua.set(item.Ve);
      this.gheDangChon.set([]);
      this.NapFormTuVe(item.Ve);
      this.applyUpdateToGroup.set(false);
      this.showBookingModal.set(false);
      return;
    }

    const selected = this.gheDangChon();
    this.veDangSua.set(null);

    if (selected.includes(soGhe)) {
      this.gheDangChon.set(selected.filter(ghe => ghe !== soGhe));
      const newConfig = { ...this.gheConfig() };
      delete newConfig[soGhe];
      this.gheConfig.set(newConfig);
      return;
    }

    this.gheDangChon.set([...selected, soGhe]);
    this.gheConfig.set({ ...this.gheConfig(), [soGhe]: 'don' });
    if (selected.length === 0) {
      this.ResetForm(false);
    }
  }

  GheTheoMa(soGhe: string) {
    return this.gheList().find(g => g.SoGhe === soGhe);
  }

  ChonVeTuTraCuu(ve: VeXe) {
    const tuyen = this.tuyenList.find(t => t.name === ve.TenTuyenXe);
    if (tuyen) this.tuyenDuocChon.set(tuyen.id);
    this.DongBoXeTuVe(ve);

    this.NgayKhoiHanh.set(ve.NgayKhoiHanh);
    this.gioChayDuocChon.set(ve.GioKhoiHanh);
    this.tuKhoaNhanh.set('');
    this.gheDangChon.set([]);
    this.veDangSua.set(ve);
    this.showBookingModal.set(false);

    setTimeout(() => {
      const el = document.getElementById(`seat-${ve.SoGhe}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  MoThongTinVe(ve: VeXe) {
    const tuyen = this.tuyenList.find(t => t.name === ve.TenTuyenXe);
    if (tuyen) this.tuyenDuocChon.set(tuyen.id);
    this.DongBoXeTuVe(ve);

    this.NgayKhoiHanh.set(ve.NgayKhoiHanh);
    this.gioChayDuocChon.set(ve.GioKhoiHanh);
    this.tuKhoaNhanh.set('');
    this.gheDangChon.set([]);
    this.gheConfig.set({});
    this.veDangSua.set(ve);
    this.NapFormTuVe(ve);
    this.applyUpdateToGroup.set(false);
    this.showBookingModal.set(true);
  }

  TongGiaTriDonHang(ve: VeXe | null | undefined): number {
    if (!ve) return 0;
    return this.TatCaVeCungDon(ve).reduce((sum, item) => sum + item.GiaVe, 0);
  }

  TongGiaTriVeHieuLuc(ve: VeXe | null | undefined): number {
    if (!ve) return 0;
    return this.TatCaVeCungDon(ve)
      .filter(item => item.TrangThaiVe !== 'da-huy')
      .reduce((sum, item) => sum + item.GiaVe, 0);
  }

  SoVeHieuLucTrongDon(ve: VeXe | null | undefined): number {
    if (!ve) return 0;
    return this.TatCaVeCungDon(ve).filter(item => item.TrangThaiVe !== 'da-huy').length;
  }

  GetQrCodeUrl(ve: VeXe): string {
    const data = `${ve.MaDonHang}|${ve.MaVe}|${ve.MaQRVe || this.TaoMaQrVe(ve.MaDonHang, ve.SoGhe)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`;
  }

  XemTrongDanhSachVe(ve: VeXe) {
    this.showBookingModal.set(false);
    this.router.navigate(['/admin/datve/danhsach'], { queryParams: { search: ve.MaVe } });
  }

  ChinhSuaVeTrongDanhSach(ve: VeXe) {
    this.showBookingModal.set(false);
    this.router.navigate(['/admin/datve/danhsach'], { queryParams: { search: ve.MaVe } });
  }

  GuiSmsEmail(ve: VeXe) {
    this.HienToast(`Đã gửi lại vé điện tử cho khách hàng ${ve.HoTenNguoiDi} thành công.`, 'success');
  }

  LayGioCoMat(gio: string): string {
    const parts = gio.split(':');
    if (parts.length !== 2) return gio;
    let h = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    const buffer = this.thongTinChuyen().gioCoMatTruocPhut || 15;
    m -= buffer;
    if (m < 0) {
      m += 60;
      h -= 1;
      if (h < 0) h += 24;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  DinhDangNgay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  MoBookingModal() {
    if (this.gheDangChon().length === 0 && !this.veDangSua()) {
      this.HienToast('Vui lòng chọn ghế trước.', 'danger');
      return;
    }

    this.showBookingModal.set(true);
  }

  KiemTraSoDienThoai(sdt: string) {
    this.formSdt.set(sdt);
    const digits = sdt.replace(/\D/g, '');
    if (digits.length < 9) return;

    const hoSoGanNhat = this.danhSachVe()
      .filter(v => v.SdtNguoiDi.replace(/\D/g, '') === digits && v.TrangThaiVe !== 'da-huy')
      .sort((a, b) => b.ThoiGianDat.localeCompare(a.ThoiGianDat))[0];

    if (!hoSoGanNhat) return;

    this.formTen.set(hoSoGanNhat.HoTenNguoiDi);
    this.formEmail.set(hoSoGanNhat.EmailNguoiDi || '');
    this.formDiemDon.set(hoSoGanNhat.MaDiemDon);
    this.formDiemTra.set(hoSoGanNhat.MaDiemTra);
  }

  LuuDatVe(trangThai?: TrangThaiDonHang) {
    const status = trangThai ?? this.formTrangThaiThanhToan();
    this.formTrangThaiThanhToan.set(status);

    if (!this.KiemTraForm()) return;

    const seats = this.gheDangChon();
    if (seats.length === 0) {
      this.HienToast('Vui lòng chọn ít nhất một ghế.', 'danger');
      return;
    }

    let maDonHang = '';
    do {
      const dhSuffix = Date.now().toString().slice(-6);
      const dhRandom = Math.floor(100 + Math.random() * 900);
      maDonHang = `DH10${dhSuffix}${dhRandom}`;
    } while (this.danhSachVe().some(v => v.MaDonHang === maDonHang));

    const now = new Date().toISOString();
    const chuyen = this.thongTinChuyen();
    const xe = this.xeDangChon();
    const loaiXe = this.loaiXeDangChon();
    const maChuyen = this.TaoMaChuyen();
    const tongGiaVe = this.tongTien();
    const soLuongVeDaDat = seats.length;
    
    const totalDiscount = this.soTienGiam();
    const baseDiscount = seats.length > 0 ? Math.floor(totalDiscount / seats.length) : 0;
    const remainder = seats.length > 0 ? (totalDiscount - (baseDiscount * seats.length)) : 0;
    const maGiamGia = this.formMaGiamGia().trim().toUpperCase();

    const veMoi = seats.map((soGhe, index): VeXe => {
      const loaiGhe = this.LoaiGheTheoSoGhe(soGhe);
      const basePrice = this.GiaVeTheoLoaiGhe(loaiGhe);
      const seatDiscount = baseDiscount + (index < remainder ? 1 : 0);
      return {
        MaVe: this.TaoMaVe(index),
        MaDonHang: maDonHang,
        MaKhachHang: this.TaoMaKhachHang(this.formSdt().trim()),
        MaNVBanVe: 'NVBV001',
        HoTenNguoiDi: this.formTen().trim(),
        SdtNguoiDi: this.formSdt().trim(),
        EmailNguoiDi: this.formEmail().trim(),
        ThoiGianDat: now,
        SoLuongVeDaDat: soLuongVeDaDat,
        TienBaoHiem: 0,
        TongGiaVe: tongGiaVe,
        ThoiGianXuatVe: now,
        MaQRVe: this.TaoMaQrVe(maDonHang, soGhe),
        MaLichTrinh: maChuyen,
        MaXe: xe.maXe,
        MaGheChuyen: this.TaoMaGheChuyen(maChuyen, soGhe),
        LoaiXe: loaiXe.ten,
        LoaiGhe: this.LabelLoaiGhe(loaiGhe),
        TenXe: xe.tenXe,
        BienSoXe: xe.bienSo,
        TenTuyenXe: chuyen.name,
        NgayKhoiHanh: this.NgayKhoiHanh(),
        GioKhoiHanh: this.gioChayDuocChon(),
        SoGhe: soGhe,
        GiaVe: Math.max(0, basePrice - seatDiscount),
        MaGiamGia: maGiamGia || undefined,
        GiamGia: seatDiscount,
        MaDiemDon: this.formDiemDon().trim(),
        MaDiemTra: this.formDiemTra().trim(),
        PhuongThucThanhToan: this.formHinhThuc(),
        TrangThaiDonHang: status,
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: this.formGhiChu().trim(),
        NguonDat: this.formNguonDat(),
        SoLanDaSua: 0
      };
    });

    const updated = [...this.danhSachVe(), ...veMoi];
    this.danhSachVe.set(updated);
    this.LuuDuLieu(updated);
    this.HienToast(`${status === 'da-thanh-toan' ? 'Đã tạo vé chờ khởi hành' : 'Đã giữ chỗ'} ${seats.length} vé: ${seats.join(', ')}.`, 'success');
    this.gheDangChon.set([]);
    this.veDangSua.set(null);
    this.showBookingModal.set(false);
    if (status === 'da-thanh-toan') {
      this.veDangIn.set(veMoi);
    }
    this.ResetForm();
  }

  XacNhanThanhToan() {
    const ticket = this.veDangSua();
    if (!ticket) return;
    this.CapNhatVe(ticket, 'da-thanh-toan');
    this.showPaymentConfirmModal.set(false);
  }

  MoInVe() {
    const selected = this.veDangSua();
    if (selected) {
      if (selected.TrangThaiVe === 'da-huy') {
        this.HienToast('Vé này đã hủy nên không thể in.', 'danger');
        return;
      }

      this.veDangIn.set([selected]);
      this.showPrintModal.set(true);
      return;
    }

    const tickets = this.veDangIn().filter(ve => ve.TrangThaiVe !== 'da-huy');
    if (tickets.length === 0) {
      this.HienToast('Chọn một vé đã có hoặc tạo đơn mới trước khi in.', 'danger');
      return;
    }

    this.veDangIn.set(tickets);
    this.showPrintModal.set(true);
  }

  DongInVe() {
    this.showPrintModal.set(false);
  }

  InVeTrucTiep() {
    if (this.veDangIn().length === 0) return;
    this.HienToast(`Đã gửi lệnh in ${this.veDangIn().length} vé.`, 'success');
  }

  MoXacNhanHuyVeChon() {
    if (!this.veDangSua()) return;
    this.selectedCancelReason.set('Tôi đổi kế hoạch');
    this.applyCancelToGroup.set(false);
    this.showCancelSeatConfirm.set(true);
  }

  XacNhanHuyVeChon() {
    const ticket = this.veDangSua();
    if (!ticket) return;

    const toCancel: VeXe[] = this.applyCancelToGroup() ? this.NhomVeCungDon(ticket) : [ticket];
    const cancelIds = toCancel.map(v => v.MaVe);

    const bayGio = new Date();
    const hh = String(bayGio.getHours()).padStart(2, '0');
    const mm = String(bayGio.getMinutes()).padStart(2, '0');
    const dd = String(bayGio.getDate()).padStart(2, '0');
    const MM = String(bayGio.getMonth() + 1).padStart(2, '0');
    const yyyy = bayGio.getFullYear();
    const thoiGianHuy = `${hh}:${mm} ngày ${dd}/${MM}/${yyyy}`;

    const updated = this.danhSachVe().map(v => {
      if (!cancelIds.includes(v.MaVe)) return v;

      const refund = this.TinhHoanTien(v);
      const cancelDetail = `Đã hủy lúc ${thoiGianHuy} - Lý do: ${this.selectedCancelReason()} - Hoàn: ${refund.soTien.toLocaleString('vi-VN')} đ`;
      const note = [v.GhiChu || '', cancelDetail].filter(Boolean).join(' | ');

      return {
        ...v,
        TrangThaiVe: 'da-huy' as TrangThaiVe,
        TrangThaiGiaoDich: v.TrangThaiDonHang === 'da-thanh-toan' ? 'chua-hoan' as const : 'da-hoan' as const,
        GhiChu: note,
        NguoiHuy: 'Nguyen An Ninh',
        ThoiGianHuy: bayGio.toISOString()
      };
    });

    this.danhSachVe.set(updated);
    this.LuuDuLieu(updated);
    this.showCancelSeatConfirm.set(false);
    this.showBookingModal.set(false);
    this.veDangSua.set(null);
    this.gheDangChon.set([]);
    this.ResetForm();
    this.HienToast(
      this.applyCancelToGroup()
        ? `Đã hủy ${cancelIds.length} vé hiệu lực trong đơn ${ticket.MaDonHang}.`
        : `Đã hủy vé ${ticket.MaVe} - ghế ${ticket.SoGhe}.`,
      'success'
    );
  }

  MoChuyenGhe(ve: VeXe) {
    this.seatToTransfer.set(ve);
    this.selectedNewSeat.set('');
    this.showTransferModal.set(true);
  }

  XacNhanChuyenGhe() {
    const ticket = this.seatToTransfer();
    const newSeat = this.selectedNewSeat();
    if (!ticket || !newSeat) return;

    const seatItem = this.GheTheoMa(newSeat);
    if (!seatItem || seatItem.TrangThai !== 'trong') {
      this.HienToast('Ghế đích không còn trống.', 'danger');
      return;
    }

    const bayGio = new Date();
    const hh = String(bayGio.getHours()).padStart(2, '0');
    const mm = String(bayGio.getMinutes()).padStart(2, '0');
    const dd = String(bayGio.getDate()).padStart(2, '0');
    const MM = String(bayGio.getMonth() + 1).padStart(2, '0');
    const yyyy = bayGio.getFullYear();
    const thoiGianStr = `${hh}:${mm} ngày ${dd}/${MM}/${yyyy}`;
    const logGhe = `Đổi ghế từ ${ticket.SoGhe} sang ${newSeat} lúc ${thoiGianStr}`;

    const updated = this.danhSachVe().map(v => {
      if (v.MaVe === ticket.MaVe) {
        const note = [v.GhiChu || '', logGhe].filter(Boolean).join(' | ');
        return { ...v, SoGhe: newSeat, GhiChu: note };
      }
      return v;
    });

    this.danhSachVe.set(updated);
    this.LuuDuLieu(updated);
    this.showTransferModal.set(false);
    this.seatToTransfer.set(null);
    this.BoChonTatCa();
    this.HienToast(`Đã chuyển khách từ ghế ${ticket.SoGhe} sang ghế ${newSeat}.`, 'success');
  }

  TinhHoanTien(ve: VeXe) {
    if (ve.TrangThaiDonHang !== 'da-thanh-toan') {
      return { tiLe: 0, soTien: 0, phiHuy: 0, moTa: 'Vé giữ chỗ, không phát sinh hoàn tiền' };
    }
    const gioConLai = this.SoGioTruocKhoiHanh(ve);
    if (gioConLai >= 24) {
      return { tiLe: 100, soTien: ve.GiaVe, phiHuy: 0, moTa: 'Trước giờ đi từ 24 giờ' };
    }
    if (gioConLai >= 12) {
      const soTien = Math.round(ve.GiaVe * 0.5);
      return { tiLe: 50, soTien, phiHuy: ve.GiaVe - soTien, moTa: 'Trước giờ đi từ 12 đến 24 giờ' };
    }
    return { tiLe: 0, soTien: 0, phiHuy: ve.GiaVe, moTa: 'Trước giờ đi dưới 12 giờ' };
  }

  SoGioTruocKhoiHanh(ve: VeXe) {
    const departure = new Date(`${ve.NgayKhoiHanh}T${ve.GioKhoiHanh}:00`);
    const diffMs = departure.getTime() - Date.now();
    return Math.max(0, diffMs / 36e5);
  }

  TinhTongHoanTienNhom(ticket: VeXe): number {
    const group = this.NhomVeCungDon(ticket);
    return group.reduce((sum, v) => sum + this.TinhHoanTien(v).soTien, 0);
  }

  TinhTongPhiHuyNhom(ticket: VeXe): number {
    const group = this.NhomVeCungDon(ticket);
    return group.reduce((sum, v) => sum + this.TinhHoanTien(v).phiHuy, 0);
  }

  TinhTongGiaGocNhom(ticket: VeXe): number {
    const group = this.NhomVeCungDon(ticket);
    return group.reduce((sum, v) => sum + v.GiaVe, 0);
  }

  DongBookingModal() {
    this.showBookingModal.set(false);
  }

  BoChonTatCa() {
    this.gheDangChon.set([]);
    this.veDangSua.set(null);
    this.gheConfig.set({});
    this.showBookingModal.set(false);
    this.ResetForm();
  }

  ChuyenTuyen(tuyenId: string) {
    this.tuyenDuocChon.set(tuyenId);
    this.tuyenTimKiem.set(this.HienThiTuyen(this.thongTinChuyen().name));
    this.showTuyenSuggestions.set(false);
    this.BoChonTatCa();
  }

  ChonLoaiXe(loaiXe: string) {
    const loaiXeHopLe = this.loaiXeList.some(item => item.id === loaiXe) ? loaiXe as LoaiXeId : 'limousine';
    this.loaiXeDuocChon.set(loaiXeHopLe);
    const xeDauTien = this.danhSachXe.find(xe => xe.loaiXe === loaiXeHopLe);
    if (xeDauTien) this.maXeDuocChon.set(xeDauTien.maXe);
    this.BoChonTatCa();
  }

  ChonXe(maXe: string) {
    const xe = this.danhSachXe.find(item => item.maXe === maXe);
    if (!xe) return;
    this.loaiXeDuocChon.set(xe.loaiXe);
    this.maXeDuocChon.set(xe.maXe);
    this.BoChonTatCa();
  }

  CapNhatTuyenTimKiem(value: string) {
    this.tuyenTimKiem.set(value);
    this.showTuyenSuggestions.set(true);
  }

  XoaTuyenTimKiem() {
    this.tuyenTimKiem.set('');
    this.showTuyenSuggestions.set(true);
  }

  ToggleGoiYTuyen() {
    this.showTuyenSuggestions.set(!this.showTuyenSuggestions());
  }

  DongGoiYTuyenTre() {
    setTimeout(() => this.showTuyenSuggestions.set(false), 120);
  }

  ChonTuyenGoiY(tuyen: TenTuyenXe) {
    this.ChuyenTuyen(tuyen.id);
  }

  ChuyenGio(gio: string) {
    this.gioChayDuocChon.set(gio);
    this.BoChonTatCa();
  }

  CapNhatBoLocGio(value: string) {
    this.boLocGio.set(value as BoLocGio);
  }

  ChuyenNgay(ngay: string) {
    this.NgayKhoiHanh.set(ngay);
    this.BoChonTatCa();
  }

  CapNhatHinhThuc(value: string) {
    this.formHinhThuc.set(value as PhuongThucThanhToan);
  }

  CapNhatTrangThaiThanhToan(value: string) {
    this.formTrangThaiThanhToan.set(value as TrangThaiDonHang);
  }

  CapNhatNguonDat(value: string) {
    this.formNguonDat.set(value as NguonDat);
  }

  CapNhatMaGiamGia(value: string) {
    this.formMaGiamGia.set(value.toUpperCase());
  }

  ThongKeTheoGio(gio: string) {
    const chuyen = this.thongTinChuyen();
    const tickets = this.danhSachVe().filter(v =>
      v.TenTuyenXe === chuyen.name &&
      this.VeThuocLoaiXeDangChon(v) &&
      v.NgayKhoiHanh === this.NgayKhoiHanh() &&
      v.GioKhoiHanh === gio &&
      v.TrangThaiVe !== 'da-huy'
    );

    const daThanhToan = tickets.filter(v => v.TrangThaiDonHang === 'da-thanh-toan').length;
    const giuCho = tickets.filter(v => v.TrangThaiDonHang === 'cho-thanh-toan').length;
    const total = this.totalSeats();
    const trong = Math.max(0, total - daThanhToan - giuCho);
    const tyLe = (value: number) => Math.round((value / total) * 100);

    return {
      tong: total,
      trong,
      giuCho,
      daThanhToan,
      tiLeDay: tyLe(daThanhToan + giuCho),
      tiLeDaThanhToan: tyLe(daThanhToan),
      tiLeGiuCho: tyLe(giuCho),
      tiLeTrong: tyLe(trong)
    };
  }

  LabelThanhToan(value: TrangThaiDonHang) {
    return this.LabelTrangThaiDonHang(value);
  }

  LabelTrangThaiDonHang(value: TrangThaiDonHang) {
    return value === 'da-thanh-toan' ? 'Đã thanh toán' : 'Chờ thanh toán';
  }

  LabelTrangThaiVeHienThi(ve: VeXe) {
    if (ve.TrangThaiVe === 'da-huy') return 'Đã hủy';
    if (ve.TrangThaiVe === 'da-hoan-thanh') return 'Đã hoàn thành';
    if (ve.TrangThaiDonHang === 'cho-thanh-toan') return 'Giữ chỗ';
    return 'Chờ khởi hành';
  }

  LabelHinhThuc(value: PhuongThucThanhToan) {
    const labels: Record<PhuongThucThanhToan, string> = {
      'tien-mat': 'Tiền mặt',
      'chuyen-khoan': 'Chuyển khoản',
      the: 'Thẻ'
    };
    return labels[value];
  }

  LabelNguonDat(value?: NguonDat) {
    if (value === 'hotline') return 'Hotline';
    if (value === 'online') return 'Online';
    return 'Tại quầy';
  }

  LabelLoaiGhe(value?: LoaiGheId | string) {
    const labels: Record<LoaiGheId, string> = {
      'giuong-nam': 'Giường nằm',
      limousine: 'Limousine',
      'cabin-don': 'Cabin đơn',
      'cabin-doi': 'Cabin đôi'
    };
    return value && value in labels ? labels[value as LoaiGheId] : String(value || '');
  }

  GiaVeTheoLoaiGhe(loaiGhe: LoaiGheId, giaCoSo = this.thongTinChuyen().giaGoc) {
    const phuThu: Record<LoaiGheId, number> = {
      'giuong-nam': 0,
      limousine: 40000,
      'cabin-don': 60000,
      'cabin-doi': 260000
    };
    return giaCoSo + phuThu[loaiGhe];
  }

  GiaVeTheoSoGhe(soGhe: string) {
    return this.GiaVeTheoLoaiGhe(this.LoaiGheTheoSoGhe(soGhe));
  }

  GiaThapNhatTheoLoaiXe(loaiXe: LoaiXeId) {
    if (loaiXe === 'cabin') return this.GiaVeTheoLoaiGhe('cabin-don');
    const prices = this.seatLayouts[loaiXe]
      .flatMap(deck => deck.rows.flat())
      .filter(Boolean)
      .map(soGhe => this.GiaVeTheoLoaiGhe(this.LoaiGheTheoSoGhe(soGhe, loaiXe)));
    return Math.min(...prices);
  }

  GiaCaoNhatTheoLoaiXe(loaiXe: LoaiXeId) {
    if (loaiXe === 'cabin') return this.GiaVeTheoLoaiGhe('cabin-doi');
    const prices = this.seatLayouts[loaiXe]
      .flatMap(deck => deck.rows.flat())
      .filter(Boolean)
      .map(soGhe => this.GiaVeTheoLoaiGhe(this.LoaiGheTheoSoGhe(soGhe, loaiXe)));
    return Math.max(...prices);
  }

  HienThiGiaLoaiXe(loaiXe: LoaiXeId) {
    const min = this.GiaThapNhatTheoLoaiXe(loaiXe);
    const max = this.GiaCaoNhatTheoLoaiXe(loaiXe);
    if (min === max) return `${min.toLocaleString('vi-VN')}đ`;
    return `${min.toLocaleString('vi-VN')}đ - ${max.toLocaleString('vi-VN')}đ`;
  }

  MoTaGheNgan(soGhe: string) {
    return this.LabelLoaiGhe(this.LoaiGheTheoSoGhe(soGhe));
  }

  TieuDeGhe(ghe: GheXe) {
    if (ghe.Ve) return `${ghe.Ve.HoTenNguoiDi} - ${ghe.Ve.SdtNguoiDi}`;
    return `${this.LabelLoaiGhe(ghe.LoaiGhe)} - ${ghe.GiaVe.toLocaleString('vi-VN')}đ`;
  }

  LayBienSoTheoVe(ve: VeXe): string {
    const xe = this.danhSachXe.find(item => item.maXe === ve.MaXe);
    return ve.BienSoXe || xe?.bienSo || this.thongTinChuyen().bienSo;
  }

  LayMaDonHang(ve: VeXe | null | undefined): string {
    return ve?.MaDonHang || '';
  }

  XacNhanLuuThayDoi() {
    const ticket = this.veDangSua();
    if (!ticket) return;
    this.CapNhatVe(ticket, this.formTrangThaiThanhToan());
    this.showConfirmChangesModal.set(false);
    this.showBookingModal.set(false);
  }

  LuuThongTinDonHang() {
    const ticket = this.veDangSua();
    if (!ticket) return;
    if (!this.KiemTraForm()) return;
    this.applyUpdateToGroup.set(true);
    this.CapNhatVe(ticket, this.formTrangThaiThanhToan());
    this.showBookingModal.set(false);
  }

  HienTacVu(label: string) {
    this.HienToast(`${label} đã được ghi nhận cho chuyến ${this.gioChayDuocChon()}.`, 'success');
  }

  private TaiDuLieu() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(ve => {
            const veChuan = this.ChuanHoaVeXe(ve);
            let note = veChuan.GhiChu || '';
            note = note.split(' | ')
              .filter(part => 
                !part.includes('Cập nhật thông tin lúc') && 
                !part.includes('Đổi ghế từ') && 
                !part.includes('Xác nhận thanh toán qua')
              )
              .join(' | ');

            return { 
              ...veChuan, 
              GhiChu: note
            };
          });
          this.danhSachVe.set(cleaned);
          this.LuuDuLieu(cleaned);
          return;
        }
      } catch (error) {
        console.error('Không đọc được dữ liệu vé', error);
      }
    }

    const sample = this.TaoDuLieuMau().map(ve => this.ChuanHoaVeXe(ve));
    this.danhSachVe.set(sample);
    this.LuuDuLieu(sample);
  }

  private LuuDuLieu(ds: VeXe[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(ds.map(ve => this.ChuanHoaVeXe(ve))));
  }

  private ChuanHoaVeXe(raw: any): VeXe {
    const maVe = String(raw?.MaVe ?? `VE${Date.now()}`);
    const sdt = String(raw?.SdtNguoiDi ?? raw?.SoDienThoai ?? '');
    const soGhe = this.NormalizeSeatCode(String(raw?.SoGhe ?? ''));
    const maDonHang = String(raw?.MaDonHang ?? `DH${maVe.replace(/\D/g, '') || Date.now()}`);
    const maLichTrinh = String(raw?.MaLichTrinh ?? raw?.MaChuyenXe ?? this.TaoMaChuyen());
    const rawMaXe = String(raw?.MaXe ?? '');
    const maXeDuPhong = this.LayMaXeTheoMaLichTrinh(maLichTrinh);
    const maXe = this.danhSachXe.some(item => item.maXe === rawMaXe) ? rawMaXe : maXeDuPhong;
    const xe = this.danhSachXe.find(item => item.maXe === maXe);
    const loaiGheId = this.LoaiGheTheoSoGhe(soGhe, xe?.loaiXe ?? this.loaiXeDuocChon());
    const loaiGhe = raw?.LoaiGhe
      ? String(raw.LoaiGhe)
      : this.LabelLoaiGhe(loaiGheId);
    const tenTuyenXe = String(raw?.TenTuyenXe ?? raw?.TuyenXe ?? this.thongTinChuyen().name);
    const giaCoSo = this.tuyenList.find(tuyen => tuyen.name === tenTuyenXe)?.giaGoc ?? this.thongTinChuyen().giaGoc;
    const thoiGianDat = String(raw?.ThoiGianDat ?? raw?.ThoiGianTao ?? new Date().toISOString());
    const soLuongVeDaDat = Number(raw?.SoLuongVeDaDat ?? 1);
    const giaVe = raw?.LoaiGhe ? Number(raw?.GiaVe ?? 0) : this.GiaVeTheoLoaiGhe(loaiGheId, giaCoSo);

    return {
      ...raw,
      MaVe: maVe,
      MaDonHang: maDonHang,
      MaKhachHang: raw?.MaKhachHang ?? this.TaoMaKhachHang(sdt),
      MaNVBanVe: raw?.MaNVBanVe ?? 'NVBV001',
      HoTenNguoiDi: String(raw?.HoTenNguoiDi ?? raw?.TenKhachHang ?? ''),
      SdtNguoiDi: sdt,
      EmailNguoiDi: String(raw?.EmailNguoiDi ?? raw?.Email ?? ''),
      ThoiGianDat: thoiGianDat,
      SoLuongVeDaDat: soLuongVeDaDat,
      TienBaoHiem: Number(raw?.TienBaoHiem ?? 0),
      TongGiaVe: raw?.LoaiGhe ? Number(raw?.TongGiaVe ?? giaVe) : giaVe * soLuongVeDaDat,
      ThoiGianXuatVe: String(raw?.ThoiGianXuatVe ?? thoiGianDat),
      MaQRVe: String(raw?.MaQRVe ?? this.TaoMaQrVe(maDonHang, soGhe)),
      MaLichTrinh: maLichTrinh,
      MaXe: maXe,
      MaGheChuyen: String(raw?.MaGheChuyen ?? this.TaoMaGheChuyen(maLichTrinh, soGhe)),
      LoaiXe: String(raw?.LoaiXe ?? (xe ? this.loaiXeList.find(item => item.id === xe.loaiXe)?.ten : '') ?? ''),
      LoaiGhe: loaiGhe,
      TenXe: String(raw?.TenXe ?? xe?.tenXe ?? ''),
      BienSoXe: String(raw?.BienSoXe ?? xe?.bienSo ?? ''),
      TenTuyenXe: tenTuyenXe,
      NgayKhoiHanh: String(raw?.NgayKhoiHanh ?? raw?.NgayDi ?? this.todayString()),
      GioKhoiHanh: String(raw?.GioKhoiHanh ?? raw?.GioChay ?? this.gioChayDuocChon()),
      SoGhe: soGhe,
      GiaVe: giaVe,
      MaGiamGia: raw?.MaGiamGia,
      GiamGia: Number(raw?.GiamGia ?? 0),
      MaDiemDon: String(raw?.MaDiemDon ?? raw?.DiemDon ?? ''),
      MaDiemTra: String(raw?.MaDiemTra ?? raw?.DiemTra ?? ''),
      PhuongThucThanhToan: (raw?.PhuongThucThanhToan ?? raw?.HinhThucThanhToan ?? 'tien-mat') as PhuongThucThanhToan,
      TrangThaiDonHang: (raw?.TrangThaiDonHang ?? raw?.TrangThaiThanhToan ?? 'cho-thanh-toan') as TrangThaiDonHang,
      TrangThaiVe: (raw?.TrangThaiVe ?? 'cho-khoi-hanh') as TrangThaiVe,
      GhiChu: String(raw?.GhiChu ?? ''),
      NguonDat: (raw?.NguonDat ?? 'tai-quay') as NguonDat,
      SoLanDaSua: Number(raw?.SoLanDaSua ?? raw?.SoLanSua ?? 0),
      NguoiHuy: raw?.NguoiHuy,
      ThoiGianHuy: raw?.ThoiGianHuy ?? raw?.NgayHuy,
      TrangThaiGiaoDich: raw?.TrangThaiGiaoDich ?? raw?.TrangThaiHoan
    };
  }

  private KiemTraForm() {
    const phoneLength = this.formSdt().replace(/\D/g, '').length;

    if (!this.formTen().trim()) {
      this.HienToast('Vui lòng nhập họ tên hành khách.', 'danger');
      return false;
    }

    const cleanPhone = this.formSdt().trim();
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(cleanPhone)) {
      this.HienToast('Số điện thoại không đúng định dạng Việt Nam (phải gồm 10 số bắt đầu bằng 03, 05, 07, 08, 09).', 'danger');
      return false;
    }

    if (!this.formDiemDon().trim() || !this.formDiemTra().trim()) {
      this.HienToast('Vui lòng chọn điểm đón và điểm trả.', 'danger');
      return false;
    }

    return true;
  }

  private CapNhatVe(ticket: VeXe, status: TrangThaiDonHang) {
    const maGiamGia = this.formMaGiamGia().trim().toUpperCase();
    const giamGia = this.soTienGiam();

    const bayGio = new Date();
    const hh = String(bayGio.getHours()).padStart(2, '0');
    const mm = String(bayGio.getMinutes()).padStart(2, '0');
    const dd = String(bayGio.getDate()).padStart(2, '0');
    const MM = String(bayGio.getMonth() + 1).padStart(2, '0');
    const yyyy = bayGio.getFullYear();
    const thoiGianStr = `${hh}:${mm} ngày ${dd}/${MM}/${yyyy}`;

    const groupTickets = this.TatCaVeCungDon(ticket);
    const groupIds = groupTickets.map(g => g.MaVe);

    const updated = this.danhSachVe().map(v => {
      if (!groupIds.includes(v.MaVe)) return v;

      return {
        ...v,
        HoTenNguoiDi: this.formTen().trim(),
        SdtNguoiDi: this.formSdt().trim(),
        EmailNguoiDi: this.formEmail().trim(),
        MaDiemDon: this.formDiemDon().trim(),
        MaDiemTra: this.formDiemTra().trim(),
        PhuongThucThanhToan: this.formHinhThuc(),
        TrangThaiDonHang: status,
        GhiChu: this.formGhiChu().trim(),
        NguonDat: this.formNguonDat(),
        SoLanDaSua: (v.SoLanDaSua ?? 0) + 1
      };
    });

    this.danhSachVe.set(updated);
    this.LuuDuLieu(updated);

    const refreshed = updated.find(v => v.MaVe === ticket.MaVe) ?? null;
    this.veDangSua.set(refreshed);
    if (refreshed) this.NapFormTuVe(refreshed);
    this.HienToast(`Đã cập nhật thông tin đơn hàng ${ticket.MaDonHang} cho ${groupIds.length} vé.`, 'success');
  }

  private NapFormTuVe(ve: VeXe) {
    this.formSdt.set(ve.SdtNguoiDi);
    this.formTen.set(ve.HoTenNguoiDi);
    this.formEmail.set(ve.EmailNguoiDi || '');
    this.formDiemDon.set(ve.MaDiemDon);
    this.formDiemTra.set(ve.MaDiemTra);
    this.formHinhThuc.set(ve.PhuongThucThanhToan);
    this.formTrangThaiThanhToan.set(ve.TrangThaiDonHang);
    this.formNguonDat.set(ve.NguonDat ?? 'tai-quay');
    this.formMaGiamGia.set(ve.MaGiamGia || '');
    this.formGhiChu.set(this.LayGhiChuSach(ve.GhiChu));
  }

  private ResetForm(resetCustomer = true) {
    const chuyen = this.thongTinChuyen();

    if (resetCustomer) {
      this.formSdt.set('');
      this.formTen.set('');
      this.formEmail.set('');
      this.formGhiChu.set('');
      this.formMaGiamGia.set('');
    }

    this.formDiemDon.set(chuyen.MaDiemDon[0] ?? '');
    this.formDiemTra.set(chuyen.MaDiemTra[0] ?? '');
    this.formHinhThuc.set('tien-mat');
    this.formTrangThaiThanhToan.set('da-thanh-toan');
    this.formNguonDat.set('tai-quay');
  }

  private TinhGiamGia(tamTinh: number) {
    const code = this.formMaGiamGia().trim().toUpperCase();
    const coupon = this.maGiamGiaList.find(item => item.code === code);
    if (!coupon || !code) return 0;
    if ('percent' in coupon && coupon.percent) {
      return Math.round((tamTinh * coupon.percent) / 100);
    }
    return Math.min(tamTinh, coupon.amount ?? 0);
  }

  NhomVeCungDon(ticket: VeXe) {
    if (!ticket.MaDonHang) return [ticket];
    const group = this.danhSachVe().filter(v =>
      v.MaDonHang === ticket.MaDonHang &&
      v.TrangThaiVe !== 'da-huy'
    );

    return group.length > 0 ? group : [ticket];
  }

  TatCaVeCungDon(ticket: VeXe) {
    if (!ticket.MaDonHang) return [ticket];
    const group = this.danhSachVe().filter(v => v.MaDonHang === ticket.MaDonHang);
    return group.length > 0 ? group : [ticket];
  }

  private LoaiGheTheoSoGhe(soGhe: string, loaiXe = this.loaiXeDuocChon()): LoaiGheId {
    if (loaiXe === 'limousine') return 'limousine';
    if (loaiXe === 'giuong-nam') return 'giuong-nam';
    return this.gheConfig()[soGhe] === 'doi' ? 'cabin-doi' : 'cabin-don';
  }

  private VeThuocLoaiXeDangChon(ve: VeXe) {
    const loaiXe = this.loaiXeDangChon().ten;
    if (ve.LoaiXe === loaiXe) return true;
    const xe = this.danhSachXe.find(item => item.maXe === ve.MaXe);
    return xe?.loaiXe === this.loaiXeDuocChon();
  }

  private DongBoXeTuVe(ve: VeXe) {
    const xe = this.danhSachXe.find(item => item.maXe === ve.MaXe);
    if (!xe) return;
    this.loaiXeDuocChon.set(xe.loaiXe);
    this.maXeDuocChon.set(xe.maXe);
  }

  private TaoMaChuyen() {
    return `${this.tuyenDuocChon()}-${this.xeDangChon().maXe}-${this.NgayKhoiHanh().replaceAll('-', '')}-${this.gioChayDuocChon().replace(':', '')}`;
  }

  private TaoMaKhachHang(sdt: string) {
    const digits = sdt.replace(/\D/g, '').slice(-8);
    return `KH${digits || '00000000'}`;
  }

  private LayMaXeTheoTuyen(tuyenId: string) {
    return this.xeDangChon().maXe || this.tuyenList.find(tuyen => tuyen.id === tuyenId)?.maXe || 'XE000';
  }

  private LayMaXeTheoMaLichTrinh(maLichTrinh: string) {
    const xeMacDinhTheoTuyen: Record<string, string> = {
      'HCM-CT': 'LIMO01',
      'HCM-VT': 'LIMO02',
      'DL-BMT': 'GN02',
      'DL-NT': 'CAB01',
      'CT-RG': 'GN03',
      'HCM-PT': 'GN04',
      'HCM-DL': 'CAB02',
      'HCM-NT': 'GN01',
      'NT-DN': 'CAB03'
    };

    return this.danhSachXe.find(xe => maLichTrinh.includes(`-${xe.maXe}-`))?.maXe
      ?? Object.entries(xeMacDinhTheoTuyen).find(([tuyenId]) => maLichTrinh.startsWith(`${tuyenId}-`))?.[1]
      ?? this.danhSachXe[0].maXe;
  }

  HienThiTuyen(tuyen: string) {
    const diem = this.TachDiemTuyen(tuyen);
    if (diem.length === 2) return `${diem[0]} - ${diem[1]}`;
    return (tuyen || '').replace(/\s*(↔|<->|->|→)\s*/g, ' - ');
  }

  private KhopLocTuyenMotChieu(tuyen: string, query: string) {
    const normalizedQuery = this.NormalizeSearchText(query);
    if (!normalizedQuery) return true;

    const routeText = this.TuyenSearchText(this.HienThiTuyen(tuyen));
    if (!this.MatchSearchText(routeText, query)) return false;

    const diem = this.TachDiemTuyen(tuyen);
    const diemDau = diem[0] || tuyen;
    const firstTerm = normalizedQuery.split(' ')[0];
    return this.NormalizeSearchText(this.TuyenDiemSearchText(diemDau)).includes(firstTerm);
  }

  private TachDiemTuyen(tuyen: string) {
    return (tuyen || '')
      .split(/\s+(?:↔|<->|->|→|-)\s+/)
      .map(part => part.trim())
      .filter(Boolean)
      .slice(0, 2);
  }

  private TuyenSearchText(tuyen: string) {
    const diem = this.TachDiemTuyen(tuyen);
    const aliasDiem = diem.map(part => this.TuyenDiemSearchText(part)).join(' ');
    const hienThi = this.HienThiTuyen(tuyen);
    return `${hienThi} ${aliasDiem}`;
  }

  private TuyenDiemSearchText(diem: string) {
    const aliases: string[] = [];
    if (diem.includes('TP.HCM')) aliases.push('TPHCM HCM TP HCM Sài Gòn SG Hồ Chí Minh');
    if (diem.includes('Cần Thơ')) aliases.push('Cantho CT');
    if (diem.includes('Đà Lạt')) aliases.push('Dalat DL');
    if (diem.includes('Vũng Tàu')) aliases.push('VT Vungtau');
    if (diem.includes('Nha Trang')) aliases.push('NT Nhatrang');
    if (diem.includes('Đà Nẵng')) aliases.push('DN Danang');
    if (diem.includes('Rạch Giá')) aliases.push('RG Rachgia');
    if (diem.includes('Phan Thiết')) aliases.push('PT Phanthiet');
    if (diem.includes('Buôn Ma Thuột')) aliases.push('BMT Buonmathuot');
    return `${diem} ${aliases.join(' ')}`;
  }

  private MatchSearchText(source: string, query: string) {
    const normalizedSource = this.NormalizeSearchText(source);
    const normalizedQuery = this.NormalizeSearchText(query);
    if (!normalizedQuery) return true;
    return normalizedQuery.split(' ').every(term => normalizedSource.includes(term));
  }

  private NormalizeSearchText(value: string) {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private TaoMaGheChuyen(maLichTrinh: string, soGhe: string) {
    return `GC-${maLichTrinh}-${soGhe}`.replace(/\s+/g, '');
  }

  private TaoMaQrVe(maDonHang: string, soGhe: string) {
    return `QR-${maDonHang}-${soGhe}`.replace(/\s+/g, '');
  }

  private TaoMaVe(index: number): string {
    let code = '';
    do {
      const suffix = Date.now().toString().slice(-6);
      const random = Math.floor(10 + Math.random() * 90);
      code = `VE${suffix}${random + index}`;
    } while (this.danhSachVe().some(v => v.MaVe === code));
    return code;
  }

  private NormalizeSeatCode(soGhe: string) {
    const trimmed = soGhe.trim().toUpperCase();
    const oldFormat = trimmed.match(/^([AB])(\d{1,2})$/);
    if (!oldFormat) return trimmed;
    return `${oldFormat[2]}${oldFormat[1]}`;
  }

  HienToast(msg: string, type: 'success' | 'danger') {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 3200);
  }

  private TaoDuLieuMau(): VeXe[] {
    const today = this.todayString();
    const now = new Date().toISOString();

    const thongTinTuyen = (tuyenId: string) => this.tuyenList.find(tuyen => tuyen.id === tuyenId) ?? this.tuyenList[0];
    const thongTinChuyen = (tuyenId: string, gio: string) => {
      const tuyen = thongTinTuyen(tuyenId);
      return {
        MaLichTrinh: `${tuyen.id}-${today.replaceAll('-', '')}-${gio.replace(':', '')}`,
        TenTuyenXe: tuyen.name,
        NgayKhoiHanh: today,
        GioKhoiHanh: gio,
        MaXe: tuyen.maXe,
        MaNVBanVe: 'NVBV001',
        ThoiGianDat: now,
        ThoiGianXuatVe: now
      };
    };
    const tongGiaTriDon = (tuyenId: string, soVe: number) => thongTinTuyen(tuyenId).giaGoc * soVe;

    return [
      {
        ...thongTinChuyen('HCM-CT', '05:30'),
        MaVe: 'VE10000018-1',
        MaDonHang: 'DH10000018',
        MaKhachHang: 'KH00234567',
        HoTenNguoiDi: 'Mỹ Mỹ',
        SdtNguoiDi: '0900234567',
        EmailNguoiDi: 'myan@example.com',
        SoLuongVeDaDat: 3,
        TongGiaVe: tongGiaTriDon('HCM-CT', 3),
        MaQRVe: 'QR-VE10000018-1A',
        SoGhe: '1A',
        GiaVe: thongTinTuyen('HCM-CT').giaGoc,
        MaDiemDon: 'Bến xe Miền Đông Mới',
        MaDiemTra: 'Bến xe Trung tâm Cần Thơ',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Đơn 3 vé tuyến TP.HCM - Cần Thơ, khách đi gia đình.',
        NguonDat: 'tai-quay',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('HCM-CT', '05:30'),
        MaVe: 'VE10000018-2',
        MaDonHang: 'DH10000018',
        MaKhachHang: 'KH00234567',
        HoTenNguoiDi: 'Mỹ Mỹ',
        SdtNguoiDi: '0900234567',
        EmailNguoiDi: 'myan@example.com',
        SoLuongVeDaDat: 3,
        TongGiaVe: tongGiaTriDon('HCM-CT', 3),
        MaQRVe: 'QR-VE10000018-2A',
        SoGhe: '2A',
        GiaVe: thongTinTuyen('HCM-CT').giaGoc,
        MaDiemDon: 'Bến xe Miền Đông Mới',
        MaDiemTra: 'Bến xe Trung tâm Cần Thơ',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Đơn 3 vé tuyến TP.HCM - Cần Thơ, khách đi gia đình.',
        NguonDat: 'tai-quay',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('HCM-CT', '05:30'),
        MaVe: 'VE10000018-3',
        MaDonHang: 'DH10000018',
        MaKhachHang: 'KH00234567',
        HoTenNguoiDi: 'Mỹ Mỹ',
        SdtNguoiDi: '0900234567',
        EmailNguoiDi: 'myan@example.com',
        SoLuongVeDaDat: 3,
        TongGiaVe: tongGiaTriDon('HCM-CT', 3),
        MaQRVe: 'QR-VE10000018-3A',
        SoGhe: '3A',
        GiaVe: thongTinTuyen('HCM-CT').giaGoc,
        MaDiemDon: 'Bến xe Miền Đông Mới',
        MaDiemTra: 'Bến xe Trung tâm Cần Thơ',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'da-huy',
        GhiChu: 'Đơn 3 vé tuyến TP.HCM - Cần Thơ, khách đi gia đình. | Đã hủy lúc 09:20 ngày 24/06/2026 - Lý do: Tôi đổi kế hoạch - Hoàn: 180.000 đ',
        NguonDat: 'tai-quay',
        SoLanDaSua: 0,
        NguoiHuy: 'Nguyen An Ninh',
        ThoiGianHuy: now,
        TrangThaiGiaoDich: 'da-hoan'
      },
      {
        ...thongTinChuyen('HCM-VT', '07:00'),
        MaVe: 'VE10000019-1',
        MaDonHang: 'DH10000019',
        MaKhachHang: 'KH98776655',
        HoTenNguoiDi: 'Nguyễn Văn Minh',
        SdtNguoiDi: '0988776655',
        EmailNguoiDi: 'minh.nguyen@gmail.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('HCM-VT', 1),
        MaQRVe: 'QR-VE10000019-5A',
        SoGhe: '5A',
        GiaVe: thongTinTuyen('HCM-VT').giaGoc,
        MaDiemDon: 'Văn phòng Quận 1',
        MaDiemTra: 'Bãi Sau',
        PhuongThucThanhToan: 'tien-mat',
        TrangThaiDonHang: 'cho-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách hotline, giữ chỗ tuyến TP.HCM - Vũng Tàu.',
        NguonDat: 'hotline',
        SoLanDaSua: 1
      },
      {
        ...thongTinChuyen('DL-BMT', '08:00'),
        MaVe: 'VE10000020-1',
        MaDonHang: 'DH10000020',
        MaKhachHang: 'KH12345678',
        HoTenNguoiDi: 'Trần Hoài Nam',
        SdtNguoiDi: '0912345678',
        EmailNguoiDi: 'nam.tran@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('DL-BMT', 1),
        MaQRVe: 'QR-VE10000020-3B',
        SoGhe: '3B',
        GiaVe: thongTinTuyen('DL-BMT').giaGoc,
        MaDiemDon: 'Bến xe Liên Tỉnh Đà Lạt',
        MaDiemTra: 'Bến xe Phía Nam Buôn Ma Thuột',
        PhuongThucThanhToan: 'the',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách đi công tác, cần xuất hóa đơn.',
        NguonDat: 'online',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('DL-NT', '09:30'),
        MaVe: 'VE10000021-1',
        MaDonHang: 'DH10000021',
        MaKhachHang: 'KH44556677',
        HoTenNguoiDi: 'Lê Thu Hương',
        SdtNguoiDi: '0981335599',
        EmailNguoiDi: 'huong.le@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('DL-NT', 1),
        MaQRVe: 'QR-VE10000021-7A',
        SoGhe: '7A',
        GiaVe: thongTinTuyen('DL-NT').giaGoc,
        MaDiemDon: 'Chợ Đà Lạt',
        MaDiemTra: 'Ga Nha Trang',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách chọn điểm đón trung tâm Đà Lạt.',
        NguonDat: 'tai-quay',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('CT-RG', '10:00'),
        MaVe: 'VE10000022-1',
        MaDonHang: 'DH10000022',
        MaKhachHang: 'KH55667788',
        HoTenNguoiDi: 'Hoàng Minh Quân',
        SdtNguoiDi: '0348995511',
        EmailNguoiDi: 'quan.hoang@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('CT-RG', 1),
        MaQRVe: 'QR-VE10000022-9A',
        SoGhe: '9A',
        GiaVe: thongTinTuyen('CT-RG').giaGoc,
        MaDiemDon: 'Bến Ninh Kiều',
        MaDiemTra: 'Bến tàu Rạch Giá',
        PhuongThucThanhToan: 'tien-mat',
        TrangThaiDonHang: 'cho-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Giữ chỗ chờ khách ra quầy thanh toán.',
        NguonDat: 'hotline',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('HCM-PT', '13:00'),
        MaVe: 'VE10000023-1',
        MaDonHang: 'DH10000023',
        MaKhachHang: 'KH66778899',
        HoTenNguoiDi: 'Phạm Thị Thúy',
        SdtNguoiDi: '0975612345',
        EmailNguoiDi: 'thuy.pham@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('HCM-PT', 1),
        MaQRVe: 'QR-VE10000023-11A',
        SoGhe: '11A',
        GiaVe: thongTinTuyen('HCM-PT').giaGoc,
        MaDiemDon: 'Ngã tư Thủ Đức',
        MaDiemTra: 'Mũi Né',
        PhuongThucThanhToan: 'the',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách có hành lý gửi khoang.',
        NguonDat: 'online',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('HCM-DL', '21:00'),
        MaVe: 'VE10000024-1',
        MaDonHang: 'DH10000024',
        MaKhachHang: 'KH77889900',
        HoTenNguoiDi: 'Vũ Hoài Lâm',
        SdtNguoiDi: '0932114477',
        EmailNguoiDi: 'lam.vu@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('HCM-DL', 1),
        MaQRVe: 'QR-VE10000024-1B',
        SoGhe: '1B',
        GiaVe: thongTinTuyen('HCM-DL').giaGoc,
        MaDiemDon: 'Bến xe Miền Tây',
        MaDiemTra: 'Quảng trường Lâm Viên',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Chuyến đêm, khách cần nhắc giờ lên xe.',
        NguonDat: 'tai-quay',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('HCM-NT', '22:15'),
        MaVe: 'VE10000025-1',
        MaDonHang: 'DH10000025',
        MaKhachHang: 'KH88990011',
        HoTenNguoiDi: 'Bùi Thị Hà',
        SdtNguoiDi: '0918776655',
        EmailNguoiDi: 'ha.bui@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('HCM-NT', 1),
        MaQRVe: 'QR-VE10000025-4B',
        SoGhe: '4B',
        GiaVe: thongTinTuyen('HCM-NT').giaGoc,
        MaDiemDon: 'Suối Tiên',
        MaDiemTra: 'Vinpearl Harbour',
        PhuongThucThanhToan: 'tien-mat',
        TrangThaiDonHang: 'cho-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách đặt trước qua tổng đài.',
        NguonDat: 'hotline',
        SoLanDaSua: 0
      },
      {
        ...thongTinChuyen('NT-DN', '23:00'),
        MaVe: 'VE10000026-1',
        MaDonHang: 'DH10000026',
        MaKhachHang: 'KH99001122',
        HoTenNguoiDi: 'Nguyễn Văn Đạt',
        SdtNguoiDi: '0909552233',
        EmailNguoiDi: 'dat.nguyen@example.com',
        SoLuongVeDaDat: 1,
        TongGiaVe: tongGiaTriDon('NT-DN', 1),
        MaQRVe: 'QR-VE10000026-8B',
        SoGhe: '8B',
        GiaVe: thongTinTuyen('NT-DN').giaGoc,
        MaDiemDon: 'Bến xe phía Nam Nha Trang',
        MaDiemTra: 'Cầu Rồng',
        PhuongThucThanhToan: 'chuyen-khoan',
        TrangThaiDonHang: 'da-thanh-toan',
        TrangThaiVe: 'cho-khoi-hanh',
        GhiChu: 'Khách cần xuống gần trung tâm Đà Nẵng.',
        NguonDat: 'online',
        SoLanDaSua: 0
      }
    ];
  }

  private todayString() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, '0');
    const dd = `${date.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

