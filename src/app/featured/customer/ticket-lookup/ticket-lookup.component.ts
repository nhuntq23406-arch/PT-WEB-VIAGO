import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
  maVe: string;
  soGhe: string;
  bienSoXe: string;
  diemDon: string;
  diemDonThoiGian: string;
  diemTra: string;
  diemTraThoiGian: string;
  giaVe: number;
  trangThaiVe: 'Chờ thanh toán' | 'Chờ khởi hành' | 'Đã hoàn thành' | 'Đã hủy' | 'Đã đánh giá';
  maQRVe: string;
}

interface Order {
  maDonHang: string;
  maKhachHang: string;
  hoTenNguoiDi: string;
  soDienThoai: string;
  email: string;
  thoiGianDat: string;
  soLuongVeDaDat: number;
  tenTuyen: string;
  gioKhoiHanh: string;
  gioTra: string;
  departureDate: string; // YYYY-MM-DD
  diemDon: string;
  diemTra: string;
  thoiGianCoMatTruoc: string;
  gioCanCoMat: string;
  tongGiaVe: number;
  phuongThucThanhToan: string;
  trangThaiDonHang: 'Chờ thanh toán' | 'Chờ khởi hành' | 'Đã hoàn thành' | 'Đã hủy' | 'Đã đánh giá';
  bienSoXe: string;
  maDiemDon: string;
  maDiemTra: string;
  soLanDaSua: number;
  gioiHanChinhSua: number;
  maLichTrinh?: string;
  gioGoiYCoMat?: string;
  tickets: Ticket[];
}

interface LocationOption {
  maDiem: string;
  tenDiem: string;
  thoiGian?: string;
  diaChi?: string;
}

interface RatingCriteriaItem {
  label: string;
  score: number;
}

