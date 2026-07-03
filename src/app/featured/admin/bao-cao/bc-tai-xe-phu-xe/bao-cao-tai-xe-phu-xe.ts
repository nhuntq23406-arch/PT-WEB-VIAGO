import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Personnel {
  stt: number;
  maNhanSu: string;
  hoTen: string;
  ngaySinh: string;
  soDienThoai: string;
  cccd: string;
  vaiTro: string; // 'Tài xế' | 'Phụ xe'
  hangBangLai: string; // 'E' | 'D' | 'Không yêu cầu bằng lái'
  thoiHanBangLai: string; // Date string 'DD/MM/YYYY' or empty for assistant driver
  trangThai: string; // 'Đang hoạt động' | 'Đã khóa'
}

@Component({
  selector: 'app-bao-cao-tai-xe-phu-xe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bao-cao-tai-xe-phu-xe.html',
  styleUrl: './bao-cao-tai-xe-phu-xe.css'
})
export class BaoCaoTaiXePhuXeComponent implements OnInit {
  // Toàn bộ danh sách 30 nhân sự ban đầu
  allPersonnel: Personnel[] = [
    { stt: 1, maNhanSu: 'TX100001', hoTen: 'Nguyễn Văn Minh', ngaySinh: '15/03/1985', soDienThoai: '0901234567', cccd: '079085001234', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '20/08/2028', trangThai: 'Đang hoạt động' },
    { stt: 2, maNhanSu: 'TX100002', hoTen: 'Trần Quốc Huy', ngaySinh: '22/07/1988', soDienThoai: '0912345678', cccd: '079088002345', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '15/11/2026', trangThai: 'Đang hoạt động' }, // 6 tháng
    { stt: 3, maNhanSu: 'TX100003', hoTen: 'Lê Hoàng Nam', ngaySinh: '10/12/1983', soDienThoai: '0933456789', cccd: '079083003456', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '05/04/2029', trangThai: 'Đang hoạt động' },
    { stt: 4, maNhanSu: 'TX100004', hoTen: 'Phạm Đức Thành', ngaySinh: '28/01/1990', soDienThoai: '0944567890', cccd: '079090004567', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '18/09/2028', trangThai: 'Đang hoạt động' },
    { stt: 5, maNhanSu: 'TX100005', hoTen: 'Võ Thanh Tùng', ngaySinh: '07/05/1987', soDienThoai: '0965678901', cccd: '079087005678', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '30/08/2026', trangThai: 'Đang hoạt động' }, // 3 tháng
    { stt: 6, maNhanSu: 'TX100006', hoTen: 'Nguyễn Tiến Dũng', ngaySinh: '14/02/1986', soDienThoai: '0902345671', cccd: '079086006789', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '12/10/2029', trangThai: 'Đang hoạt động' },
    { stt: 7, maNhanSu: 'TX100007', hoTen: 'Hoàng Nhật Anh', ngaySinh: '19/11/1989', soDienThoai: '0913456782', cccd: '079089007890', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '25/03/2028', trangThai: 'Đang hoạt động' },
    { stt: 8, maNhanSu: 'TX100008', hoTen: 'Đỗ Mạnh Hùng', ngaySinh: '05/08/1984', soDienThoai: '0934567893', cccd: '079084008901', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '15/09/2026', trangThai: 'Đang hoạt động' }, // 3 tháng
    { stt: 9, maNhanSu: 'TX100009', hoTen: 'Ngô Chí Thành', ngaySinh: '26/04/1991', soDienThoai: '0945678904', cccd: '079091009012', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '17/01/2029', trangThai: 'Đang hoạt động' },
    { stt: 10, maNhanSu: 'TX100010', hoTen: 'Đặng Hoàng Long', ngaySinh: '31/10/1988', soDienThoai: '0966789015', cccd: '079088010123', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '10/12/2026', trangThai: 'Đang hoạt động' }, // 6 tháng
    { stt: 11, maNhanSu: 'TX100011', hoTen: 'Bùi Xuân Trường', ngaySinh: '08/12/1985', soDienThoai: '0903456712', cccd: '079085011234', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '15/07/2026', trangThai: 'Đang hoạt động' }, // Sắp hết hạn (Demo) - 30 ngày
    { stt: 12, maNhanSu: 'TX100012', hoTen: 'Dương Đình Bảo', ngaySinh: '23/06/1992', soDienThoai: '0914567823', cccd: '079092012345', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '08/02/2028', trangThai: 'Đang hoạt động' },
    { stt: 13, maNhanSu: 'TX100013', hoTen: 'Vũ Minh Triết', ngaySinh: '11/01/1984', soDienThoai: '0935678934', cccd: '079084013456', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '22/12/2026', trangThai: 'Đã khóa' },
    { stt: 14, maNhanSu: 'TX100014', hoTen: 'Phan Văn Đức', ngaySinh: '09/09/1989', soDienThoai: '0946789045', cccd: '079089014567', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '15/06/2029', trangThai: 'Đang hoạt động' },
    { stt: 15, maNhanSu: 'TX100015', hoTen: 'Đỗ Cao Cường', ngaySinh: '17/04/1986', soDienThoai: '0967890156', cccd: '079086015678', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '11/03/2028', trangThai: 'Đang hoạt động' },
    { stt: 16, maNhanSu: 'TX100016', hoTen: 'Lâm Hoàng Vĩnh', ngaySinh: '03/07/1987', soDienThoai: '0904567123', cccd: '079087016789', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '25/08/2026', trangThai: 'Đang hoạt động' }, // 3 tháng,
    { stt: 17, maNhanSu: 'TX100017', hoTen: 'Trịnh Đình Quang', ngaySinh: '29/10/1991', soDienThoai: '0915678234', cccd: '079091017890', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '14/01/2029', trangThai: 'Đang hoạt động' },
    { stt: 18, maNhanSu: 'TX100018', hoTen: 'Đinh Văn Toàn', ngaySinh: '12/05/1983', soDienThoai: '0936789345', cccd: '079083018901', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '05/09/2028', trangThai: 'Đang hoạt động' },
    { stt: 19, maNhanSu: 'TX100019', hoTen: 'Quách Công Minh', ngaySinh: '25/08/1990', soDienThoai: '0947890456', cccd: '079090019012', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '19/07/2027', trangThai: 'Đang hoạt động' },
    { stt: 20, maNhanSu: 'TX100020', hoTen: 'Phùng Khắc Chính', ngaySinh: '06/12/1985', soDienThoai: '0968901567', cccd: '079085020123', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '08/11/2029', trangThai: 'Đang hoạt động' },
    { stt: 21, maNhanSu: 'TX100021', hoTen: 'Tạ Minh Tuấn', ngaySinh: '21/02/1988', soDienThoai: '0905432109', cccd: '079088021234', vaiTro: 'Tài xế', hangBangLai: 'E', thoiHanBangLai: '13/04/2028', trangThai: 'Đang hoạt động' },
    { stt: 22, maNhanSu: 'TX100022', hoTen: 'Nguyễn Chí Thanh', ngaySinh: '18/07/1987', soDienThoai: '0916543210', cccd: '079087022345', vaiTro: 'Tài xế', hangBangLai: 'D', thoiHanBangLai: '12/07/2026', trangThai: 'Đã khóa' }, // Sắp hết hạn (Demo)
    { stt: 23, maNhanSu: 'PX200001', hoTen: 'Nguyễn Thị Hoa', ngaySinh: '12/09/1995', soDienThoai: '0976789012', cccd: '079095023456', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 24, maNhanSu: 'PX200002', hoTen: 'Bùi Văn Đức', ngaySinh: '25/11/1998', soDienThoai: '0987890123', cccd: '079098024567', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 25, maNhanSu: 'PX200003', hoTen: 'Lê Quốc Bảo', ngaySinh: '18/02/1996', soDienThoai: '0398901234', cccd: '079096025678', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 26, maNhanSu: 'PX200004', hoTen: 'Phan Gia Hưng', ngaySinh: '04/06/1999', soDienThoai: '0389012345', cccd: '079099026789', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 27, maNhanSu: 'PX200005', hoTen: 'Đặng Nhật Quang', ngaySinh: '30/08/1997', soDienThoai: '0370123456', cccd: '079097027890', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 28, maNhanSu: 'PX200006', hoTen: 'Mai Văn Nam', ngaySinh: '14/01/1996', soDienThoai: '0361234567', cccd: '079096028901', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 29, maNhanSu: 'PX200007', hoTen: 'Cao Tiến Đạt', ngaySinh: '22/10/1994', soDienThoai: '0352345678', cccd: '079094029012', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đang hoạt động' },
    { stt: 30, maNhanSu: 'PX200008', hoTen: 'Hoàng Trọng Nghĩa', ngaySinh: '05/03/2000', soDienThoai: '0343456789', cccd: '079100030123', vaiTro: 'Phụ xe', hangBangLai: 'Không yêu cầu bằng lái', thoiHanBangLai: '', trangThai: 'Đã khóa' }
  ];

  // Danh sách sau lọc
  filteredPersonnel: Personnel[] = [];
  paginatedPersonnel: Personnel[] = [];

  // Active Tab state: 'bieu-do' is active by default (showing visual analytics)
  activeTab: 'bieu-do' | 'danh-sach' = 'bieu-do';

  // Month selection for Card 5
  selectedMonth: string = 'Tháng 06/2026';
  availableMonths: string[] = [
    'Tháng 01/2026',
    'Tháng 02/2026',
    'Tháng 03/2026',
    'Tháng 04/2026',
    'Tháng 05/2026',
    'Tháng 06/2026'
  ];

  // Form Filters (Temporary values)
  filterSearchQuery: string = '';
  filterRole: string = 'Tất cả nhân sự';
  filterStatus: string = 'Tất cả trạng thái';

  // Applied Filters (Used for filtering table and charts)
  appliedSearchQuery: string = '';
  appliedRole: string = 'Tất cả nhân sự';
  appliedStatus: string = 'Tất cả trạng thái';

  // Dashboard Overview Stats (Global/Static values for the entire fleet)
  totalOperating: number = 0;
  totalDrivers: number = 0;
  totalAssistants: number = 0;
  expiringLicensesCount: number = 0;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;

  // Mock Performance Data (trips count)
  performanceData = [
    { ma: 'TX100001', ten: 'Nguyễn Văn Minh', trips: 28, label: 'Cảnh báo quá tải' },
    { ma: 'TX100002', ten: 'Trần Quốc Huy', trips: 26, label: 'Cảnh báo quá tải' },
    { ma: 'TX100003', ten: 'Lê Hoàng Nam', trips: 22, label: 'Đạt yêu cầu' },
    { ma: 'TX100004', ten: 'Phạm Đức Thành', trips: 18, label: 'Đạt yêu cầu' },
    { ma: 'TX100005', ten: 'Võ Thanh Tùng', trips: 12, label: 'Hiệu suất thấp' },
    { ma: 'TX100006', ten: 'Nguyễn Tiến Dũng', trips: 8, label: 'Hiệu suất thấp' }
  ];

  setActiveTab(tab: 'bieu-do' | 'danh-sach') {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.calculateStats();
    this.onResetFilters();
  }

  // Check if a driver's license expires in 30 days from 25/06/2026
  isLicenseExpiringSoon(p: Personnel): boolean {
    if (p.vaiTro !== 'Tài xế' || !p.thoiHanBangLai) return false;
    const parts = p.thoiHanBangLai.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const expDate = new Date(year, month, day);

    const currentDate = new Date(2026, 5, 25); // 25/06/2026
    const thirtyDaysLater = new Date(2026, 5, 25 + 30); // 25/07/2026

    return expDate <= thirtyDaysLater;
  }

  // Get list of expiring drivers based on current filtered subset
  get expiringPersonnelList(): Personnel[] {
    return this.filteredPersonnel.filter(p => this.isLicenseExpiringSoon(p));
  }

  calculateStats() {
    this.totalOperating = this.allPersonnel.length;
    this.totalDrivers = this.allPersonnel.filter(p => p.vaiTro === 'Tài xế').length;
    this.totalAssistants = this.allPersonnel.filter(p => p.vaiTro === 'Phụ xe').length;

    // Count expiring licenses globally
    this.expiringLicensesCount = this.allPersonnel.filter(p => this.isLicenseExpiringSoon(p)).length;
  }

  // Apply filters manually on click
  onApplyFilters() {
    this.appliedSearchQuery = this.filterSearchQuery;
    this.appliedRole = this.filterRole;
    this.appliedStatus = this.filterStatus;

    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allPersonnel];
    const search = this.appliedSearchQuery.trim().toLowerCase();

    // 1. Text Search
    if (search) {
      result = result.filter(p =>
        p.maNhanSu.toLowerCase().includes(search) ||
        p.hoTen.toLowerCase().includes(search) ||
        p.soDienThoai.toLowerCase().includes(search) ||
        p.cccd.toLowerCase().includes(search)
      );
    }

    // 2. Role Filter
    if (this.appliedRole !== 'Tất cả nhân sự') {
      result = result.filter(p => p.vaiTro === this.appliedRole);
    }

    // 3. Status Filter
    if (this.appliedStatus !== 'Tất cả trạng thái') {
      if (this.appliedStatus === 'Bằng lái sắp hết hạn (< 30 ngày)') {
        result = result.filter(p => this.isLicenseExpiringSoon(p));
      } else {
        result = result.filter(p => p.trangThai === this.appliedStatus);
      }
    }

    this.filteredPersonnel = result;
    this.totalPages = Math.ceil(this.filteredPersonnel.length / this.pageSize) || 1;
    this.updatePaginatedList();
  }

