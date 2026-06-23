import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RouteItem {
  id: number;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  duration: string;
  tripsPerDay: number;
  price: number;
  status: 'active' | 'locked';
}

@Component({
  selector: 'app-tuyen-xe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tuyen-xe.html',
  styleUrl: './tuyen-xe.css',
})
export class TuyenXeComponent implements OnInit {
  routesList: RouteItem[] = [
    // Chiều đi
    { id: 1, code: 'T001', name: 'TP.HCM ↔ Đà Lạt',         startPoint: 'TP.HCM',    endPoint: 'Đà Lạt',        distance: 300, duration: '6h 30p', tripsPerDay: 8, price: 180000, status: 'active' },
    { id: 2, code: 'T002', name: 'TP.HCM ↔ Nha Trang',       startPoint: 'TP.HCM',    endPoint: 'Nha Trang',     distance: 450, duration: '9h 00p', tripsPerDay: 6, price: 220000, status: 'active' },
    { id: 3, code: 'T003', name: 'TP.HCM ↔ Cần Thơ',         startPoint: 'TP.HCM',    endPoint: 'Cần Thơ',       distance: 170, duration: '3h 15p', tripsPerDay: 12,price: 120000, status: 'active' },
    { id: 4, code: 'T004', name: 'TP.HCM ↔ Vũng Tàu',        startPoint: 'TP.HCM',    endPoint: 'Vũng Tàu',      distance: 120, duration: '2h 30p', tripsPerDay: 14,price: 90000,  status: 'active' },
    { id: 5, code: 'T005', name: 'Đà Lạt ↔ Nha Trang',       startPoint: 'Đà Lạt',    endPoint: 'Nha Trang',     distance: 200, duration: '4h 00p', tripsPerDay: 4, price: 150000, status: 'active' },
    { id: 6, code: 'T006', name: 'Nha Trang ↔ Đà Nẵng',      startPoint: 'Nha Trang', endPoint: 'Đà Nẵng',       distance: 540, duration: '8h 00p', tripsPerDay: 3, price: 200000, status: 'locked' },
    { id: 7, code: 'T007', name: 'Cần Thơ ↔ Rạch Giá',       startPoint: 'Cần Thơ',   endPoint: 'Rạch Giá',      distance: 115, duration: '2h 00p', tripsPerDay: 10,price: 80000,  status: 'active' },
    { id: 8, code: 'T008', name: 'Đà Lạt ↔ Buôn Ma Thuột',   startPoint: 'Đà Lạt',    endPoint: 'Buôn Ma Thuột', distance: 210, duration: '5h 00p', tripsPerDay: 4, price: 160000, status: 'locked' },

    // Chiều về (ngược lại)
    { id: 9,  code: 'T009', name: 'Đà Lạt ↔ TP.HCM',         startPoint: 'Đà Lạt',    endPoint: 'TP.HCM',        distance: 300, duration: '6h 30p', tripsPerDay: 8, price: 180000, status: 'active' },
    { id: 10, code: 'T010', name: 'Nha Trang ↔ TP.HCM',       startPoint: 'Nha Trang', endPoint: 'TP.HCM',        distance: 450, duration: '9h 00p', tripsPerDay: 6, price: 220000, status: 'active' },
    { id: 11, code: 'T011', name: 'Cần Thơ ↔ TP.HCM',         startPoint: 'Cần Thơ',   endPoint: 'TP.HCM',        distance: 170, duration: '3h 15p', tripsPerDay: 12,price: 120000, status: 'active' },
    { id: 12, code: 'T012', name: 'Vũng Tàu ↔ TP.HCM',        startPoint: 'Vũng Tàu',  endPoint: 'TP.HCM',        distance: 120, duration: '2h 30p', tripsPerDay: 14,price: 90000,  status: 'active' },
    { id: 13, code: 'T013', name: 'Nha Trang ↔ Đà Lạt',       startPoint: 'Nha Trang', endPoint: 'Đà Lạt',        distance: 200, duration: '4h 00p', tripsPerDay: 4, price: 150000, status: 'active' },
    { id: 14, code: 'T014', name: 'Đà Nẵng ↔ Nha Trang',      startPoint: 'Đà Nẵng',   endPoint: 'Nha Trang',     distance: 540, duration: '8h 00p', tripsPerDay: 3, price: 200000, status: 'locked' },
    { id: 15, code: 'T015', name: 'Rạch Giá ↔ Cần Thơ',       startPoint: 'Rạch Giá',  endPoint: 'Cần Thơ',       distance: 115, duration: '2h 00p', tripsPerDay: 10,price: 80000,  status: 'active' },
    { id: 16, code: 'T016', name: 'Buôn Ma Thuột ↔ Đà Lạt',   startPoint: 'Buôn Ma Thuột', endPoint: 'Đà Lạt',    distance: 210, duration: '5h 00p', tripsPerDay: 4, price: 160000, status: 'locked' },
  ];

