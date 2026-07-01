import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LichTrinh {
  id: number;
  routeName: string; // Tuyến đường
  startPoint: string;
  endPoint: string;
  licensePlate: string; // Biển số xe
  carName: string; // Tên xe
  driverName: string; // Tài xế
  codriverName: string; // Phụ xe
  departureDate: string; // Ngày khởi hành
  departureTime: string; // Giờ khởi hành
  duration: string; // Thời gian đi
  status: 'running' | 'waiting' | 'completed' | 'locked'; // Trạng thái
  seatsCount: number; // Số chỗ
  price: number;
}

export interface RouteDetail {
  name: string;
  startPoint: string;
  endPoint: string;
  duration: string;
  price: number;
  pickupPoints: string[];
  stops: string[];
}

@Component({
  selector: 'app-lich-trinh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lich-trinh.html',
  styleUrls: ['./lich-trinh.css']
})
export class QuanLyLichTrinhComponent implements OnInit {
  activeTab: 'all' | 'running' | 'waiting' | 'completed' | 'locked' = 'all';
  routeFilter = '';
  searchQuery = '';
  sortBy = 'default';

  // Date strip filter
  selectedDateFilter = '';
  dateStripDays: { label: string; dateStr: string; dayNum: string; monthStr: string }[] = [];

  // Route filters
  startPointFilter = '';
  endPointFilter = '';
  startPointsList: string[] = [];
  endPointsList: string[] = [];

  // Month filter
  selectedMonthFilter = '';

