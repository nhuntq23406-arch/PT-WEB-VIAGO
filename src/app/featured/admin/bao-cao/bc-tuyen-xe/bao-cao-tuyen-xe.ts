import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RouteReportItem {
  code: string;
  name: string;
  distance: number;
  duration: string;
  tripsRun: number;
  ticketsSold: number;
  avgFill: number; // percentage
  revenue: number;
  cost: number;
  status: 'active' | 'locked';
}

@Component({
  selector: 'app-bao-cao-tuyen-xe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bao-cao-tuyen-xe.html',
  styleUrl: './bao-cao-tuyen-xe.css',
})
export class BaoCaoTuyenXeComponent implements OnInit {
  startDate = '2026-05-01';
  endDate = '2026-05-31';
  selectedRoute = '';
  selectedStatus = '';

  routesList: string[] = [
    'T001 - TP.HCM ↔ Đà Lạt',
    'T002 - TP.HCM ↔ Nha Trang',
    'T003 - TP.HCM ↔ Cần Thơ',
    'T004 - TP.HCM ↔ Vũng Tàu',
    'T005 - Đà Lạt ↔ Nha Trang',
    'T006 - Nha Trang ↔ Đà Nẵng',
    'T007 - Cần Thơ ↔ Rạch Giá',
    'T008 - Đà Lạt ↔ Buôn Ma Thuột',
    'T009 - Đà Lạt ↔ TP.HCM',
    'T010 - Nha Trang ↔ TP.HCM',
    'T011 - Cần Thơ ↔ TP.HCM',
    'T012 - Vũng Tàu ↔ TP.HCM',
    'T013 - Nha Trang ↔ Đà Lạt',
    'T014 - Đà Nẵng ↔ Nha Trang',
    'T015 - Rạch Giá ↔ Cần Thơ',
    'T016 - Buôn Ma Thuột ↔ Đà Lạt',
    'T017 - Dập Đá ↔ Bến xe miền Đông',
    'T018 - Tuy Phước ↔ Bến xe miền Đông',
    'T019 - Phù Cát ↔ An Sương',
    'T020 - Nhơn Khánh ↔ Ngã tư An Sương',
  ];

  routesData: RouteReportItem[] = [
    { code: 'T017', name: 'Dập Đá ↔ Bến xe miền Đông', distance: 300, duration: '6h 00p', tripsRun: 1, ticketsSold: 3, avgFill: 14, revenue: 1000000, cost: 0, status: 'active' },
    { code: 'T018', name: 'Tuy Phước ↔ Bến xe miền Đông', distance: 300, duration: '6h 00p', tripsRun: 1, ticketsSold: 2, avgFill: 9, revenue: 1500000, cost: 0, status: 'active' },
    { code: 'T019', name: 'Phù Cát ↔ An Sương', distance: 320, duration: '6h 30p', tripsRun: 1, ticketsSold: 5, avgFill: 22, revenue: 1800000, cost: 0, status: 'active' },
    { code: 'T020', name: 'Nhơn Khánh ↔ Ngã tư An Sương', distance: 310, duration: '6h 15p', tripsRun: 1, ticketsSold: 4, avgFill: 18, revenue: 1180000, cost: 0, status: 'active' },
    { code: 'T001', name: 'TP.HCM ↔ Đà Lạt', distance: 300, duration: '6h 30p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T002', name: 'TP.HCM ↔ Nha Trang', distance: 450, duration: '9h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T003', name: 'TP.HCM ↔ Cần Thơ', distance: 170, duration: '3h 15p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T004', name: 'TP.HCM ↔ Vũng Tàu', distance: 120, duration: '2h 30p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T005', name: 'Đà Lạt ↔ Nha Trang', distance: 200, duration: '4h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T006', name: 'Nha Trang ↔ Đà Nẵng', distance: 540, duration: '8h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'locked' },
    { code: 'T007', name: 'Cần Thơ ↔ Rạch Giá', distance: 115, duration: '2h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T008', name: 'Đà Lạt ↔ Buôn Ma Thuột', distance: 210, duration: '5h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'locked' },
    { code: 'T009', name: 'Đà Lạt ↔ TP.HCM', distance: 300, duration: '6h 30p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T010', name: 'Nha Trang ↔ TP.HCM', distance: 450, duration: '9h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T011', name: 'Cần Thơ ↔ TP.HCM', distance: 170, duration: '3h 15p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T012', name: 'Vũng Tàu ↔ TP.HCM', distance: 120, duration: '2h 30p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T013', name: 'Nha Trang ↔ Đà Lạt', distance: 200, duration: '4h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T014', name: 'Đà Nẵng ↔ Nha Trang', distance: 540, duration: '8h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'locked' },
    { code: 'T015', name: 'Rạch Giá ↔ Cần Thơ', distance: 115, duration: '2h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'active' },
    { code: 'T016', name: 'Buôn Ma Thuột ↔ Đà Lạt', distance: 210, duration: '5h 00p', tripsRun: 0, ticketsSold: 0, avgFill: 0, revenue: 0, cost: 0, status: 'locked' },
  ];

  filteredRoutes: RouteReportItem[] = [];

  showDetailModal = false;
  detailRoute: RouteReportItem | null = null;
  activeDropdownId: string | null = null;

  openDetail(route: RouteReportItem) {
    this.detailRoute = route;
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.detailRoute = null;
  }

  toggleDropdown(code: string, event: Event) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === code ? null : code;
  }

  closeDropdown() {
    this.activeDropdownId = null;
  }

  @HostListener('document:click')
  closeDropdownOutside() {
    this.closeDropdown();
  }

  toggleRouteStatus(route: RouteReportItem) {
    route.status = route.status === 'active' ? 'locked' : 'active';
  }

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    let result = this.routesData;

    // Filter by route code if selected
    if (this.selectedRoute) {
      const codeOnly = this.selectedRoute.split(' - ')[0];
      result = result.filter(r => r.code === codeOnly);
    }

    // Filter by status
    if (this.selectedStatus) {
      result = result.filter(r => r.status === this.selectedStatus);
    }

    this.filteredRoutes = result;
  }

  resetFilters() {
    this.startDate = '2026-05-01';
    this.endDate = '2026-05-31';
    this.selectedRoute = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  exportExcel() {
    alert('✓ Đã xuất báo cáo tổng hợp theo tuyến thành công dưới dạng file Excel!');
  }

  // Getters for Stats
  get totalRoutesCount() {
    return this.filteredRoutes.length;
  }

  get totalTicketsSold() {
    return this.filteredRoutes.reduce((sum, r) => sum + r.ticketsSold, 0);
  }

  get totalRevenue() {
    return this.filteredRoutes.reduce((sum, r) => sum + r.revenue, 0);
  }

  get totalCost() {
    return this.filteredRoutes.reduce((sum, r) => sum + r.cost, 0);
  }

  get totalProfit() {
    return this.totalRevenue - this.totalCost;
  }

  getAvgRevenuePerTrip(r: RouteReportItem) {
    if (!r.tripsRun) return 0;
    return Math.round(r.revenue / r.tripsRun);
  }

  getAvgProfitPerTrip(r: RouteReportItem) {
    if (!r.tripsRun) return 0;
    return Math.round((r.revenue - r.cost) / r.tripsRun);
  }
}
