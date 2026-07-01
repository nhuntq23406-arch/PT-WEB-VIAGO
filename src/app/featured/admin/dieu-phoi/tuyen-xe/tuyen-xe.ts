import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TuyenXe {
  id: number;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  duration: string;
  tripsPerDay: number;
  price: number;
  carTypes: string;
  status: 'active' | 'locked';
  pickupPoints: string[];
  stops: string[];
  shuttles: string[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-tuyen-xe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tuyen-xe.html',
  styleUrls: ['./tuyen-xe.css']
})
export class QuanLyTuyenXeComponent implements OnInit {
  activeTab: 'all' | 'active' | 'locked' = 'all';
  searchQuery = '';
  startPointFilter = '';
  endPointFilter = '';

  // Options for dropdown filters
  startPoints: string[] = [];
  endPoints: string[] = [];

  // Route List Data based on prompt specification
  allRoutes: TuyenXe[] = [];
  filteredRoutes: TuyenXe[] = [];

  // Toast system state
  toasts: ToastMessage[] = [];
  toastIdCounter = 0;

  // Centered Modal Status (Toast) state
  showCenteredToast = false;
  centeredToastTitle = '';
  centeredToastSubtitle = '';

  // Form Modal state
  isModalOpen = false;
  isEditMode = false;
  currentRoute: Partial<TuyenXe> = {};
  errors: { [key: string]: boolean } = {};

  // Constants lists for form selects
  provincesList = [
    'TP.HCM',
    'Cần Thơ',
    'Bà Rịa - Vũng Tàu',
    'Lâm Đồng',
    'Khánh Hòa',
    'Đắk Lắk',
    'Bình Thuận',
    'Đà Nẵng',
    'Kiên Giang'
  ];

  carTypesOptions = [
    'Limousine, Cabin',
    'Limousine, Giường nằm',
    'Giường nằm',
    'Cabin, Limousine'
  ];

  // Specific location mapping for multi-select checklists in form
  pickupPointsDb: { [key: string]: string[] } = {
    'TP.HCM': ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
    'Cần Thơ': ['Bến xe Trung tâm Cần Thơ', 'Văn phòng Ninh Kiều', 'Bến Ninh Kiều', 'Đại học Cần Thơ'],
    'Bà Rịa - Vũng Tàu': ['Bến xe Vũng Tàu', 'Văn phòng Vũng Tàu', 'Bãi Sau', 'Bãi Trước'],
    'Lâm Đồng': ['Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt', 'Hồ Xuân Hương', 'Quảng trường Lâm Viên'],
    'Khánh Hòa': ['Bến xe phía Nam Nha Trang', 'Ga Nha Trang', 'Quảng trường 2/4', 'Vinpearl Harbour'],
    'Đắk Lắk': ['Bến xe Phía Nam Buôn Ma Thuột', 'Ngã Sáu Buôn Ma Thuột', 'Coopmart Buôn Ma Thuột'],
    'Bình Thuận': ['Bến xe Phan Thiết', 'Chợ Phan Thiết', 'Mũi Né', 'NovaWorld Phan Thiết'],
    'Đà Nẵng': ['Bến xe Trung tâm Đà Nẵng', 'Sân bay Đà Nẵng', 'Công viên Biển Đông', 'Cầu Rồng'],
    'Kiên Giang': ['Bến xe Rạch Giá', 'Bến tàu Rạch Giá', 'Văn phòng Rạch Giá']
  };

  shuttlesDb: { [key: string]: string[] } = {
    'TP.HCM': ['Sân bay Tân Sơn Nhất', 'Crescent Mall Quận 7', 'AEON Mall Tân Phú', 'Gigamall Thủ Đức'],
    'Cần Thơ': ['Vincom Xuân Khánh', 'LOTTE Mart Cần Thơ'],
    'Lâm Đồng': ['Quảng trường Lâm Viên', 'Big C Đà Lạt'],
    'Khánh Hòa': ['Vincom Plaza Nha Trang', 'Tháp Trầm Hương'],
    'Đà Nẵng': ['Vincom Đà Nẵng', 'Cầu Rồng'],
    'Bà Rịa - Vũng Tàu': ['LOTTE Mart Vũng Tàu', 'Bãi Sau'],
    'Bình Thuận': ['NovaWorld Phan Thiết', 'Mũi Né'],
    'Đắk Lắk': ['Coopmart Buôn Ma Thuột', 'Ngã Sáu Buôn Ma Thuột'],
    'Kiên Giang': ['Coopmart Rạch Giá', 'Bến tàu Rạch Giá']
  };