  // Dynamic filter lists
  routesList: string[] = [];
  allTrips: LichTrinh[] = [];
  baseFilteredTrips: LichTrinh[] = [];
  filteredTrips: LichTrinh[] = [];
  paginatedTrips: LichTrinh[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Modal control
  isModalOpen = false;
  modalActiveTab: 'setup-car' | 'setup-time' = 'setup-car';
  isEditMode = false;
  currentTrip: Partial<LichTrinh> = {};
  errors: { [key: string]: boolean } = {};

  // Form options
  routesDb: RouteDetail[] = [
    { name: 'TP.HCM ↔ Cần Thơ', startPoint: 'TP.HCM', endPoint: 'Cần Thơ', duration: '3.5 tiếng', price: 180000, pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Bến xe Trung tâm Cần Thơ'], stops: ['Trung Lương', 'Vĩnh Long'] },
    { name: 'TP.HCM ↔ Vũng Tàu', startPoint: 'TP.HCM', endPoint: 'Bà Rịa - Vũng Tàu', duration: '2 tiếng', price: 160000, pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Vũng Tàu'], stops: ['Long Thành', 'Bà Rịa'] },
    { name: 'Đà Lạt ↔ Buôn Ma Thuột', startPoint: 'Lâm Đồng', endPoint: 'Đắk Lắk', duration: '5 tiếng', price: 220000, pickupPoints: ['Bến xe Liên Tỉnh Đà Lạt', 'Bến xe Phía Nam Buôn Ma Thuột'], stops: ['Liên Khương', 'Krông Pắc'] },
    { name: 'Đà Lạt ↔ Nha Trang', startPoint: 'Lâm Đồng', endPoint: 'Khánh Hòa', duration: '3 tiếng', price: 170000, pickupPoints: ['Bến xe Liên Tỉnh Đà Lạt', 'Bến xe phía Nam Nha Trang'], stops: ['Khánh Vĩnh'] },
    { name: 'Cần Thơ ↔ Rạch Giá', startPoint: 'Cần Thơ', endPoint: 'Kiên Giang', duration: '2.5 tiếng', price: 150000, pickupPoints: ['Bến xe Trung tâm Cần Thơ', 'Bến xe Rạch Giá'], stops: ['Thốt Nốt', 'Long Xuyên'] },
    { name: 'TP.HCM ↔ Phan Thiết', startPoint: 'TP.HCM', endPoint: 'Bình Thuận', duration: '4 tiếng', price: 200000, pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Phan Thiết'], stops: ['Long Thành', 'Dầu Giây'] },
    { name: 'TP.HCM ↔ Đà Lạt', startPoint: 'TP.HCM', endPoint: 'Lâm Đồng', duration: '7 tiếng', price: 250000, pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Liên Tỉnh Đà Lạt'], stops: ['Dầu Giây', 'Bảo Lộc', 'Di Linh'] },
    { name: 'TP.HCM ↔ Nha Trang', startPoint: 'TP.HCM', endPoint: 'Khánh Hòa', duration: '8.5 tiếng', price: 300000, pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe phía Nam Nha Trang'], stops: ['Dầu Giây', 'Phan Thiết', 'Cam Ranh'] },
    { name: 'Nha Trang ↔ Đà Nẵng', startPoint: 'Khánh Hòa', endPoint: 'Đà Nẵng', duration: '11 tiếng', price: 350000, pickupPoints: ['Bến xe phía Nam Nha Trang', 'Bến xe Trung tâm Đà Nẵng'], stops: ['Cam Ranh', 'Quy Nhơn', 'Quảng Ngãi'] }
  ];

  driversList = [
    'Trần Hoàng Long', 'Nguyễn Văn Nam', 'Lê Hoàng Hải', 'Phạm Minh Đức', 'Bùi Công Danh',
    'Nguyễn Tiến Dũng', 'Phạm Thanh Sơn', 'Lê Minh Tuấn', 'Vũ Quốc Khánh', 'Đỗ Anh Đức',
    'Hoàng Văn Thái', 'Nguyễn Mạnh Hùng', 'Phan Thanh Hải', 'Bùi Xuân Trường', 'Trần Hữu Khang',
    'Đặng Hoàng Gia', 'Lý Huỳnh Đức', 'Trần Minh Quân', 'Nguyễn Tấn Đạt', 'Lê Hồng Phong'
  ];
  codriversList = [
    'Lê Thế Hùng', 'Nguyễn Đức Minh', 'Đỗ Hoàng Sơn', 'Vũ Gia Bảo',
    'Phạm Công Thành', 'Nguyễn Hữu Thọ', 'Trần Văn Kiệt', 'Bùi Tiến Dũng'
  ];
  carsList = ['Limousine 1', 'Limousine 2', 'Limousine 3', 'Giường nằm 1', 'Cabin VIP'];
  platesDb: { [key: string]: { plate: string; seats: number } } = {
    'Limousine 1': { plate: '77B-09842', seats: 22 },
    'Limousine 2': { plate: '77B-08021', seats: 22 },
    'Limousine 3': { plate: '77B-02082', seats: 22 },
    'Giường nằm 1': { plate: '77B-05114', seats: 36 },
    'Cabin VIP': { plate: '77B-09999', seats: 24 }
  };

  // Seat lists
  lowerSeats: string[] = [];
  upperSeats: string[] = [];

  // Setup time page values
  openDaysBefore = 10;
  closeMinutesBefore = 30;
  holdMinutes = 15;
  selectedPickups: string[] = [];
  selectedStops: string[] = [];

  // Toast systems
  toasts: { id: number; message: string; type: 'success' | 'error' }[] = [];
  toastCounter = 0;
  showCenteredToast = false;
  centeredToastTitle = '';
  centeredToastSubtitle = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initMockData();
    this.extractRoutesList();
    this.initDateStrip();
    this.extractPointsList();
    this.filterTrips();
    this.generateSeatMap(22);
  }

  extractPointsList() {
    this.startPointsList = Array.from(new Set(this.routesDb.map(r => r.startPoint)));
    this.endPointsList = Array.from(new Set(this.routesDb.map(r => r.endPoint)));
  }

  initDateStrip() {
    this.dateStripDays = [
      { label: 'Th 5', dateStr: '2026-06-25', dayNum: '25', monthStr: 'T06' },
      { label: 'Th 6', dateStr: '2026-06-26', dayNum: '26', monthStr: 'T06' },
      { label: 'T 7', dateStr: '2026-06-27', dayNum: '27', monthStr: 'T06' },
      { label: 'CN', dateStr: '2026-06-28', dayNum: '28', monthStr: 'T06' },
      { label: 'Th 2', dateStr: '2026-06-29', dayNum: '29', monthStr: 'T06' },
      { label: 'Th 3', dateStr: '2026-06-30', dayNum: '30', monthStr: 'T06' },
      { label: 'Th 4', dateStr: '2026-07-01', dayNum: '01', monthStr: 'T07' }
    ];
  }

  initMockData() {
    this.allTrips = [];
    const routes = this.routesDb;
    const cars = this.carsList;
    const drivers = this.driversList;
    const codrivers = this.codriversList;
    
    // Generate dates from 2026-06-01 to 2026-07-15 (45 days)
    const dates: string[] = [];
    const start = new Date('2026-06-01');
    const end = new Date('2026-07-15');
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().substring(0, 10));
    }
    
    const times = ['05:00', '09:00', '13:30', '17:45', '21:00'];
    let id = 1;
    
    dates.forEach((date, dateIdx) => {
      times.forEach((time, timeIdx) => {
        const route = routes[(dateIdx * 3 + timeIdx) % routes.length];
        const car = cars[(timeIdx * 2) % cars.length];
        const driver = drivers[(dateIdx * 4 + timeIdx) % drivers.length];
        const codriver = codrivers[(dateIdx * 2 + timeIdx) % codrivers.length];
        const plate = this.platesDb[car].plate;
        const seats = this.platesDb[car].seats;

        // Determine status realistically relative to local current time (2026-06-29)
        let status: 'running' | 'waiting' | 'completed' | 'locked' = 'waiting';
        if (date < '2026-06-29') {
          status = 'completed';
        } else if (date === '2026-06-29') {
          status = 'running';
        } else {
          status = (id % 15 === 0) ? 'locked' : 'waiting';
        }

        this.allTrips.push({
          id,
          routeName: route.name,
          startPoint: route.startPoint,
          endPoint: route.endPoint,
          licensePlate: plate,
          carName: car,
          driverName: driver,
          codriverName: codriver,
          departureDate: date,
          departureTime: time,
          duration: route.duration,
          status,
          seatsCount: seats,
          price: route.price
        });
        id++;
      });
    });
  }

  extractRoutesList() {
    this.routesList = this.routesDb.map(r => r.name);
  }

  setTab(tab: 'all' | 'running' | 'waiting' | 'completed' | 'locked') {
    this.activeTab = tab;
    this.filterTrips();
  }

  filterTrips() {
    // 1. Get base list filtered by everything EXCEPT the active status tab
    this.baseFilteredTrips = this.allTrips.filter(t => {
      // Route dropdown filter
      if (this.routeFilter && t.routeName !== this.routeFilter) return false;

      // Date filter
      if (this.selectedDateFilter && t.departureDate !== this.selectedDateFilter) return false;

      // Departure (startPoint) filter
      if (this.startPointFilter && t.startPoint !== this.startPointFilter) return false;

      // Destination (endPoint) filter
      if (this.endPointFilter && t.endPoint !== this.endPointFilter) return false;

      // Month filter
      if (this.selectedMonthFilter && !t.departureDate.startsWith(this.selectedMonthFilter)) return false;

      // Search Query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesRoute = t.routeName.toLowerCase().includes(query);
        const matchesPlate = t.licensePlate.toLowerCase().includes(query);
        const matchesDriver = t.driverName.toLowerCase().includes(query);
        const matchesCar = t.carName.toLowerCase().includes(query);
        if (!matchesRoute && !matchesPlate && !matchesDriver && !matchesCar) return false;
      }

      return true;
    });

    // 2. Further filter the list for display based on activeTab
    this.filteredTrips = this.baseFilteredTrips.filter(t => {
      if (this.activeTab !== 'all' && t.status !== this.activeTab) return false;
      return true;
    });

    // Apply Sorting
    if (this.sortBy === 'time-asc') {
      this.filteredTrips.sort((a, b) => (a.departureDate + ' ' + a.departureTime).localeCompare(b.departureDate + ' ' + b.departureTime));
    } else if (this.sortBy === 'time-desc') {
      this.filteredTrips.sort((a, b) => (b.departureDate + ' ' + b.departureTime).localeCompare(a.departureDate + ' ' + a.departureTime));
    } else if (this.sortBy === 'price-asc') {
      this.filteredTrips.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      this.filteredTrips.sort((a, b) => b.price - a.price);
    }

    this.currentPage = 1;
    this.updatePaginatedTrips();
  }

  updatePaginatedTrips() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredTrips.length / this.pageSize));
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedTrips = this.filteredTrips.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTrips();
    }
  }

  getPaginationItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 6) {
      const pages = [];
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total - 2, total - 1, total];
    } else if (current >= total - 2) {
      return [1, 2, 3, '...', total - 3, total - 2, total - 1, total];
    } else {
      return [1, '...', current - 1, current, current + 1, '...', total];
    }
  }

  onMonthChange() {
    if (this.selectedMonthFilter === '2026-07') {
      this.dateStripDays = [
        { label: 'Th 4', dateStr: '2026-07-01', dayNum: '01', monthStr: 'T07' },
        { label: 'Th 5', dateStr: '2026-07-02', dayNum: '02', monthStr: 'T07' },
        { label: 'Th 6', dateStr: '2026-07-03', dayNum: '03', monthStr: 'T07' },
        { label: 'T 7', dateStr: '2026-07-04', dayNum: '04', monthStr: 'T07' },
        { label: 'CN', dateStr: '2026-07-05', dayNum: '05', monthStr: 'T07' },
        { label: 'Th 2', dateStr: '2026-07-06', dayNum: '06', monthStr: 'T07' },
        { label: 'Th 3', dateStr: '2026-07-07', dayNum: '07', monthStr: 'T07' }
      ];
    } else {
      this.initDateStrip();
    }
    this.selectedDateFilter = '';
    this.filterTrips();
  }

  selectDate(dateStr: string) {
    this.selectedDateFilter = dateStr;
    this.filterTrips();
  }

  clearRouteFilters() {
    this.selectedDateFilter = '';
    this.startPointFilter = '';
    this.endPointFilter = '';
    this.filterTrips();
  }

  clearFilters() {
    this.routeFilter = '';
    this.searchQuery = '';
    this.sortBy = 'default';
    this.selectedDateFilter = '';
    this.selectedMonthFilter = '';
    this.startPointFilter = '';
    this.endPointFilter = '';
    this.initDateStrip();
    this.filterTrips();
    this.addToast('Đã xóa tất cả bộ lọc tìm kiếm!', 'success');
  }

  // Calculate live trip progress percentage
  getTripProgress(trip: LichTrinh): number {
    if (trip.status === 'completed') return 100;
    if (trip.status === 'waiting' || trip.status === 'locked') return 0;
    if (trip.status === 'running') {
      try {
        const departure = new Date(`${trip.departureDate}T${trip.departureTime}:00`);
        const now = new Date();
        const durationHours = parseFloat(trip.duration);
        const durationMs = durationHours * 60 * 60 * 1000;
        const elapsedMs = now.getTime() - departure.getTime();
        if (elapsedMs <= 0) return 8; // just started placeholder
        if (elapsedMs >= durationMs) return 96; // almost completed
        return Math.min(Math.round((elapsedMs / durationMs) * 100), 98);
      } catch (e) {
        return 40;
      }
    }
    return 0;
  }

  // Calculate estimated total revenue from baseFilteredTrips
  getForecastedRevenue(): number {
    return this.baseFilteredTrips
      .filter(t => t.status !== 'locked')
      .reduce((sum, t) => sum + (t.price * t.seatsCount), 0);
  }

  // Calculate most booked route dynamically based on active filtered trips
  getMostBookedRoute(): string {
    if (this.baseFilteredTrips.length === 0) return 'Không có';
    const routeCounts: { [key: string]: number } = {};
    this.baseFilteredTrips.forEach(t => {
      routeCounts[t.routeName] = (routeCounts[t.routeName] || 0) + 1;
    });
    let mostBooked = '';
    let maxCount = -1;
    for (const route in routeCounts) {
      if (routeCounts[route] > maxCount) {
        maxCount = routeCounts[route];
        mostBooked = route;
      }
    }
    return mostBooked ? `${mostBooked} (${maxCount} chuyến)` : 'Không có';
  }

  // Dispatched drivers active count in baseFilteredTrips
  getDispatchedDriversCount(): number {
    const activeDrivers = new Set<string>();
    this.baseFilteredTrips.forEach(t => {
      if (t.status === 'running' || t.status === 'waiting') {
        if (t.driverName) activeDrivers.add(t.driverName);
      }
    });
    return activeDrivers.size;
  }

  // Toast notifications
  addToast(message: string, type: 'success' | 'error') {
    const id = this.toastCounter++;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.removeToast(id), 3000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  triggerCenteredToast(title: string, subtitle: string) {
    this.centeredToastTitle = title;
    this.centeredToastSubtitle = subtitle;
    this.showCenteredToast = true;
    setTimeout(() => {
      this.showCenteredToast = false;
      this.closeModal();
    }, 1800);
  }

  // Modal methods
  openAddModal() {
    this.isEditMode = false;
    this.currentTrip = {
      routeName: '',
      carName: '',
      licensePlate: '',
      driverName: '',
      codriverName: '',
      departureDate: new Date().toISOString().substring(0, 10),
      departureTime: '08:00',
      status: 'waiting',
      seatsCount: 22,
      price: 150000
    };
    this.selectedPickups = [];
    this.selectedStops = [];
    this.errors = {};
    this.modalActiveTab = 'setup-car';
    this.isModalOpen = true;
  }

  openEditModal(trip: LichTrinh, event: Event) {
    event.stopPropagation();
    this.isEditMode = true;
    this.currentTrip = JSON.parse(JSON.stringify(trip));
    this.selectedPickups = this.getRoutePickups();
    this.selectedStops = this.getRouteStops();
    this.errors = {};
    this.modalActiveTab = 'setup-car';
    this.isModalOpen = true;
    this.generateSeatMap(trip.seatsCount);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onCarChange() {
    if (this.currentTrip.carName && this.platesDb[this.currentTrip.carName]) {
      const data = this.platesDb[this.currentTrip.carName];
      this.currentTrip.licensePlate = data.plate;
      this.currentTrip.seatsCount = data.seats;
      this.generateSeatMap(data.seats);
    }
  }

  onRouteChange() {
    if (this.currentTrip.routeName) {
      const route = this.routesDb.find(r => r.name === this.currentTrip.routeName);
      if (route) {
        this.currentTrip.price = route.price;
        this.currentTrip.duration = route.duration;
        this.currentTrip.startPoint = route.startPoint;
        this.currentTrip.endPoint = route.endPoint;
        this.selectedPickups = [...route.pickupPoints];
        this.selectedStops = [...route.stops];
      }
    }
  }

  generateSeatMap(seats: number) {
    this.lowerSeats = [];
    this.upperSeats = [];
    const countPerDeck = Math.ceil(seats / 2);
    for (let i = 1; i <= countPerDeck; i++) {
      this.lowerSeats.push(`${i}A`);
    }
    for (let i = countPerDeck + 1; i <= seats; i++) {
      this.upperSeats.push(`${i - countPerDeck}B`);
    }
  }

  nextStep() {
    // Validate Step 1
    this.errors = {
      routeName: !this.currentTrip.routeName,
      carName: !this.currentTrip.carName,
      driverName: !this.currentTrip.driverName
    };

    if (Object.values(this.errors).some(Boolean)) {
      this.addToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
      return;
    }

    this.modalActiveTab = 'setup-time';
  }

  saveTrip() {
    // Validate Step 2
    if (!this.currentTrip.departureDate || !this.currentTrip.departureTime) {
      this.addToast('Vui lòng chọn ngày và giờ khởi hành!', 'error');
      return;
    }

    if (this.isEditMode) {
      const idx = this.allTrips.findIndex(t => t.id === this.currentTrip.id);
      if (idx > -1) {
        this.allTrips[idx] = this.currentTrip as LichTrinh;
      }
      this.filterTrips();
      this.triggerCenteredToast('Cập Nhật Lịch Chạy', 'Lịch trình di chuyển của xe đã được đồng bộ.');
    } else {
      const newTrip: LichTrinh = {
        ...(this.currentTrip as LichTrinh),
        id: this.allTrips.length > 0 ? Math.max(...this.allTrips.map(t => t.id)) + 1 : 1
      };
      this.allTrips.push(newTrip);
      this.filterTrips();
      this.triggerCenteredToast('Tạo Lịch Chạy Mới', 'Lịch trình đã được thêm vào bảng kế hoạch vận hành.');
    }
  }

  toggleLockStatus() {
    if (this.currentTrip.status === 'locked') {
      this.currentTrip.status = 'waiting';
      this.addToast('Đã mở khóa lịch chạy!', 'success');
    } else {
      this.currentTrip.status = 'locked';
      this.addToast('Đã khóa lịch chạy này!', 'success');
    }
  }

  getRoutePickups(): string[] {
    if (!this.currentTrip.routeName) return [];
    const route = this.routesDb.find(r => r.name === this.currentTrip.routeName);
    return route ? route.pickupPoints : [];
  }

  getRouteStops(): string[] {
    if (!this.currentTrip.routeName) return [];
    const route = this.routesDb.find(r => r.name === this.currentTrip.routeName);
    return route ? route.stops : [];
  }

  // Calculate arrival time dynamically
  getArrivalTime(): string {
    if (!this.currentTrip.departureTime || !this.currentTrip.duration) return '--:--';
    const [h, m] = this.currentTrip.departureTime.split(':').map(Number);
    const durationNum = parseFloat(this.currentTrip.duration); // Parse float from '3.5 tiếng'
    const totalMinutes = h * 60 + m + durationNum * 60;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = Math.floor(totalMinutes % 60);
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  }

  getArrivalDate(): string {
    if (!this.currentTrip.departureDate || !this.currentTrip.departureTime || !this.currentTrip.duration) return '---';
    const [h, m] = this.currentTrip.departureTime.split(':').map(Number);
    const durationNum = parseFloat(this.currentTrip.duration);
    const totalMinutes = h * 60 + m + durationNum * 60;
    const daysOffset = Math.floor(totalMinutes / 1440);
    
    const dateObj = new Date(this.currentTrip.departureDate);
    dateObj.setDate(dateObj.getDate() + daysOffset);
    return dateObj.toLocaleDateString('vi-VN');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  }

  // Tab counters helper
  getRunningCount() { return this.baseFilteredTrips.filter(t => t.status === 'running').length; }
  getWaitingCount() { return this.baseFilteredTrips.filter(t => t.status === 'waiting').length; }
  getCompletedCount() { return this.baseFilteredTrips.filter(t => t.status === 'completed').length; }
  getLockedCount() { return this.baseFilteredTrips.filter(t => t.status === 'locked').length; }
}