  onResetFilters() {
    this.filterSearchQuery = '';
    this.filterRole = 'Tất cả nhân sự';
    this.filterStatus = 'Tất cả trạng thái';

    this.appliedSearchQuery = '';
    this.appliedRole = 'Tất cả nhân sự';
    this.appliedStatus = 'Tất cả trạng thái';

    this.currentPage = 1;
    this.applyFilters();
  }

  updatePaginatedList() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredPersonnel.length);
    this.paginatedPersonnel = this.filteredPersonnel.slice(this.startIndex, this.endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Dynamic getters for chart stats (derived from currently filtered dataset)
  get filteredOperatingCount(): number {
    return this.filteredPersonnel.length;
  }

  // Getters for SVG Donut/Pie Charts (Circumference ~ 376.99)
  get driversStrokeDashArray(): string {
    const pct = this.filteredDriversPercent;
    const strokeLength = (pct / 100) * 376.9911;
    const gapLength = 376.9911 - strokeLength;
    return `${strokeLength} ${gapLength}`;
  }

  get assistantsStrokeDashArray(): string {
    const pct = this.filteredAssistantsPercent;
    const strokeLength = (pct / 100) * 376.9911;
    const gapLength = 376.9911 - strokeLength;
    return `${strokeLength} ${gapLength}`;
  }

  get assistantsStrokeDashOffset(): number {
    const pct = this.filteredDriversPercent;
    return -((pct / 100) * 376.9911);
  }

  get activeStrokeDashArray(): string {
    const pct = this.filteredActivePercent;
    const strokeLength = (pct / 100) * 376.9911;
    const gapLength = 376.9911 - strokeLength;
    return `${strokeLength} ${gapLength}`;
  }

  get lockedStrokeDashArray(): string {
    const pct = this.filteredLockedPercent;
    const strokeLength = (pct / 100) * 376.9911;
    const gapLength = 376.9911 - strokeLength;
    return `${strokeLength} ${gapLength}`;
  }

  get lockedStrokeDashOffset(): number {
    const pct = this.filteredActivePercent;
    return -((pct / 100) * 376.9911);
  }

  get filteredDriversCount(): number {
    return this.filteredPersonnel.filter(p => p.vaiTro === 'Tài xế').length;
  }

  get filteredAssistantsCount(): number {
    return this.filteredPersonnel.filter(p => p.vaiTro === 'Phụ xe').length;
  }

  get filteredDriversPercent(): number {
    if (this.filteredOperatingCount === 0) return 0;
    return Math.round((this.filteredDriversCount / this.filteredOperatingCount) * 100);
  }

  get filteredAssistantsPercent(): number {
    if (this.filteredOperatingCount === 0) return 0;
    return Math.round((this.filteredAssistantsCount / this.filteredOperatingCount) * 100);
  }

  // Card 2: Profile Status calculations
  get filteredActiveCount(): number {
    return this.filteredPersonnel.filter(p => p.trangThai === 'Đang hoạt động').length;
  }

  get filteredLockedCount(): number {
    return this.filteredPersonnel.filter(p => p.trangThai === 'Đã khóa').length;
  }

  get filteredActivePercent(): number {
    if (this.filteredOperatingCount === 0) return 0;
    return Math.round((this.filteredActiveCount / this.filteredOperatingCount) * 100);
  }

  get filteredLockedPercent(): number {
    if (this.filteredOperatingCount === 0) return 0;
    return Math.round((this.filteredLockedCount / this.filteredOperatingCount) * 100);
  }

  // Card 3: License Grade
  get filteredGradeECount(): number {
    return this.filteredPersonnel.filter(p => p.vaiTro === 'Tài xế' && p.hangBangLai === 'E').length;
  }

  get filteredGradeDCount(): number {
    return this.filteredPersonnel.filter(p => p.vaiTro === 'Tài xế' && p.hangBangLai === 'D').length;
  }

  get totalFilteredDriversForLicense(): number {
    return this.filteredPersonnel.filter(p => p.vaiTro === 'Tài xế').length;
  }

  get filteredGradeEPercent(): number {
    if (this.totalFilteredDriversForLicense === 0) return 0;
    return (this.filteredGradeECount / this.totalFilteredDriversForLicense) * 100;
  }

  get filteredGradeDPercent(): number {
    if (this.totalFilteredDriversForLicense === 0) return 0;
    return (this.filteredGradeDCount / this.totalFilteredDriversForLicense) * 100;
  }

  // Card 4: Expiring forecast helpers
  getLicenseExpiringInDaysRangeCount(startDays: number, endDays: number): number {
    const currentDate = new Date(2026, 5, 25); // 25/06/2026
    const startDate = new Date(2026, 5, 25 + startDays);
    const endDate = new Date(2026, 5, 25 + endDays);
    return this.filteredPersonnel.filter(p => {
      if (p.vaiTro !== 'Tài xế' || !p.thoiHanBangLai) return false;
      const parts = p.thoiHanBangLai.split('/');
      if (parts.length !== 3) return false;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const expDate = new Date(year, month, day);
      return expDate > startDate && expDate <= endDate;
    }).length;
  }

  get expiring30DaysCount(): number {
    return this.getLicenseExpiringInDaysRangeCount(-1, 30);
  }

  get expiring90DaysCount(): number {
    return this.getLicenseExpiringInDaysRangeCount(-1, 90);
  }

  get expiring180DaysCount(): number {
    return this.getLicenseExpiringInDaysRangeCount(90, 180);
  }

  // Card 5: Full workload performance list (Combined Drivers & Assistant Drivers)
  get combinedPerformanceList() {
    let offset = 0;
    if (this.selectedMonth === 'Tháng 05/2026') offset = -3;
    else if (this.selectedMonth === 'Tháng 04/2026') offset = -5;
    else if (this.selectedMonth === 'Tháng 03/2026') offset = 1;
    else if (this.selectedMonth === 'Tháng 02/2026') offset = -2;
    else if (this.selectedMonth === 'Tháng 01/2026') offset = -4;

    return this.filteredPersonnel.map(p => {
      let baseTrips = 15;
      if (p.maNhanSu === 'TX100001') baseTrips = 28;
      else if (p.maNhanSu === 'TX100002') baseTrips = 26;
      else if (p.maNhanSu === 'PX200001') baseTrips = 24; // Nguyễn Thị Hoa
      else if (p.maNhanSu === 'TX100003') baseTrips = 22; // Lê Hoàng Nam
      else if (p.maNhanSu === 'PX200002') baseTrips = 12; // Bùi Văn Đức
      else {
        // other drivers and assistant drivers
        if (p.vaiTro === 'Tài xế') {
          baseTrips = 10 + (p.stt % 15);
        } else {
          baseTrips = 8 + (p.stt % 10);
        }
      }

      // Constrain trips count between 0 and 30
      let trips = Math.max(0, Math.min(30, baseTrips + offset));

      let label = 'Đạt yêu cầu';
      let colorClass = 'bg-green';
      if (p.vaiTro === 'Tài xế') {
        if (trips > 25) {
          label = 'Cảnh báo quá tải';
          colorClass = 'bg-orange';
        } else if (trips < 15) {
          label = 'Hiệu suất thấp';
          colorClass = 'bg-blue-light';
        }
      } else {
        // Phụ xe
        if (trips > 22) {
          label = 'Cảnh báo quá tải';
          colorClass = 'bg-orange';
        } else if (trips < 12) {
          label = 'Hiệu suất thấp';
          colorClass = 'bg-blue-light';
        }
      }

      return {
        ma: p.maNhanSu,
        ten: p.hoTen,
        vaiTro: p.vaiTro,
        trips: trips,
        label: label,
        colorClass: colorClass
      };
    }).sort((a, b) => b.trips - a.trips);
  }

  // Backwards compatibility list
  get driverPerformanceList() {
    return this.combinedPerformanceList.filter(p => p.vaiTro === 'Tài xế');
  }

  get assistantPerformanceList() {
    return this.combinedPerformanceList.filter(p => p.vaiTro === 'Phụ xe');
  }

  // Filter performance data according to search string (left for reference if needed)
  get filteredPerformanceData() {
    const search = this.appliedSearchQuery.trim().toLowerCase();
    if (!search) return this.performanceData;
    return this.performanceData.filter(d => 
      d.ten.toLowerCase().includes(search) || 
      d.ma.toLowerCase().includes(search)
    );
  }

  onExportExcel() {
    let csvContent = '\uFEFF';
    csvContent += 'STT,Mã nhân sự,Họ và tên,Ngày sinh,Số điện thoại,CCCD,Vai trò,Bằng lái & Thời hạn,Trạng thái\n';

    this.filteredPersonnel.forEach(p => {
      const bangLaiCol = p.vaiTro === 'Tài xế'
        ? `Hạng: ${p.hangBangLai} - Hạn: ${p.thoiHanBangLai}`
        : p.hangBangLai;

      const row = [
        p.stt,
        p.maNhanSu,
        `"${p.hoTen}"`,
        p.ngaySinh,
        p.soDienThoai,
        `'${p.cccd}`,
        p.vaiTro,
        `"${bangLaiCol}"`,
        p.trangThai
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_cao_tai_xe_va_phu_xe_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printReport() {
    window.print();
  }

  exportPDF() {
    const originalTitle = document.title;
    document.title = 'Bao_cao_phan_tich_truc_quan';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }
}