  stopsDb: string[] = [
    'Trung Lương', 'Cai Lậy', 'Cái Bè', 'Vĩnh Long',
    'Long Thành', 'Bà Rịa', 'Dầu Giây', 'Hàm Thuận Nam',
    'Bảo Lộc', 'Di Linh', 'Phan Thiết', 'Phan Rang',
    'Cam Ranh', 'Khánh Vĩnh', 'Liên Khương', 'Krông Pắc',
    'Quy Nhơn', 'Quảng Ngãi', 'Tam Kỳ', 'Thốt Nốt', 'Long Xuyên'
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initMockData();
    this.extractFilterOptions();
    this.filterRoutes();
  }

  initMockData() {
    this.allRoutes = [
      {
        id: 1,
        name: 'TP.HCM ↔ Cần Thơ',
        startPoint: 'TP.HCM',
        endPoint: 'Cần Thơ',
        distance: '170 km',
        duration: '3.5 tiếng',
        tripsPerDay: 12,
        price: 180000,
        carTypes: 'Limousine, Cabin',
        status: 'active',
        pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Bến xe Trung tâm Cần Thơ', 'Văn phòng Ninh Kiều'],
        stops: ['Trung Lương', 'Cai Lậy', 'Vĩnh Long'],
        shuttles: ['Sân bay Tân Sơn Nhất', 'Vincom Xuân Khánh']
      },
      {
        id: 2,
        name: 'TP.HCM ↔ Vũng Tàu',
        startPoint: 'TP.HCM',
        endPoint: 'Bà Rịa - Vũng Tàu',
        distance: '100 km',
        duration: '2 tiếng',
        tripsPerDay: 20,
        price: 160000,
        carTypes: 'Limousine, Giường nằm',
        status: 'active',
        pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Vũng Tàu', 'Bãi Sau'],
        stops: ['Long Thành', 'Bà Rịa'],
        shuttles: ['Sân bay Tân Sơn Nhất', 'LOTTE Mart Vũng Tàu']
      },
      {
        id: 3,
        name: 'Đà Lạt ↔ Buôn Ma Thuột',
        startPoint: 'Lâm Đồng',
        endPoint: 'Đắk Lắk',
        distance: '210 km',
        duration: '5 tiếng',
        tripsPerDay: 8,
        price: 220000,
        carTypes: 'Giường nằm',
        status: 'active',
        pickupPoints: ['Bến xe Liên Tỉnh Đà Lạt', 'Bến xe Phía Nam Buôn Ma Thuột'],
        stops: ['Liên Khương', 'Krông Pắc'],
        shuttles: ['Quảng trường Lâm Viên', 'Coopmart Buôn Ma Thuột']
      },
      {
        id: 4,
        name: 'Đà Lạt ↔ Nha Trang',
        startPoint: 'Lâm Đồng',
        endPoint: 'Khánh Hòa',
        distance: '140 km',
        duration: '3 tiếng',
        tripsPerDay: 15,
        price: 170000,
        carTypes: 'Limousine, Cabin',
        status: 'active',
        pickupPoints: ['Bến xe Liên Tỉnh Đà Lạt', 'Bến xe phía Nam Nha Trang', 'Vinpearl Harbour'],
        stops: ['Khánh Vĩnh'],
        shuttles: ['Quảng trường Lâm Viên', 'Vincom Plaza Nha Trang']
      },
      {
        id: 5,
        name: 'Cần Thơ ↔ Rạch Giá',
        startPoint: 'Cần Thơ',
        endPoint: 'Kiên Giang',
        distance: '115 km',
        duration: '2.5 tiếng',
        tripsPerDay: 10,
        price: 150000,
        carTypes: 'Giường nằm, Limousine',
        status: 'active',
        pickupPoints: ['Bến xe Trung tâm Cần Thơ', 'Bến xe Rạch Giá', 'Bến tàu Rạch Giá'],
        stops: ['Thốt Nốt', 'Long Xuyên'],
        shuttles: ['LOTTE Mart Cần Thơ', 'Bến tàu Rạch Giá']
      },
      {
        id: 6,
        name: 'TP.HCM ↔ Phan Thiết',
        startPoint: 'TP.HCM',
        endPoint: 'Bình Thuận',
        distance: '200 km',
        duration: '4 tiếng',
        tripsPerDay: 18,
        price: 200000,
        carTypes: 'Giường nằm',
        status: 'active',
        pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Phan Thiết', 'Mũi Né'],
        stops: ['Long Thành', 'Dầu Giây'],
        shuttles: ['Sân bay Tân Sơn Nhất', 'NovaWorld Phan Thiết']
      },
      {
        id: 7,
        name: 'TP.HCM ↔ Đà Lạt',
        startPoint: 'TP.HCM',
        endPoint: 'Lâm Đồng',
        distance: '310 km',
        duration: '7 tiếng',
        tripsPerDay: 25,
        price: 250000,
        carTypes: 'Cabin, Limousine',
        status: 'active',
        pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt'],
        stops: ['Dầu Giây', 'Bảo Lộc', 'Di Linh'],
        shuttles: ['Sân bay Tân Sơn Nhất', 'Big C Đà Lạt']
      },
      {
        id: 8,
        name: 'TP.HCM ↔ Nha Trang',
        startPoint: 'TP.HCM',
        endPoint: 'Khánh Hòa',
        distance: '435 km',
        duration: '8.5 tiếng',
        tripsPerDay: 22,
        price: 300000,
        carTypes: 'Limousine, Giường nằm',
        status: 'active',
        pickupPoints: ['Bến xe Miền Đông Mới', 'Bến xe phía Nam Nha Trang', 'Ga Nha Trang'],
        stops: ['Dầu Giây', 'Phan Thiết', 'Phan Rang', 'Cam Ranh'],
        shuttles: ['Sân bay Tân Sơn Nhất', 'Tháp Trầm Hương']
      },
      {
        id: 9,
        name: 'Nha Trang ↔ Đà Nẵng',
        startPoint: 'Khánh Hòa',
        endPoint: 'Đà Nẵng',
        distance: '530 km',
        duration: '11 tiếng',
        tripsPerDay: 14,
        price: 350000,
        carTypes: 'Limousine, Cabin',
        status: 'locked',
        pickupPoints: ['Bến xe phía Nam Nha Trang', 'Bến xe Trung tâm Đà Nẵng', 'Sân bay Đà Nẵng'],
        stops: ['Cam Ranh', 'Quy Nhơn', 'Quảng Ngãi', 'Tam Kỳ'],
        shuttles: ['Vincom Plaza Nha Trang', 'Vincom Đà Nẵng']
      }
    ];
  }

