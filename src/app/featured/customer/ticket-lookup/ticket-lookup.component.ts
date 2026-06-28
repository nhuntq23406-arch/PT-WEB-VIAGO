import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
  MaVe: string;
  SoGhe: string;
  BienSoXe: string;
  DiemDon: string;
  DiemDonThoiGian: string;
  DiemTra: string;
  DiemTraThoiGian: string;
  GiaVe: number;
  TrangThaiVe: 'Chờ thanh toán' | 'Chờ khởi hành' | 'Đã hoàn thành' | 'Đã hủy' | 'Đã đánh giá';
  MaQRVe: string;
}

interface Order {
  MaDonHang: string;
  MaKhachHang: string;
  HoTenNguoiDi: string;
  SoDienThoai: string;
  Email: string;
  ThoiGianDat: string;
  SoLuongVeDaDat: number;
  TenTuyen: string;
  GioKhoiHanh: string;
  GioTra: string;
  DepartureDate: string; // YYYY-MM-DD
  DiemDon: string;
  DiemTra: string;
  ThoiGianCoMatTruoc: string;
  GioCanCoMat: string;
  TongGiaVe: number;
  PhuongThucThanhToan: string;
  TrangThaiDonHang: 'Chờ thanh toán' | 'Chờ khởi hành' | 'Đã hoàn thành' | 'Đã hủy' | 'Đã đánh giá';
  BienSoXe: string;
  MaDiemDon: string;
  MaDiemTra: string;
  SoLanDaSua: number;
  GioiHanChinhSua: number;
  MaLichTrinh?: string;
  GioGoiYCoMat?: string;
  Tickets: Ticket[];
}

interface LocationOption {
  MaDiem: string;
  TenDiem: string;
  ThoiGian?: string;
  DiaChi?: string;
}

interface RatingCriteriaItem {
  Label: string;
  Score: number;
}