const LOCATION_OPTIONS: LocationOption[] = [
  { maDiem: 'MD01', tenDiem: 'Bến xe Miền Đông Cũ', thoiGian: '18:15', diaChi: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh, TP HCM' },
  { maDiem: 'MD02', tenDiem: 'Bến xe Giáp Bát', thoiGian: '07:30', diaChi: 'Km 4, Đường Giải Phóng, Hà Nội' },
  { maDiem: 'MD03', tenDiem: 'Bến xe Gia Lâm', thoiGian: '08:00', diaChi: 'Số 1, Ngõ 278, Đường Nguyễn Văn Cừ, Gia Lâm' },
  { maDiem: 'MD04', tenDiem: 'Bến xe Miền Tây', thoiGian: '17:30', diaChi: '395 Kinh Dương Vương, P.An Lạc, Q.Bình Tân, TP.HCM' },
  { maDiem: 'MT01', tenDiem: 'Bến xe Hải Phòng', thoiGian: '13:00', diaChi: 'Đường Lê Hồng Phong, Hải Phòng' },
  { maDiem: 'MT02', tenDiem: 'Bến xe Sài Gòn', thoiGian: '18:30', diaChi: 'Số 1, Phạm Hùng, Bình Chánh, TP.HCM' },
  { maDiem: 'MT03', tenDiem: 'Bến xe Quy Nhơn', thoiGian: '05:00', diaChi: '71 Tây Sơn, Phường Ghềnh Ráng, Quy Nhơn, Bình Định' },
  { maDiem: 'MT04', tenDiem: 'Bến xe Vũng Tàu', thoiGian: '05:00', diaChi: '192 Nam Kỳ Khởi Nghĩa, P.Thắng Tam, TP.Vũng Tàu' }
];

@Component({
  selector: 'app-ticket-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-lookup.component.html',
  styleUrl: './ticket-lookup.component.css',
})
export class TicketLookupComponent implements OnInit {
  phoneNumber = '';
  bookingCode = '';
  isLoading = false;
  currentOrder: Order | null = null;
  searchError = '';
  currentStep: 'search' | 'results' = 'search';

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showEditModal = false;
  showCancelModal = false;
  showCancelConfirmModal = false;
  showReviewModal = false;
  showPrintModal = false;
  showShareModal = false;
  showSuccessModal = false;
  shareUrl = '';
  shareQrUrl = '';
  printTicket: Ticket | null = null;
  showDiemDonDropdown = false;
  showDiemTraDropdown = false;
  showEditConfirmationSummary = false;
  showEditConfirmationDialog = false;

  editFullName = '';
  editPhone = '';
  editEmail = '';
  editDiemDonSearchText = '';
  editDiemTraSearchText = '';
  editMaDiemDon = '';
  editMaDiemTra = '';
  editFieldErrors: Record<string, string> = {};
  editChangeSummary: Array<{ field: string; oldValue: string; newValue: string }> = [];
  selectedCancelReason = 'Tôi đổi kế hoạch';
  cancelPolicies: any[] = [];

  filterDiemDonOptions: LocationOption[] = [];
  filterDiemTraOptions: LocationOption[] = [];

  cancelReasons = [
    'Tôi đổi kế hoạch',
    'Tôi không thể tham gia',
    'Tôi gặp sự cố',
    'Lý do khác'
  ];

  reviewComment = '';
  reviewFieldError = '';
  reviewFiles: File[] = [];
  ratingCriteria: RatingCriteriaItem[] = [
    { label: 'An toàn', score: 0 },
    { label: 'Sạch sẽ', score: 0 },
    { label: 'Thái độ Nhân viên', score: 0 },
    { label: 'Đúng giờ', score: 0 },
    { label: 'Thông tin đầy đủ', score: 0 },
    { label: 'Tiện nghi', score: 0 }
  ];
  quickReviewTags = ['An toàn', 'Sạch sẽ', 'Đúng giờ', 'Thông tin đầy đủ', 'Tiện nghi'];

  // Local Mock Database
  private readonly DanhSachVeMock: Order[] = [
    {
      maDonHang: 'VE100024',
      maKhachHang: 'KH100234',
      hoTenNguoiDi: 'Mỹ Mỹ',
      soDienThoai: '0900234567',
      email: 'myan***@gmail.com',
      thoiGianDat: '19/06/2026 14:30',
      soLuongVeDaDat: 1,
      tenTuyen: 'Diêu Trì - Bến xe Miền Đông',
      gioKhoiHanh: '19:00',
      gioTra: '06:30',
      departureDate: '2026-06-28',
      diemDon: 'Bến xe Miền Đông Cũ',
      diemTra: 'Bến xe Miền Tây',
      thoiGianCoMatTruoc: '15 phút',
      gioCanCoMat: '18:45',
      tongGiaVe: 380000,
      phuongThucThanhToan: 'Chuyển khoản ngân hàng',
      trangThaiDonHang: 'Chờ khởi hành',
      bienSoXe: '51B-123.45',
      maDiemDon: 'MD01',
      maDiemTra: 'MD04',
      soLanDaSua: 0,
      gioiHanChinhSua: 2,
      maLichTrinh: 'LT100',
      tickets: [
        {
          maVe: 'VE100024-1',
          soGhe: 'A5',
          bienSoXe: '51B-123.45',
          diemDon: 'Bến xe Miền Đông Cũ',
          diemDonThoiGian: '19:00 - 28/06/2026',
          diemTra: 'Bến xe Miền Tây',
          diemTraThoiGian: '06:30 - 29/06/2026',
          giaVe: 380000,
          trangThaiVe: 'Chờ khởi hành',
          maQRVe: 'QR-VE100024-1'
        }
      ]
    },
    {
      maDonHang: 'VE100025',
      maKhachHang: 'KH100235',
      hoTenNguoiDi: 'Mỹ Mỹ',
      soDienThoai: '0900234567',
      email: 'myan***@gmail.com',
      thoiGianDat: '20/06/2026 10:00',
      soLuongVeDaDat: 1,
      tenTuyen: 'Nha Trang - Đà Lạt',
      gioKhoiHanh: '15:00', // Sát giờ (< 2 tiếng)
      gioTra: '19:00',
      departureDate: '2026-06-21',
      diemDon: 'Bến xe Quy Nhơn',
      diemTra: 'Bến xe Đà Lạt',
      thoiGianCoMatTruoc: '15 phút',
      gioCanCoMat: '14:45',
      tongGiaVe: 450000,
      phuongThucThanhToan: 'Ví điện tử Momo',
      trangThaiDonHang: 'Chờ khởi hành',
      bienSoXe: '79A-999.99',
      maDiemDon: 'MT03',
      maDiemTra: 'MT04',
      soLanDaSua: 0,
      gioiHanChinhSua: 2,
      maLichTrinh: 'LT101',
      tickets: [
        {
          maVe: 'VE100025-1',
          soGhe: 'B3',
          bienSoXe: '79A-999.99',
          diemDon: 'Bến xe Quy Nhơn',
          diemDonThoiGian: '15:00 - 21/06/2026',
          diemTra: 'Bến xe Đà Lạt',
          diemTraThoiGian: '19:00 - 21/06/2026',
          giaVe: 450000,
          trangThaiVe: 'Chờ khởi hành',
          maQRVe: 'QR-VE100025-1'
        }
      ]
    },
    {
      maDonHang: 'VE100026',
      maKhachHang: 'KH100236',
      hoTenNguoiDi: 'Mỹ Mỹ',
      soDienThoai: '0900234567',
      email: 'myan***@gmail.com',
      thoiGianDat: '18/06/2026 08:00',
      soLuongVeDaDat: 1,
      tenTuyen: 'Diêu Trì - Bến xe Miền Đông',
      gioKhoiHanh: '08:00', // Đã khởi hành hôm qua
      gioTra: '19:30',
      departureDate: '2026-06-20',
      diemDon: 'Bến xe Giáp Bát',
      diemTra: 'Bến xe Gia Lâm',
      thoiGianCoMatTruoc: '15 phút',
      gioCanCoMat: '07:45',
      tongGiaVe: 380000,
      phuongThucThanhToan: 'Thẻ ATM nội địa',
      trangThaiDonHang: 'Đã hoàn thành',
      bienSoXe: '51B-123.45',
      maDiemDon: 'MD02',
      maDiemTra: 'MD03',
      soLanDaSua: 0,
      gioiHanChinhSua: 2,
      maLichTrinh: 'LT102',
      tickets: [
        {
          maVe: 'VE100026-1',
          soGhe: 'C2',
          bienSoXe: '51B-123.45',
          diemDon: 'Bến xe Giáp Bát',
          diemDonThoiGian: '08:00 - 20/06/2026',
          diemTra: 'Bến xe Gia Lâm',
          diemTraThoiGian: '19:30 - 20/06/2026',
          giaVe: 380000,
          trangThaiVe: 'Đã hoàn thành',
          maQRVe: 'QR-VE100026-1'
        }
      ]
    },
    {
      maDonHang: 'DH10000018',
      maKhachHang: 'KH100237',
      hoTenNguoiDi: 'Mỹ Mỹ',
      soDienThoai: '0900234567',
      email: 'myan***@gmail.com',
      thoiGianDat: '21/06/2026 12:00',
      soLuongVeDaDat: 2, // Đơn hàng gồm 2 vé
      tenTuyen: 'Nha Trang - Đà Lạt',
      gioKhoiHanh: '08:00',
      gioTra: '12:00',
      departureDate: '2026-06-25',
      diemDon: 'Bến xe Hải Phòng',
      diemTra: 'Bến xe Sài Gòn',
      thoiGianCoMatTruoc: '15 phút',
      gioCanCoMat: '07:45',
      tongGiaVe: 900000,
      phuongThucThanhToan: 'Chuyển khoản ngân hàng',
      trangThaiDonHang: 'Chờ khởi hành',
      bienSoXe: '79A-999.99',
      maDiemDon: 'MT01',
      maDiemTra: 'MT02',
      soLanDaSua: 0,
      gioiHanChinhSua: 2,
      maLichTrinh: 'LT103',
      tickets: [
        {
          maVe: 'DH10000018-1',
          soGhe: 'B3',
          bienSoXe: '79A-999.99',
          diemDon: 'Bến xe Hải Phòng',
          diemDonThoiGian: '08:00 - 25/06/2026',
          diemTra: 'Bến xe Sài Gòn',
          diemTraThoiGian: '12:00 - 25/06/2026',
          giaVe: 450000,
          trangThaiVe: 'Chờ khởi hành',
          maQRVe: 'QR-DH10000018-1'
        },
        {
          maVe: 'DH10000018-2',
          soGhe: 'B4',
          bienSoXe: '79A-999.99',
          diemDon: 'Bến xe Hải Phòng',
          diemDonThoiGian: '08:00 - 25/06/2026',
          diemTra: 'Bến xe Sài Gòn',
          diemTraThoiGian: '12:00 - 25/06/2026',
          giaVe: 450000,
          trangThaiVe: 'Chờ khởi hành',
          maQRVe: 'QR-DH10000018-2'
        }
      ]
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const phone = params.get('phone');
    const code = params.get('code');
    if (phone && code) {
      this.phoneNumber = phone;
      this.bookingCode = code;
      this.searchTickets();
    }
  }

  onEditDiemDonBlur(event: FocusEvent) {
    setTimeout(() => { this.showDiemDonDropdown = false; }, 120);
  }

  onEditDiemTraBlur(event: FocusEvent) {
    setTimeout(() => { this.showDiemTraDropdown = false; }, 120);
  }

  isCancelDisabled(): boolean {
    if (!this.currentOrder) return true;
    return ['Đã hoàn thành', 'Đã đánh giá', 'Đã hủy'].includes(this.currentOrder.trangThaiDonHang);
  }

  getEditTimesLabel(): string {
    if (!this.currentOrder) return '';
    const max = this.currentOrder.gioiHanChinhSua || 2;
    const used = this.currentOrder.soLanDaSua || 0;
    return `${max - used}/2 lần chỉnh`;
  }

  get canReview(): boolean {
    if (!this.currentOrder) return false;
    return this.currentOrder.trangThaiDonHang === 'Đã hoàn thành'
      && this.currentOrder.tickets.length > 0
      && this.currentOrder.tickets.every((ticket) => ticket.trangThaiVe === 'Đã hoàn thành');
  }

  get isReviewSubmitDisabled(): boolean {
    const hasAnyScore = this.ratingCriteria.some(c => c.score > 0);
    return !hasAnyScore;
  }

  searchTickets(): void {
    const phone = (this.phoneNumber || '').trim();
    const code = (this.bookingCode || '').trim().toUpperCase();

    if (!phone || !code) {
      this.searchError = 'Vui lòng nhập đầy đủ số điện thoại và mã đơn hàng.';
      return;
    }

    this.isLoading = true;
    this.currentOrder = null;
    this.searchError = '';

    // Tra cứu ngay lập tức - không cần delay vì đây là mock data
    const order = this.DanhSachVeMock.find(o => o.soDienThoai === phone && o.maDonHang === code);
    if (order) {
      this.currentOrder = JSON.parse(JSON.stringify(order));
      this.currentStep = 'results';
      this.showToast('Tìm thấy thông tin vé thành công.', 'success');
    } else {
      this.searchError = 'Không tìm thấy đơn đặt vé nào khớp với thông tin cung cấp!';
      this.currentStep = 'search';
    }
    this.isLoading = false;
  }

  backToSearch(): void {
    this.currentStep = 'search';
    this.currentOrder = null;
    this.searchError = '';
    this.showEditModal = false;
    this.showCancelModal = false;
    this.showReviewModal = false;
  }

  maskPhone(phone: string): string {
    return phone;
  }

  maskEmail(email: string): string {
    if (!email || !email.includes('@')) {
      return email;
    }
    const [name, domain] = email.split('@');
    const maskedName = name.length <= 2 ? `${name[0]}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  }

  getStatusClasses(status: string): { [key: string]: boolean } {
    return {
      'bg-emerald-100 text-emerald-800': status === 'Đã hoàn thành' || status === 'Đã đánh giá',
      'bg-rose-100 text-rose-800': status === 'Đã hủy',
      'bg-blue-100 text-blue-800': status === 'Chờ thanh toán',
      'bg-amber-100 text-amber-800': status === 'Chờ khởi hành'
    };
  }

  getTicketStatusClasses(status: string): { [key: string]: boolean } {
    return {
      'bg-emerald-100 text-emerald-800': status === 'Đã hoàn thành' || status === 'Đã đánh giá',
      'bg-rose-100 text-rose-800': status === 'Đã hủy',
      'bg-blue-100 text-blue-800': status === 'Chờ thanh toán',
      'bg-amber-100 text-amber-800': status === 'Chờ khởi hành'
    };
  }

  getPresenceTimeLabel(): string {
    if (!this.currentOrder) {
      return '';
    }
    const gio = this.formatTimeStr(this.currentOrder.gioGoiYCoMat || this.currentOrder.gioCanCoMat);
    return `${gio} ${this.formatDisplayDate(this.currentOrder.departureDate)}`;
  }

  formatTimeStr(timeStr: string): string {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
    return timeStr;
  }

  getEditLimit(): number {
    return 2;
  }

  getEditRemaining(): number {
    if (!this.currentOrder) {
      return 0;
    }
    return Math.max(this.getEditLimit() - (this.currentOrder.soLanDaSua || 0), 0);
  }

  canEditOrder(): boolean {
    return this.getEditRemaining() > 0;
  }

  getHoursUntilDeparture(): number | null {
    if (!this.currentOrder || !this.currentOrder.departureDate || !this.currentOrder.gioKhoiHanh) {
      return null;
    }
    const departureDateTime = this.buildDepartureDate(this.currentOrder.departureDate, this.currentOrder.gioKhoiHanh);
    if (!departureDateTime) {
      return null;
    }
    const now = new Date();
    const diffMs = departureDateTime.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  get isEditButtonEnabled(): boolean {
    if (!this.currentOrder) return false;
    const orderStatus = this.currentOrder.trangThaiDonHang;
    const ticketsStatusValid = this.currentOrder.tickets.every(
      ticket => ticket.trangThaiVe === 'Chờ thanh toán' || ticket.trangThaiVe === 'Chờ khởi hành'
    );
    const canEditCount = this.getEditRemaining() > 0;
    const hoursRemaining = this.getHoursUntilDeparture();
    const hasEnoughTime = hoursRemaining !== null && hoursRemaining >= 2;

    return (orderStatus === 'Chờ thanh toán' || orderStatus === 'Chờ khởi hành') &&
      ticketsStatusValid &&
      canEditCount &&
      hasEnoughTime;
  }

  get isEditButtonDisabled(): boolean {
    return !this.isEditButtonEnabled;
  }

  get isCancelButtonEnabled(): boolean {
    if (!this.currentOrder) return false;
    const orderStatus = this.currentOrder.trangThaiDonHang;
    const ticketsStatusValid = this.currentOrder.tickets.every(
      ticket => ticket.trangThaiVe === 'Chờ khởi hành'
    );
    return orderStatus === 'Chờ khởi hành' && ticketsStatusValid;
  }

  get isCancelButtonDisabled(): boolean {
    return !this.isCancelButtonEnabled;
  }

  get isReviewButtonEnabled(): boolean {
    if (!this.currentOrder) return false;
    const orderStatus = this.currentOrder.trangThaiDonHang;
    const ticketsStatusValid = this.currentOrder.tickets.every(
      ticket => ticket.trangThaiVe === 'Đã hoàn thành'
    );
    return orderStatus === 'Đã hoàn thành' && ticketsStatusValid;
  }

  get isReviewButtonDisabled(): boolean {
    return !this.isReviewButtonEnabled;
  }

  formatPrice(price: number): string {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  }

  getRefundPercentage(): number {
    if (!this.currentOrder) return 0;
    const departure = this.buildDepartureDate(this.currentOrder.departureDate, this.currentOrder.gioKhoiHanh);
    if (!departure) return 0;
    const diffHours = (departure.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (diffHours <= 0) return 0;
    if (diffHours >= 24) return 100;
    if (diffHours >= 12) return 50;
    return 0;
  }

  getRefundFee(): number {
    if (!this.currentOrder) return 0;
    return this.currentOrder.tongGiaVe * (1 - this.getRefundPercentage() / 100);
  }

  getRefundAmount(): number {
    if (!this.currentOrder) return 0;
    return this.currentOrder.tongGiaVe * (this.getRefundPercentage() / 100);
  }

  getQrCodeUrl(ticket: Ticket): string {
    const orderCode = this.currentOrder?.maDonHang || 'unknown';
    const data = `${orderCode}|${ticket.maVe}|${ticket.maQRVe}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`;
  }

  openEditOrderModal(): void {
    if (!this.currentOrder) return;

    if (this.isEditButtonDisabled) {
      const hoursRemaining = this.getHoursUntilDeparture();
      if (hoursRemaining !== null && hoursRemaining < 2) {
        this.showToast('Bạn chỉ có thể chỉnh sửa vé khi còn ít nhất 2 tiếng trước giờ khởi hành.', 'error');
      } else {
        this.showToast('Bạn không thể chỉnh sửa vé ở trạng thái hiện tại.', 'error');
      }
      return;
    }

    this.editFullName = this.currentOrder.hoTenNguoiDi;
    this.editPhone = this.currentOrder.soDienThoai;
    this.editEmail = this.currentOrder.email;

    const currentDiemDonOpt = LOCATION_OPTIONS.find(l => l.maDiem === this.currentOrder!.maDiemDon);
    const currentDiemTraOpt = LOCATION_OPTIONS.find(l => l.maDiem === this.currentOrder!.maDiemTra);

    this.editDiemDonSearchText = currentDiemDonOpt ? currentDiemDonOpt.tenDiem : this.currentOrder.diemDon;
    this.editDiemTraSearchText = currentDiemTraOpt ? currentDiemTraOpt.tenDiem : this.currentOrder.diemTra;
    this.editMaDiemDon = this.currentOrder.maDiemDon;
    this.editMaDiemTra = this.currentOrder.maDiemTra;

    this.filterDiemDonOptions = [...LOCATION_OPTIONS];
    this.filterDiemTraOptions = [...LOCATION_OPTIONS];

    this.showDiemDonDropdown = false;
    this.showDiemTraDropdown = false;
    this.showEditModal = true;
  }

  closeEditOrderModal(): void {
    this.showEditModal = false;
    this.showEditConfirmationSummary = false;
    this.showEditConfirmationDialog = false;
    this.editFieldErrors = {};
    this.editChangeSummary = [];
  }

  onEditDiemDonInput(): void {
    const search = this.editDiemDonSearchText.toLowerCase().trim();
    this.filterDiemDonOptions = search
      ? LOCATION_OPTIONS.filter((item) =>
        item.tenDiem.toLowerCase().includes(search) ||
        (item.diaChi || '').toLowerCase().includes(search)
      )
      : [...LOCATION_OPTIONS];
    this.showDiemDonDropdown = true;
  }

  onEditDiemTraInput(): void {
    const search = this.editDiemTraSearchText.toLowerCase().trim();
    this.filterDiemTraOptions = search
      ? LOCATION_OPTIONS.filter((item) =>
        item.tenDiem.toLowerCase().includes(search) ||
        (item.diaChi || '').toLowerCase().includes(search)
      )
      : [...LOCATION_OPTIONS];
    this.showDiemTraDropdown = true;
  }

  isEditSaveDisabled(): boolean {
    if (!this.currentOrder || !this.canEditOrder()) return true;
    const hoursRemaining = this.getHoursUntilDeparture();
    if (hoursRemaining === null || hoursRemaining < 2) return true;

    const hasFullNameChanged = this.editFullName.trim() !== this.currentOrder.hoTenNguoiDi;
    const hasPhoneChanged = this.editPhone.trim() !== this.currentOrder.soDienThoai;
    const hasEmailChanged = this.editEmail.trim() !== this.currentOrder.email;
    const hasPickupChanged = this.editMaDiemDon !== this.currentOrder.maDiemDon;
    const hasDropoffChanged = this.editMaDiemTra !== this.currentOrder.maDiemTra;

    return !(hasFullNameChanged || hasPhoneChanged || hasEmailChanged || hasPickupChanged || hasDropoffChanged);
  }

  private validateEditForm(): boolean {
    this.editFieldErrors = {};
    const fullName = this.editFullName.trim();
    const phone = this.editPhone.trim();
    const maDiemDon = this.editMaDiemDon.trim();
    const maDiemTra = this.editMaDiemTra.trim();

    if (!fullName) {
      this.editFieldErrors['hoTenNguoiDi'] = 'Họ tên người đi không được bỏ trống.';
    } else if (fullName.length < 3) {
      this.editFieldErrors['hoTenNguoiDi'] = 'Họ tên phải có ít nhất 3 ký tự.';
    }

    if (!phone) {
      this.editFieldErrors['soDienThoai'] = 'Số điện thoại không được bỏ trống.';
    } else if (!/^0\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
      this.editFieldErrors['soDienThoai'] = 'Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số bắt đầu từ 0.';
    }

    if (!maDiemDon) {
      this.editFieldErrors['maDiemDon'] = 'Vui lòng chọn điểm đón.';
    }
    if (!maDiemTra) {
      this.editFieldErrors['maDiemTra'] = 'Vui lòng chọn điểm trả.';
    }

    if (Object.keys(this.editFieldErrors).length > 0) {
      this.cdr.detectChanges();
      return false;
    }
    return true;
  }

  private buildEditChangeSummary(): boolean {
    if (!this.currentOrder) return false;
    this.editChangeSummary = [];

    if (this.editFullName.trim() !== this.currentOrder.hoTenNguoiDi) {
      this.editChangeSummary.push({
        field: 'Họ tên người đi',
        oldValue: this.currentOrder.hoTenNguoiDi,
        newValue: this.editFullName.trim()
      });
    }

    if (this.editPhone.trim() !== this.currentOrder.soDienThoai) {
      this.editChangeSummary.push({
        field: 'Số điện thoại',
        oldValue: this.currentOrder.soDienThoai,
        newValue: this.editPhone.trim()
      });
    }

    if (this.editEmail.trim() !== this.currentOrder.email) {
      this.editChangeSummary.push({
        field: 'Email',
        oldValue: this.currentOrder.email,
        newValue: this.editEmail.trim()
      });
    }

    const oldDiemDon = LOCATION_OPTIONS.find(d => d.maDiem === this.currentOrder?.maDiemDon)?.tenDiem || this.currentOrder?.diemDon || 'N/A';
    const newDiemDon = LOCATION_OPTIONS.find(d => d.maDiem === this.editMaDiemDon)?.tenDiem || '';
    if (this.editMaDiemDon !== this.currentOrder.maDiemDon) {
      this.editChangeSummary.push({
        field: 'Điểm đón',
        oldValue: oldDiemDon,
        newValue: newDiemDon
      });
    }

    const oldDiemTra = LOCATION_OPTIONS.find(d => d.maDiem === this.currentOrder?.maDiemTra)?.tenDiem || this.currentOrder?.diemTra || 'N/A';
    const newDiemTra = LOCATION_OPTIONS.find(d => d.maDiem === this.editMaDiemTra)?.tenDiem || '';
    if (this.editMaDiemTra !== this.currentOrder.maDiemTra) {
      this.editChangeSummary.push({
        field: 'Điểm trả',
        oldValue: oldDiemTra,
        newValue: newDiemTra
      });
    }

    return this.editChangeSummary.length > 0;
  }

  saveEditChanges(): void {
    if (!this.currentOrder) return;
    if (!this.validateEditForm()) return;
    if (!this.buildEditChangeSummary()) {
      this.showToast('Không có thay đổi nào để lưu.', 'error');
      return;
    }

    this.showEditConfirmationDialog = false;
    this.showEditConfirmationSummary = true;
    this.cdr.detectChanges();
  }

  openEditConfirmationDialog(): void {
    this.showEditConfirmationSummary = false;
    this.showEditConfirmationDialog = true;
  }

  closeEditConfirmationDialog(): void {
    this.showEditConfirmationDialog = false;
    this.showEditConfirmationSummary = false;
    this.showEditModal = false;
    this.editFieldErrors = {};
    this.editChangeSummary = [];
  }

  closeEditConfirmationSummary(): void {
    this.showEditConfirmationSummary = false;
    this.showEditConfirmationDialog = false;
  }

  confirmAndSaveEdit(): void {
    this.showEditConfirmationDialog = false;
    this.showEditConfirmationSummary = false;
    this.showEditModal = false;
    this.proceedWithSaveAfterValidation();
  }

  proceedWithSaveAfterValidation(): void {
    if (!this.currentOrder || this.isEditSaveDisabled()) return;

    this.isLoading = true;

    // Simulate API update call
    setTimeout(() => {
      this.ngZone.run(() => {
        const dbOrder = this.DanhSachVeMock.find(o => o.maDonHang === this.currentOrder!.maDonHang);
        if (dbOrder) {
          dbOrder.hoTenNguoiDi = this.editFullName.trim();
          dbOrder.soDienThoai = this.editPhone.trim();
          dbOrder.email = this.editEmail.trim();

          const selectedDiemDonOpt = LOCATION_OPTIONS.find(l => l.maDiem === this.editMaDiemDon);
          const selectedDiemTraOpt = LOCATION_OPTIONS.find(l => l.maDiem === this.editMaDiemTra);

          dbOrder.diemDon = selectedDiemDonOpt ? selectedDiemDonOpt.tenDiem : this.editDiemDonSearchText;
          dbOrder.diemTra = selectedDiemTraOpt ? selectedDiemTraOpt.tenDiem : this.editDiemTraSearchText;
          dbOrder.maDiemDon = this.editMaDiemDon;
          dbOrder.maDiemTra = this.editMaDiemTra;
          dbOrder.soLanDaSua++;

          // Update tickets within the order too
          dbOrder.tickets.forEach(ticket => {
            ticket.diemDon = dbOrder.diemDon;
            ticket.diemTra = dbOrder.diemTra;
          });

          this.currentOrder = JSON.parse(JSON.stringify(dbOrder));
          this.showSuccessModal = true;
          this.showToast('Cập nhật thông tin vé thành công.', 'success');
        }

        this.showEditModal = false;
        this.isLoading = false;
      });
    }, 200);
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  openCancelModal(): void {
    if (!this.currentOrder) return;
    this.isLoading = true;

    // Tải chính sách hủy vé ngay lập tức
    this.cancelPolicies = [
      { title: 'Chính sách hoàn 100%', description: 'Hủy trước 24 giờ khởi hành: Hoàn tiền 100% giá trị vé (không tính phí).' },
      { title: 'Chính sách hoàn 50%', description: 'Hủy từ 12 - 24 giờ trước khởi hành: Hoàn tiền 50% giá trị vé.' },
      { title: 'Chính sách không hoàn', description: 'Hủy dưới 12 giờ trước khởi hành: Không áp dụng chính sách hoàn tiền.' }
    ];
    this.showCancelModal = true;
    this.isLoading = false;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.showCancelConfirmModal = false;
  }

  openCancelConfirmModal(): void {
    this.showCancelConfirmModal = true;
  }

  closeCancelConfirmModal(): void {
    this.showCancelConfirmModal = false;
  }

  confirmCancelTicket(): void {
    if (!this.currentOrder) return;

    if (!this.selectedCancelReason.trim()) {
      this.showToast('Vui lòng chọn lý do hủy vé.', 'error');
      return;
    }

    if (this.getRefundPercentage() === 0) {
      this.showToast('Không thể hủy vé khi chỉ còn dưới 12 giờ trước khởi hành.', 'error');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.ngZone.run(() => {
        const dbOrder = this.DanhSachVeMock.find(o => o.maDonHang === this.currentOrder!.maDonHang);
        if (dbOrder) {
          dbOrder.trangThaiDonHang = 'Đã hủy';
          dbOrder.tickets.forEach(ticket => {
            ticket.trangThaiVe = 'Đã hủy';
          });
          this.currentOrder = JSON.parse(JSON.stringify(dbOrder));
        }
        this.showCancelModal = false;
        this.showCancelConfirmModal = false;
        this.isLoading = false;
        this.showToast('Hủy vé thành công.', 'success');
      });
    }, 200);
  }

  openReviewModal(): void {
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewComment = '';
    this.reviewFiles = [];
    this.reviewFieldError = '';
    this.ratingCriteria.forEach(c => c.score = 0);
  }

  setRating(index: number, score: number): void {
    this.ratingCriteria[index].score = score;
  }

  addReviewTag(tag: string): void {
    if (this.reviewComment.includes(tag)) {
      this.reviewComment = this.reviewComment.replace(tag, '').replace(/\s{2,}/g, ' ').trim();
      return;
    }
    this.reviewComment = this.reviewComment ? `${this.reviewComment}, ${tag}` : tag;
  }

  onReviewFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files ? Array.from(target.files) : [];
    this.reviewFiles = [...this.reviewFiles, ...files].slice(0, 3);
    target.value = '';
  }

  removeReviewFile(index: number): void {
    this.reviewFiles = this.reviewFiles.filter((_, itemIndex) => itemIndex !== index);
  }

  submitReview(): void {
    if (!this.currentOrder || this.isReviewSubmitDisabled) return;
    if (this.reviewFieldError) {
      this.showToast('Vui lòng sửa lỗi ở ô nhận xét trước khi gửi.', 'error');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.ngZone.run(() => {
        const dbOrder = this.DanhSachVeMock.find(o => o.maDonHang === this.currentOrder!.maDonHang);
        if (dbOrder) {
          dbOrder.trangThaiDonHang = 'Đã đánh giá';
          dbOrder.tickets.forEach(ticket => {
            ticket.trangThaiVe = 'Đã đánh giá';
          });
          this.currentOrder = JSON.parse(JSON.stringify(dbOrder));
        }
        this.showReviewModal = false;
        this.reviewComment = '';
        this.reviewFiles = [];
        this.showToast('Đánh giá đã được gửi thành công.', 'success');
        this.isLoading = false;
      });
    }, 200);
  }

  openPrintModal(ticket: Ticket): void {
    this.printTicket = ticket;
    this.showPrintModal = true;
  }

  closePrintModal(): void {
    this.showPrintModal = false;
    this.printTicket = null;
  }

  doPrint(): void {
    window.print();
  }

  selectDiemDon(option: LocationOption): void {
    this.editMaDiemDon = option.maDiem;
    this.editDiemDonSearchText = option.tenDiem;
    this.showDiemDonDropdown = false;
    this.filterDiemDonOptions = [option];
  }

  selectDiemTra(option: LocationOption): void {
    this.editMaDiemTra = option.maDiem;
    this.editDiemTraSearchText = option.tenDiem;
    this.showDiemTraDropdown = false;
    this.filterDiemTraOptions = [option];
  }

  private buildDepartureDate(dateString: string, timeString: string): Date | null {
    if (!dateString || !timeString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return null;
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    }
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  getDestinationBookingLink(): string {
    if (!this.currentOrder) return 'https://www.booking.com';
    return `https://www.booking.com/searchresults.vi.html?ss=${encodeURIComponent(this.currentOrder.diemTra)}`;
  }

  shareJourneyLink(): void {
    if (!this.currentOrder) return;
    this.shareUrl = `${window.location.origin}${window.location.pathname}?phone=${this.currentOrder.soDienThoai}&code=${this.currentOrder.maDonHang}`;
    this.shareQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(this.shareUrl)}`;
    this.showShareModal = true;
  }

  copyShareUrl(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      this.showToast('Đã sao chép liên kết chia sẻ hành trình vào bộ nhớ tạm.', 'success');
    }).catch(err => {
      this.showToast('Không thể sao chép liên kết.', 'error');
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.ngZone.run(() => {
        this.toastMessage = '';
      });
    }, 2500);
  }
}