  extractFilterOptions() {
    const startSet = new Set<string>();
    const endSet = new Set<string>();
    this.allRoutes.forEach(r => {
      startSet.add(r.startPoint);
      endSet.add(r.endPoint);
    });
    this.startPoints = Array.from(startSet);
    this.endPoints = Array.from(endSet);
  }

  getActiveRoutesCount(): number {
    return this.allRoutes.filter(r => r.status === 'active').length;
  }

  getLockedRoutesCount(): number {
    return this.allRoutes.filter(r => r.status === 'locked').length;
  }

  setTab(tab: 'all' | 'active' | 'locked') {
    this.activeTab = tab;
    this.filterRoutes();
  }

  filterRoutes() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredRoutes = this.allRoutes.filter(r => {
      // Tab status filter
      if (this.activeTab === 'active' && r.status !== 'active') return false;
      if (this.activeTab === 'locked' && r.status !== 'locked') return false;

      // Dropdown filters
      if (this.startPointFilter && r.startPoint !== this.startPointFilter) return false;
      if (this.endPointFilter && r.endPoint !== this.endPointFilter) return false;

      // Text search query
      if (query) {
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCar = r.carTypes.toLowerCase().includes(query);
        return matchesName || matchesCar;
      }

      return true;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.startPointFilter = '';
    this.endPointFilter = '';
    this.filterRoutes();
    this.addToast('Đã xóa tất cả bộ lọc tìm kiếm!', 'success');
  }

  // Toast utility methods based on spec
  addToast(message: string, type: 'success' | 'error') {
    const id = this.toastIdCounter++;
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.removeToast(id);
    }, 3000); // Auto hide after 3 seconds
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
    }, 1800); // Between 1.5s and 2s
  }

  // Modal Actions
  openAddModal() {
    this.isEditMode = false;
    this.currentRoute = {
      name: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      duration: '',
      tripsPerDay: 5,
      price: 150000,
      carTypes: 'Limousine, Cabin',
      status: 'active',
      pickupPoints: [],
      stops: [],
      shuttles: []
    };
    this.errors = {};
    this.isModalOpen = true;
  }

  openEditModal(route: TuyenXe, event: Event) {
    event.stopPropagation();
    this.isEditMode = true;
    this.currentRoute = JSON.parse(JSON.stringify(route)); // Deep clone
    this.errors = {};
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.errors = {};
  }

  // Toggle multi-select checklists in edit modal
  toggleSelection(listName: 'pickupPoints' | 'stops' | 'shuttles', item: string) {
    if (!this.currentRoute[listName]) {
      this.currentRoute[listName] = [];
    }
    const list = this.currentRoute[listName] as string[];
    const index = list.indexOf(item);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
  }

  isSelected(listName: 'pickupPoints' | 'stops' | 'shuttles', item: string): boolean {
    if (!this.currentRoute[listName]) return false;
    return (this.currentRoute[listName] as string[]).includes(item);
  }

  getPickupPointsForSelectedProvinces(): string[] {
    const list: string[] = [];
    if (this.currentRoute.startPoint && this.pickupPointsDb[this.currentRoute.startPoint]) {
      list.push(...this.pickupPointsDb[this.currentRoute.startPoint]);
    }
    if (this.currentRoute.endPoint && this.pickupPointsDb[this.currentRoute.endPoint] && this.currentRoute.endPoint !== this.currentRoute.startPoint) {
      list.push(...this.pickupPointsDb[this.currentRoute.endPoint]);
    }
    return list;
  }

  getShuttlesForSelectedProvinces(): string[] {
    const list: string[] = [];
    if (this.currentRoute.startPoint && this.shuttlesDb[this.currentRoute.startPoint]) {
      list.push(...this.shuttlesDb[this.currentRoute.startPoint]);
    }
    if (this.currentRoute.endPoint && this.shuttlesDb[this.currentRoute.endPoint] && this.currentRoute.endPoint !== this.currentRoute.startPoint) {
      list.push(...this.shuttlesDb[this.currentRoute.endPoint]);
    }
    return list;
  }

  validateForm(): boolean {
    this.errors = {
      startPoint: !this.currentRoute.startPoint,
      endPoint: !this.currentRoute.endPoint,
      distance: !this.currentRoute.distance || !this.currentRoute.distance.trim(),
      duration: !this.currentRoute.duration || !this.currentRoute.duration.trim(),
      price: !this.currentRoute.price || this.currentRoute.price <= 0,
      tripsPerDay: !this.currentRoute.tripsPerDay || this.currentRoute.tripsPerDay <= 0
    };

    // If start and end point are same
    if (this.currentRoute.startPoint && this.currentRoute.endPoint && this.currentRoute.startPoint === this.currentRoute.endPoint) {
      this.errors['samePoints'] = true;
      this.addToast('Điểm đầu và điểm cuối không thể trùng nhau!', 'error');
      return false;
    }

    return !Object.values(this.errors).some(Boolean);
  }

  saveRoute() {
    if (!this.validateForm()) {
      this.addToast('Vui lòng điền đầy đủ và đúng thông tin!', 'error');
      return;
    }

    // Set name automatically
    this.currentRoute.name = `${this.currentRoute.startPoint} ↔ ${this.currentRoute.endPoint}`;

    if (this.isEditMode) {
      const idx = this.allRoutes.findIndex(r => r.id === this.currentRoute.id);
      if (idx > -1) {
        this.allRoutes[idx] = this.currentRoute as TuyenXe;
      }
      this.filterRoutes();
      this.triggerCenteredToast('Cập Nhật Thành Công', 'Thông tin tuyến xe đã được ghi nhận vào hệ thống.');
    } else {
      const newRoute: TuyenXe = {
        ...(this.currentRoute as TuyenXe),
        id: this.allRoutes.length > 0 ? Math.max(...this.allRoutes.map(r => r.id)) + 1 : 1
      };
      this.allRoutes.push(newRoute);
      this.filterRoutes();
      this.triggerCenteredToast('Tạo Tuyến Xe Thành Công', 'Tuyến xe mới đã được đăng ký và đưa vào hoạt động.');
    }
    this.extractFilterOptions();
  }

  toggleRouteStatus(route: TuyenXe | Partial<TuyenXe>, event: Event) {
    event.stopPropagation();
    if (!route) return;
    route.status = route.status === 'active' ? 'locked' : 'active';
    this.filterRoutes();

    const name = route.name || '';
    if (route.status === 'locked') {
      this.addToast(`Đã khóa thành công tuyến xe ${name}!`, 'success');
    } else {
      this.addToast(`Đã mở khóa thành công tuyến xe ${name}!`, 'success');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