const LOCATION_OPTIONS: LocationOption[] = [
  { MaDiem: 'MD01', TenDiem: 'Bến xe Miền Đông Cũ', ThoiGian: '18:15', DiaChi: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh, TP HCM' },
  { MaDiem: 'MD02', TenDiem: 'Bến xe Giáp Bát', ThoiGian: '07:30', DiaChi: 'Km 4, Đường Giải Phóng, Hà Nội' },
  { MaDiem: 'MD03', TenDiem: 'Bến xe Gia Lâm', ThoiGian: '08:00', DiaChi: 'Số 1, Ngõ 278, Đường Nguyễn Văn Cừ, Gia Lâm' },
  { MaDiem: 'MD04', TenDiem: 'Bến xe Miền Tây', ThoiGian: '17:30', DiaChi: '395 Kinh Dương Vương, P.An Lạc, Q.Bình Tân, TP.HCM' },
  { MaDiem: 'MT01', TenDiem: 'Bến xe Hải Phòng', ThoiGian: '13:00', DiaChi: 'Đường Lê Hồng Phong, Hải Phòng' },
  { MaDiem: 'MT02', TenDiem: 'Bến xe Sài Gòn', ThoiGian: '18:30', DiaChi: 'Số 1, Phạm Hùng, Bình Chánh, TP.HCM' },
  { MaDiem: 'MT03', TenDiem: 'Bến xe Quy Nhơn', ThoiGian: '05:00', DiaChi: '71 Tây Sơn, Phường Ghềnh Ráng, Quy Nhơn, Bình Định' },
  { MaDiem: 'MT04', TenDiem: 'Bến xe Vũng Tàu', ThoiGian: '05:00', DiaChi: '192 Nam Kỳ Khởi Nghĩa, P.Thắng Tam, TP.Vũng Tàu' }
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
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  showEditModal = false;
  showCancelModal = false;
  showCancelConfirmModal = false;
  showReviewModal = false;
  showPrintModal = false;
  showShareModal = false;
  shareUrl = '';
  shareQrUrl = '';
  printTicket: Ticket | null = null;
  selectedCancelTicket: Ticket | null = null;
  showDiemDonDropdown = false;
  showDiemTraDropdown = false;
  showEditConfirmationSummary = false;

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
    { Label: 'An toàn', Score: 0 },
    { Label: 'Sạch sẽ', Score: 0 },
    { Label: 'Thái độ Nhân viên', Score: 0 },
    { Label: 'Đúng giờ', Score: 0 },
    { Label: 'Thông tin đầy đủ', Score: 0 },
    { Label: 'Tiện nghi', Score: 0 }
  ];
  quickReviewTags = ['An toàn', 'Sạch sẽ', 'Đúng giờ', 'Thông tin đầy đủ', 'Tiện nghi'];

  // Local Mock Database
  private readonly DanhSachVeMock: Order[] = [
    {
      MaDonHang: 'DH10000015',
      MaKhachHang: 'KH100234',
      HoTenNguoiDi: 'Mỹ Mỹ',
      SoDienThoai: '0900234567',
      Email: 'myan***@gmail.com',
      ThoiGianDat: '19/06/2026 14:30',
      SoLuongVeDaDat: 1,
      TenTuyen: 'Diêu Trì - Bến xe Miền Đông',
      GioKhoiHanh: '19:00',
      GioTra: '06:30',
      DepartureDate: '2026-07-02',
      DiemDon: 'Bến xe Miền Đông Cũ',
      DiemTra: 'Bến xe Miền Tây',
      ThoiGianCoMatTruoc: '15 phút',
      GioCanCoMat: '18:45',
      TongGiaVe: 380000,
      PhuongThucThanhToan: 'Chuyển khoản ngân hàng',
      TrangThaiDonHang: 'Chờ khởi hành',
      BienSoXe: '51B-123.45',
      MaDiemDon: 'MD01',
      MaDiemTra: 'MD04',
      SoLanDaSua: 0,
      GioiHanChinhSua: 2,
      MaLichTrinh: 'LT100',
      Tickets: [
        {
          MaVe: 'VE10000015-1',
          SoGhe: 'A5',
          BienSoXe: '51B-123.45',
          DiemDon: 'Bến xe Miền Đông Cũ',
          DiemDonThoiGian: '19:00 - 02/07/2026',
          DiemTra: 'Bến xe Miền Tây',
          DiemTraThoiGian: '06:30 - 03/07/2026',
          GiaVe: 380000,
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: 'QR-VE10000015-A5'
        }
      ]
    },
    {
      MaDonHang: 'DH10000016',
      MaKhachHang: 'KH100235',
      HoTenNguoiDi: 'Mỹ Mỹ',
      SoDienThoai: '0900234567',
      Email: 'myan***@gmail.com',
      ThoiGianDat: '20/06/2026 10:00',
      SoLuongVeDaDat: 1,
      TenTuyen: 'Nha Trang - Đà Lạt',
      GioKhoiHanh: '15:00',
      GioTra: '19:00',
      DepartureDate: '2026-07-03',
      DiemDon: 'Bến xe Quy Nhơn',
      DiemTra: 'Bến xe Đà Lạt',
      ThoiGianCoMatTruoc: '15 phút',
      GioCanCoMat: '14:45',
      TongGiaVe: 450000,
      PhuongThucThanhToan: 'Ví điện tử Momo',
      TrangThaiDonHang: 'Chờ khởi hành',
      BienSoXe: '79A-999.99',
      MaDiemDon: 'MT03',
      MaDiemTra: 'MT04',
      SoLanDaSua: 0,
      GioiHanChinhSua: 2,
      MaLichTrinh: 'LT101',
      Tickets: [
        {
          MaVe: 'VE10000016-1',
          SoGhe: 'B3',
          BienSoXe: '79A-999.99',
          DiemDon: 'Bến xe Quy Nhơn',
          DiemDonThoiGian: '15:00 - 03/07/2026',
          DiemTra: 'Bến xe Đà Lạt',
          DiemTraThoiGian: '19:00 - 03/07/2026',
          GiaVe: 450000,
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: 'QR-VE10000016-B3'
        }
      ]
    },
    {
      MaDonHang: 'DH10000017',
      MaKhachHang: 'KH100236',
      HoTenNguoiDi: 'Mỹ Mỹ',
      SoDienThoai: '0900234567',
      Email: 'myan***@gmail.com',
      ThoiGianDat: '18/06/2026 08:00',
      SoLuongVeDaDat: 1,
      TenTuyen: 'Diêu Trì - Bến xe Miền Đông',
      GioKhoiHanh: '08:00', // Đã khởi hành hôm qua
      GioTra: '19:30',
      DepartureDate: '2026-06-20',
      DiemDon: 'Bến xe Giáp Bát',
      DiemTra: 'Bến xe Gia Lâm',
      ThoiGianCoMatTruoc: '15 phút',
      GioCanCoMat: '07:45',
      TongGiaVe: 380000,
      PhuongThucThanhToan: 'Thẻ ATM nội địa',
      TrangThaiDonHang: 'Đã hoàn thành',
      BienSoXe: '51B-123.45',
      MaDiemDon: 'MD02',
      MaDiemTra: 'MD03',
      SoLanDaSua: 0,
      GioiHanChinhSua: 2,
      MaLichTrinh: 'LT102',
      Tickets: [
        {
          MaVe: 'VE10000017-1',
          SoGhe: 'C2',
          BienSoXe: '51B-123.45',
          DiemDon: 'Bến xe Giáp Bát',
          DiemDonThoiGian: '08:00 - 20/06/2026',
          DiemTra: 'Bến xe Gia Lâm',
          DiemTraThoiGian: '19:30 - 20/06/2026',
          GiaVe: 380000,
          TrangThaiVe: 'Đã hoàn thành',
          MaQRVe: 'QR-VE10000017-C2'
        }
      ]
    },
    {
      MaDonHang: 'DH10000018',
      MaKhachHang: 'KH100237',
      HoTenNguoiDi: 'Mỹ Mỹ',
      SoDienThoai: '0900234567',
      Email: 'myan***@gmail.com',
      ThoiGianDat: '21/06/2026 12:00',
      SoLuongVeDaDat: 3, // Đơn hàng gồm nhiều vé để test hủy từng vé
      TenTuyen: 'Nha Trang - Đà Lạt',
      GioKhoiHanh: '08:00',
      GioTra: '12:00',
      DepartureDate: '2026-07-04',
      DiemDon: 'Bến xe Hải Phòng',
      DiemTra: 'Bến xe Sài Gòn',
      ThoiGianCoMatTruoc: '15 phút',
      GioCanCoMat: '07:45',
      TongGiaVe: 1350000,
      PhuongThucThanhToan: 'Chuyển khoản ngân hàng',
      TrangThaiDonHang: 'Chờ khởi hành',
      BienSoXe: '79A-999.99',
      MaDiemDon: 'MT01',
      MaDiemTra: 'MT02',
      SoLanDaSua: 0,
      GioiHanChinhSua: 2,
      MaLichTrinh: 'LT103',
      Tickets: [
        {
          MaVe: 'VE10000018-1',
          SoGhe: 'B3',
          BienSoXe: '79A-999.99',
          DiemDon: 'Bến xe Hải Phòng',
          DiemDonThoiGian: '08:00 - 04/07/2026',
          DiemTra: 'Bến xe Sài Gòn',
          DiemTraThoiGian: '12:00 - 04/07/2026',
          GiaVe: 450000,
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: 'QR-VE10000018-B3'
        },
        {
          MaVe: 'VE10000018-2',
          SoGhe: 'B4',
          BienSoXe: '79A-999.99',
          DiemDon: 'Bến xe Hải Phòng',
          DiemDonThoiGian: '08:00 - 04/07/2026',
          DiemTra: 'Bến xe Sài Gòn',
          DiemTraThoiGian: '12:00 - 04/07/2026',
          GiaVe: 450000,
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: 'QR-VE10000018-B4'
        },
        {
          MaVe: 'VE10000018-3',
          SoGhe: 'B5',
          BienSoXe: '79A-999.99',
          DiemDon: 'Bến xe Hải Phòng',
          DiemDonThoiGian: '08:00 - 04/07/2026',
          DiemTra: 'Bến xe Sài Gòn',
          DiemTraThoiGian: '12:00 - 04/07/2026',
          GiaVe: 450000,
          TrangThaiVe: 'Đã hủy',
          MaQRVe: 'QR-VE10000018-B5'
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

  getEditTimesLabel(): string {
    if (!this.currentOrder) return '';
    const max = this.currentOrder.GioiHanChinhSua || 2;
    const used = this.currentOrder.SoLanDaSua || 0;
    return `${max - used}/2 lần chỉnh`;
  }

  get canReview(): boolean {
    if (!this.currentOrder) return false;
    return this.currentOrder.TrangThaiDonHang === 'Đã hoàn thành'
      && this.currentOrder.Tickets.length > 0
      && this.currentOrder.Tickets.every((ticket) => ticket.TrangThaiVe === 'Đã hoàn thành');
  }

  get isReviewSubmitDisabled(): boolean {
    const hasAnyScore = this.ratingCriteria.some(c => c.Score > 0);
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
    const order = this.DanhSachVeMock.find(o => o.SoDienThoai === phone && o.MaDonHang === code);
    if (order) {
      this.currentOrder = JSON.parse(JSON.stringify(order));
      this.currentStep = 'results';
    } else {
      this.searchError = 'Không tìm thấy đơn hàng nào khớp với số điện thoại và mã đã nhập!';
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
    this.showCancelConfirmModal = false;
    this.showReviewModal = false;
    this.selectedCancelTicket = null;
  }

  maskPhone(phone: string): string {
    return phone;
  }

  maskEmail(Email: string): string {
    if (!Email || !Email.includes('@')) {
      return Email;
    }
    const [name, domain] = Email.split('@');
    const maskedName = name.length <= 2 ? `${name[0]}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  }

  getStatusClasses(status: string): { [key: string]: boolean } {
    return {
      'bg-success/10 text-success': status === 'Đã hoàn thành' || status === 'Đã đánh giá',
      'bg-error/10 text-error': status === 'Đã hủy',
      'bg-primary/10 text-primary': status === 'Chờ thanh toán',
      'bg-warning/10 text-warning': status === 'Chờ khởi hành'
    };
  }

  getTicketStatusClasses(status: string): { [key: string]: boolean } {
    return {
      'bg-success/10 text-success': status === 'Đã hoàn thành' || status === 'Đã đánh giá',
      'bg-error/10 text-error': status === 'Đã hủy',
      'bg-primary/10 text-primary': status === 'Chờ thanh toán',
      'bg-warning/10 text-warning': status === 'Chờ khởi hành'
    };
  }

  getPresenceTimeLabel(): string {
    if (!this.currentOrder) {
      return '';
    }
    const gio = this.formatTimeStr(this.currentOrder.GioGoiYCoMat || this.currentOrder.GioCanCoMat);
    return `${gio} ${this.formatDisplayDate(this.currentOrder.DepartureDate)}`;
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
    return Math.max(this.getEditLimit() - (this.currentOrder.SoLanDaSua || 0), 0);
  }

  canEditOrder(): boolean {
    return this.getEditRemaining() > 0;
  }

  getHoursUntilDeparture(): number | null {
    if (!this.currentOrder || !this.currentOrder.DepartureDate || !this.currentOrder.GioKhoiHanh) {
      return null;
    }
    const departureDateTime = this.buildDepartureDate(this.currentOrder.DepartureDate, this.currentOrder.GioKhoiHanh);
    if (!departureDateTime) {
      return null;
    }
    const now = new Date();
    const diffMs = departureDateTime.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  get isEditButtonEnabled(): boolean {
    if (!this.currentOrder) return false;
    const orderStatus = this.currentOrder.TrangThaiDonHang;
    const hasEditableTicket = this.currentOrder.Tickets.some(
      ticket => ticket.TrangThaiVe === 'Chờ thanh toán' || ticket.TrangThaiVe === 'Chờ khởi hành'
    );
    const hasFinishedTicket = this.currentOrder.Tickets.some(
      ticket => ticket.TrangThaiVe === 'Đã hoàn thành' || ticket.TrangThaiVe === 'Đã đánh giá'
    );
    const canEditCount = this.getEditRemaining() > 0;
    const hoursRemaining = this.getHoursUntilDeparture();
    const hasEnoughTime = hoursRemaining !== null && hoursRemaining >= 2;

    return (orderStatus === 'Chờ thanh toán' || orderStatus === 'Chờ khởi hành') &&
      hasEditableTicket &&
      !hasFinishedTicket &&
      canEditCount &&
      hasEnoughTime;
  }

  get isEditButtonDisabled(): boolean {
    return !this.isEditButtonEnabled;
  }

  canCancelTicket(ticket: Ticket): boolean {
    if (!this.currentOrder) return false;
    const orderCanCancel = this.currentOrder.TrangThaiDonHang === 'Chờ khởi hành';
    const ticketCanCancel = ticket.TrangThaiVe === 'Chờ khởi hành';
    return orderCanCancel && ticketCanCancel && this.getRefundPercentage() > 0;
  }

  isTicketCancelDisabled(ticket: Ticket): boolean {
    return !this.canCancelTicket(ticket);
  }

  getCancelButtonTitle(ticket: Ticket): string {
    if (ticket.TrangThaiVe === 'Đã hủy') {
      return 'Vé này đã được hủy.';
    }
    if (ticket.TrangThaiVe !== 'Chờ khởi hành') {
      return 'Chỉ hủy được vé đang chờ khởi hành.';
    }
    if (this.getRefundPercentage() === 0) {
      return 'Không thể hủy vé khi chỉ còn dưới 12 giờ trước khởi hành.';
    }
    return 'Hủy riêng vé này.';
  }

  getActiveTicketCount(): number {
    return this.currentOrder?.Tickets.filter(ticket => ticket.TrangThaiVe !== 'Đã hủy').length || 0;
  }

  getCanceledTicketCount(): number {
    return this.currentOrder?.Tickets.filter(ticket => ticket.TrangThaiVe === 'Đã hủy').length || 0;
  }

  getActiveTicketTotal(): number {
    return this.currentOrder?.Tickets
      .filter(ticket => ticket.TrangThaiVe !== 'Đã hủy')
      .reduce((total, ticket) => total + ticket.GiaVe, 0) || 0;
  }

  get isReviewButtonEnabled(): boolean {
    if (!this.currentOrder) return false;
    const orderStatus = this.currentOrder.TrangThaiDonHang;
    const ticketsStatusValid = this.currentOrder.Tickets.every(
      ticket => ticket.TrangThaiVe === 'Đã hoàn thành'
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
    const departure = this.buildDepartureDate(this.currentOrder.DepartureDate, this.currentOrder.GioKhoiHanh);
    if (!departure) return 0;
    const diffHours = (departure.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (diffHours <= 0) return 0;
    if (diffHours >= 24) return 100;
    if (diffHours >= 12) return 50;
    return 0;
  }

  getSelectedCancelTicketPrice(): number {
    return this.selectedCancelTicket?.GiaVe || 0;
  }

  getRefundFee(): number {
    return this.getSelectedCancelTicketPrice() * (1 - this.getRefundPercentage() / 100);
  }

  getRefundAmount(): number {
    return this.getSelectedCancelTicketPrice() * (this.getRefundPercentage() / 100);
  }

  getQrCodeUrl(ticket: Ticket): string {
    const orderCode = this.currentOrder?.MaDonHang || 'unknown';
    const data = `${orderCode}|${ticket.MaVe}|${ticket.MaQRVe}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`;
  }

  openEditOrderModal(): void {
    if (!this.currentOrder) return;

    if (this.isEditButtonDisabled) {
      const hoursRemaining = this.getHoursUntilDeparture();
      if (hoursRemaining !== null && hoursRemaining < 2) {
        this.showToast('Bạn chỉ có thể chỉnh sửa thông tin đơn hàng khi còn ít nhất 2 tiếng trước giờ khởi hành.', 'error');
      } else {
        this.showToast('Bạn không thể chỉnh sửa thông tin đơn hàng ở trạng thái hiện tại.', 'error');
      }
      return;
    }

    this.editFullName = this.currentOrder.HoTenNguoiDi;
    this.editPhone = this.currentOrder.SoDienThoai;
    this.editEmail = this.currentOrder.Email;

    const currentDiemDonOpt = LOCATION_OPTIONS.find(l => l.MaDiem === this.currentOrder!.MaDiemDon);
    const currentDiemTraOpt = LOCATION_OPTIONS.find(l => l.MaDiem === this.currentOrder!.MaDiemTra);

    this.editDiemDonSearchText = currentDiemDonOpt ? currentDiemDonOpt.TenDiem : this.currentOrder.DiemDon;
    this.editDiemTraSearchText = currentDiemTraOpt ? currentDiemTraOpt.TenDiem : this.currentOrder.DiemTra;
    this.editMaDiemDon = this.currentOrder.MaDiemDon;
    this.editMaDiemTra = this.currentOrder.MaDiemTra;

    this.filterDiemDonOptions = [...LOCATION_OPTIONS];
    this.filterDiemTraOptions = [...LOCATION_OPTIONS];

    this.showDiemDonDropdown = false;
    this.showDiemTraDropdown = false;
    this.showEditModal = true;
  }

  closeEditOrderModal(): void {
    this.showEditModal = false;
    this.showEditConfirmationSummary = false;
    this.editFieldErrors = {};
    this.editChangeSummary = [];
    this.closeEditDropdowns();
  }

  onEditDiemDonInput(): void {
    const search = this.editDiemDonSearchText.toLowerCase().trim();
    this.filterDiemDonOptions = search
      ? LOCATION_OPTIONS.filter((item) =>
        item.TenDiem.toLowerCase().includes(search) ||
        (item.DiaChi || '').toLowerCase().includes(search)
      )
      : [...LOCATION_OPTIONS];
    this.showDiemDonDropdown = true;
  }

  onEditDiemTraInput(): void {
    const search = this.editDiemTraSearchText.toLowerCase().trim();
    this.filterDiemTraOptions = search
      ? LOCATION_OPTIONS.filter((item) =>
        item.TenDiem.toLowerCase().includes(search) ||
        (item.DiaChi || '').toLowerCase().includes(search)
      )
      : [...LOCATION_OPTIONS];
    this.showDiemTraDropdown = true;
  }

  closeEditDropdowns(): void {
    this.showDiemDonDropdown = false;
    this.showDiemTraDropdown = false;
  }

  isEditSaveDisabled(): boolean {
    if (!this.currentOrder || !this.canEditOrder()) return true;
    const hoursRemaining = this.getHoursUntilDeparture();
    if (hoursRemaining === null || hoursRemaining < 2) return true;

    const hasFullNameChanged = this.editFullName.trim() !== this.currentOrder.HoTenNguoiDi;
    const hasPhoneChanged = this.editPhone.trim() !== this.currentOrder.SoDienThoai;
    const hasEmailChanged = this.editEmail.trim() !== this.currentOrder.Email;
    const hasPickupChanged = this.editMaDiemDon !== this.currentOrder.MaDiemDon;
    const hasDropoffChanged = this.editMaDiemTra !== this.currentOrder.MaDiemTra;

    return !(hasFullNameChanged || hasPhoneChanged || hasEmailChanged || hasPickupChanged || hasDropoffChanged);
  }

  private validateEditForm(): boolean {
    this.editFieldErrors = {};
    const fullName = this.editFullName.trim();
    const phone = this.editPhone.trim();
    const MaDiemDon = this.editMaDiemDon.trim();
    const MaDiemTra = this.editMaDiemTra.trim();

    if (!fullName) {
      this.editFieldErrors['HoTenNguoiDi'] = 'Họ tên người đi không được bỏ trống.';
    } else if (fullName.length < 3) {
      this.editFieldErrors['HoTenNguoiDi'] = 'Họ tên phải có ít nhất 3 ký tự.';
    }

    if (!phone) {
      this.editFieldErrors['SoDienThoai'] = 'Số điện thoại không được bỏ trống.';
    } else if (!/^0\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
      this.editFieldErrors['SoDienThoai'] = 'Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số bắt đầu từ 0.';
    }

    if (!MaDiemDon) {
      this.editFieldErrors['MaDiemDon'] = 'Vui lòng chọn điểm đón.';
    }
    if (!MaDiemTra) {
      this.editFieldErrors['MaDiemTra'] = 'Vui lòng chọn điểm trả.';
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

    if (this.editFullName.trim() !== this.currentOrder.HoTenNguoiDi) {
      this.editChangeSummary.push({
        field: 'Họ tên người đi',
        oldValue: this.currentOrder.HoTenNguoiDi,
        newValue: this.editFullName.trim()
      });
    }

    if (this.editPhone.trim() !== this.currentOrder.SoDienThoai) {
      this.editChangeSummary.push({
        field: 'Số điện thoại',
        oldValue: this.currentOrder.SoDienThoai,
        newValue: this.editPhone.trim()
      });
    }

    if (this.editEmail.trim() !== this.currentOrder.Email) {
      this.editChangeSummary.push({
        field: 'Email',
        oldValue: this.currentOrder.Email,
        newValue: this.editEmail.trim()
      });
    }

    const oldDiemDon = LOCATION_OPTIONS.find(d => d.MaDiem === this.currentOrder?.MaDiemDon)?.TenDiem || this.currentOrder?.DiemDon || 'N/A';
    const newDiemDon = LOCATION_OPTIONS.find(d => d.MaDiem === this.editMaDiemDon)?.TenDiem || '';
    if (this.editMaDiemDon !== this.currentOrder.MaDiemDon) {
      this.editChangeSummary.push({
        field: 'Điểm đón',
        oldValue: oldDiemDon,
        newValue: newDiemDon
      });
    }

    const oldDiemTra = LOCATION_OPTIONS.find(d => d.MaDiem === this.currentOrder?.MaDiemTra)?.TenDiem || this.currentOrder?.DiemTra || 'N/A';
    const newDiemTra = LOCATION_OPTIONS.find(d => d.MaDiem === this.editMaDiemTra)?.TenDiem || '';
    if (this.editMaDiemTra !== this.currentOrder.MaDiemTra) {
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
    this.closeEditDropdowns();
    if (!this.validateEditForm()) return;
    if (!this.buildEditChangeSummary()) {
      this.showToast('Không có thay đổi nào để lưu.', 'error');
      return;
    }

    this.showEditConfirmationSummary = true;
    this.cdr.detectChanges();
  }

  closeEditConfirmationSummary(): void {
    this.showEditConfirmationSummary = false;
  }

  confirmAndSaveEdit(): void {
    this.proceedWithSaveAfterValidation();
  }

  proceedWithSaveAfterValidation(): void {
    if (!this.currentOrder || this.isEditSaveDisabled()) return;

    const orderCode = this.currentOrder.MaDonHang;
    this.isLoading = true;

    // Simulate API update call
    setTimeout(() => {
      this.ngZone.run(() => {
        const dbOrder = this.DanhSachVeMock.find(o => o.MaDonHang === orderCode);
        if (dbOrder) {
          dbOrder.HoTenNguoiDi = this.editFullName.trim();
          dbOrder.SoDienThoai = this.editPhone.trim();
          dbOrder.Email = this.editEmail.trim();

          const selectedDiemDonOpt = LOCATION_OPTIONS.find(l => l.MaDiem === this.editMaDiemDon);
          const selectedDiemTraOpt = LOCATION_OPTIONS.find(l => l.MaDiem === this.editMaDiemTra);

          dbOrder.DiemDon = selectedDiemDonOpt ? selectedDiemDonOpt.TenDiem : this.editDiemDonSearchText;
          dbOrder.DiemTra = selectedDiemTraOpt ? selectedDiemTraOpt.TenDiem : this.editDiemTraSearchText;
          dbOrder.MaDiemDon = this.editMaDiemDon;
          dbOrder.MaDiemTra = this.editMaDiemTra;
          dbOrder.SoLanDaSua++;

          // Update Tickets within the order too
          dbOrder.Tickets.forEach(ticket => {
            ticket.DiemDon = dbOrder.DiemDon;
            ticket.DiemTra = dbOrder.DiemTra;
          });

          this.currentOrder = JSON.parse(JSON.stringify(dbOrder));
        }

        this.showEditConfirmationSummary = false;
        this.showEditModal = false;
        this.isLoading = false;
        this.cdr.detectChanges();

        if (dbOrder) {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.showToast('Cập nhật thông tin đơn hàng thành công.', 'success');
            });
          }, 0);
        }
      });
    }, 200);
  }

  closeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toastMessage = '';
  }

  openCancelModal(ticket: Ticket): void {
    if (!this.currentOrder) return;
    if (this.isTicketCancelDisabled(ticket)) {
      this.showToast(this.getCancelButtonTitle(ticket), 'error');
      return;
    }

    this.selectedCancelTicket = ticket;
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
    this.selectedCancelTicket = null;
  }

  openCancelConfirmModal(): void {
    if (!this.selectedCancelTicket) return;
    this.showCancelConfirmModal = true;
  }

  closeCancelConfirmModal(): void {
    this.showCancelConfirmModal = false;
  }

  confirmCancelTicket(): void {
    if (!this.currentOrder || !this.selectedCancelTicket) return;

    if (!this.selectedCancelReason.trim()) {
      this.showToast('Vui lòng chọn lý do hủy vé.', 'error');
      return;
    }

    if (this.getRefundPercentage() === 0) {
      this.showToast('Không thể hủy vé khi chỉ còn dưới 12 giờ trước khởi hành.', 'error');
      return;
    }

    this.isLoading = true;
    const orderCode = this.currentOrder.MaDonHang;
    const ticketCode = this.selectedCancelTicket.MaVe;

    setTimeout(() => {
      this.ngZone.run(() => {
        const dbOrder = this.DanhSachVeMock.find(o => o.MaDonHang === orderCode);
        if (dbOrder) {
          const dbTicket = dbOrder.Tickets.find(ticket => ticket.MaVe === ticketCode);
          if (dbTicket) {
            dbTicket.TrangThaiVe = 'Đã hủy';
          }
          this.syncOrderStatusAfterTicketCancel(dbOrder);
          this.currentOrder = JSON.parse(JSON.stringify(dbOrder));
        }
        this.showCancelModal = false;
        this.showCancelConfirmModal = false;
        this.selectedCancelTicket = null;
        this.isLoading = false;
        this.showToast('Hủy vé thành công.', 'success');
      });
    }, 200);
  }

  private syncOrderStatusAfterTicketCancel(order: Order): void {
    const allCanceled = order.Tickets.every(ticket => ticket.TrangThaiVe === 'Đã hủy');
    if (allCanceled) {
      order.TrangThaiDonHang = 'Đã hủy';
    }
  }

  openReviewModal(): void {
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewComment = '';
    this.reviewFiles = [];
    this.reviewFieldError = '';
    this.ratingCriteria.forEach(c => c.Score = 0);
  }

  setRating(index: number, Score: number): void {
    this.ratingCriteria[index].Score = Score;
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
        const dbOrder = this.DanhSachVeMock.find(o => o.MaDonHang === this.currentOrder!.MaDonHang);
        if (dbOrder) {
          dbOrder.TrangThaiDonHang = 'Đã đánh giá';
          dbOrder.Tickets.forEach(ticket => {
            ticket.TrangThaiVe = 'Đã đánh giá';
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
    this.editMaDiemDon = option.MaDiem;
    this.editDiemDonSearchText = option.TenDiem;
    this.showDiemDonDropdown = false;
    this.filterDiemDonOptions = [option];
  }

  selectDiemTra(option: LocationOption): void {
    this.editMaDiemTra = option.MaDiem;
    this.editDiemTraSearchText = option.TenDiem;
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
    return `https://www.booking.com/searchresults.vi.html?ss=${encodeURIComponent(this.currentOrder.DiemTra)}`;
  }

  shareJourneyLink(): void {
    if (!this.currentOrder) return;
    this.shareUrl = `${window.location.origin}${window.location.pathname}?phone=${this.currentOrder.SoDienThoai}&code=${this.currentOrder.MaDonHang}`;
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
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toastMessage = '';
    this.toastType = type;
    this.toastMessage = message;
    this.cdr.detectChanges();

    this.toastTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.closeToast();
      });
    }, 3000);
  }
}