  filteredRoutes: RouteItem[] = [];
  activeTab: 'all' | 'active' | 'locked' = 'all';
  filterStart = '';
  filterEnd = '';
  searchText = '';
  startPoints: string[] = [];
  endPoints: string[] = [];

  // Modal states
  showFormModal = false;
  showDetailModal = false;
  isEditing = false;
  selectedRoute: RouteItem | null = null;

  newRoute: Partial<RouteItem> = {};

  ngOnInit() { this.extractPoints(); this.applyFilters(); }

  extractPoints() {
    this.startPoints = [...new Set(this.routesList.map(r => r.startPoint))].sort();
    this.endPoints   = [...new Set(this.routesList.map(r => r.endPoint))].sort();
  }

  setTab(tab: 'all' | 'active' | 'locked') { this.activeTab = tab; this.applyFilters(); }

  applyFilters() {
    let result = this.routesList;
    if (this.activeTab === 'active') result = result.filter(r => r.status === 'active');
    if (this.activeTab === 'locked') result = result.filter(r => r.status === 'locked');
    if (this.filterStart) result = result.filter(r => r.startPoint === this.filterStart);
    if (this.filterEnd)   result = result.filter(r => r.endPoint   === this.filterEnd);
    if (this.searchText)  result = result.filter(r =>
      r.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      r.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.filteredRoutes = result;
  }

  resetFilters() {
    this.filterStart = '';
    this.filterEnd = '';
    this.searchText = '';
    this.applyFilters();
  }

  openDetail(route: RouteItem) { this.selectedRoute = route; this.showDetailModal = true; }
  closeDetail() { this.showDetailModal = false; this.selectedRoute = null; }

  openFormModal(route?: RouteItem) {
    if (route) {
      this.isEditing = true;
      this.selectedRoute = route;
      this.newRoute = { ...route };
    } else {
      this.isEditing = false;
      this.selectedRoute = null;
      this.newRoute = { code: '', name: '', startPoint: '', endPoint: '', distance: 0, duration: '', tripsPerDay: 4, price: 0, status: 'active' };
    }
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedRoute = null;
  }

  submitForm(e: Event) {
    e.preventDefault();
    if (!this.newRoute.name || !this.newRoute.startPoint || !this.newRoute.endPoint) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }

    if (this.isEditing && this.selectedRoute) {
      const idx = this.routesList.findIndex(r => r.id === this.selectedRoute!.id);
      if (idx > -1) {
        this.routesList[idx] = {
          ...this.selectedRoute,
          ...this.newRoute,
          code: this.newRoute.code || this.selectedRoute.code,
        } as RouteItem;
      }
    } else {
      const nextId = this.routesList.length > 0 ? Math.max(...this.routesList.map(r => r.id)) + 1 : 1;
      this.routesList.push({
        id: nextId,
        code: this.newRoute.code || `T00${nextId}`,
        name: this.newRoute.name!,
        startPoint: this.newRoute.startPoint!,
        endPoint: this.newRoute.endPoint!,
        distance: this.newRoute.distance || 0,
        duration: this.newRoute.duration || '0h 00p',
        tripsPerDay: this.newRoute.tripsPerDay || 4,
        price: this.newRoute.price || 0,
        status: this.newRoute.status || 'active',
      });
    }

    this.extractPoints();
    this.applyFilters();
    this.closeFormModal();
  }

  toggleStatus(route: RouteItem) {
    route.status = route.status === 'active' ? 'locked' : 'active';
    this.applyFilters();
  }

  activeDropdownId: number | null = null;
  toggleDropdown(id: number, event: Event) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.activeDropdownId = null;
  }

  deleteRoute(route: RouteItem) {
    if (confirm(`Bạn có chắc muốn xóa tuyến xe "${route.name}"?`)) {
      this.routesList = this.routesList.filter(r => r.id !== route.id);
      this.extractPoints();
      this.applyFilters();
    }
  }

  get activeCount() { return this.routesList.filter(r => r.status === 'active').length; }
  get lockedCount() { return this.routesList.filter(r => r.status === 'locked').length; }
  get totalDistance() { return this.routesList.reduce((s, r) => s + r.distance, 0); }
  get totalTrips() { return this.routesList.reduce((s, r) => s + r.tripsPerDay, 0); }
}
