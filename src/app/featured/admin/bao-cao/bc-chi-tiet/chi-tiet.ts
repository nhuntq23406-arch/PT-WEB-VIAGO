import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TripReportItem {
  id: string;
  routeName: string;
  vehiclePlate: string;
  vehicleType: string;
  departureTime: string;
  departureDate: string; // YYYY-MM-DD
  soldSeats: number;
  totalSeats: number;
  revenue: number;
  cost: number;
  driverName: string;
  assistantName: string;
  status: 'waiting' | 'running' | 'completed' | 'cancelled';
  
  // Cost breakdown
  fuelCost?: number;
  tollCost?: number;
  driverSalary?: number;
  assistantSalary?: number;
  otherCost?: number;
}

@Component({
  selector: 'app-bao-cao-chi-tiet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chi-tiet.html',
  styleUrl: './chi-tiet.css',
})
export class BaoCaoChiTietComponent implements OnInit {
  // Tabbed modal states
  modalActiveTab: 'tuyen-xe' | 'thoi-gian' | 'chi-phi' = 'tuyen-xe';
  showFormModal = false;
  showDetailModal = false;
  selectedTrip: TripReportItem | null = null;
  activeDropdownId: string | null = null;

  driversList: string[] = ['Trần Hoàng Long', 'Nguyễn Văn Nam', 'Lê Hoàng Sơn', 'Trần Minh Triết', 'Phan Văn Trị', 'Nguyễn Thanh Tùng'];
  assistantsList: string[] = ['Lê Thế Hùng', 'Nguyễn Đức Minh', 'Phạm Quốc Bảo', 'Võ Hoàng Long'];
  vehicleNamesList: string[] = ['Limousine 3', 'Limousine VIP', 'Giường nằm 40 chỗ', 'Ghế ngồi 29 chỗ'];
  platesList: string[] = ['77B-00842', '77B-08021', '77B-02082', '51B-12345', '49B-98765', '72B-45678', '65B-99911'];
  
  lowerSeats = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A'];
  upperSeats = ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'];
  
  generalPrice = 250000;
  seatGroups: { name: string; price: number; seats: string[] }[] = [];
  showAddGroupForm = false;
  newGroupName = '';
  newGroupPrice = 0;
  selectedSeatsForGroup: string[] = [];

  departureHour = 1;
  departureMinute = 0;
  totalDurationHours = 11;
  totalDurationMinutes = 15;
  
  openBeforeDays = 10;
  closeBeforeMinutes = 30;
  holdMinutes = 15;

  pickupPointsList = ['Bến xe Miền Tây', 'Bến xe Miền Đông', 'Ngã tư Ga', 'Suối Tiên'];
  stopPointsList = ['Trạm dừng chân Minh Khải', 'Trạm dừng chân Lê Hoàng', 'Bến xe Quy Nhơn'];

  pickupPoints = [
    { name: 'Bến xe Miền Tây', address: '395 Kinh Dương Vương, An Lạc, Bình Tân, TP.HCM', timeHour: 8, timeMinute: 0, date: '2026-06-24' }
  ];
  stopPoints = [
    { name: 'Trạm dừng chân Minh Khải', address: 'Quy Nhơn, Bình Định', timeHour: 17, timeMinute: 0, date: '2026-06-24' }
  ];

  setModalTab(tab: 'tuyen-xe' | 'thoi-gian' | 'chi-phi') {
    this.modalActiveTab = tab;
  }

  toggleSeatSelection(seat: string) {
    const idx = this.selectedSeatsForGroup.indexOf(seat);
    if (idx > -1) {
      this.selectedSeatsForGroup.splice(idx, 1);
    } else {
      this.selectedSeatsForGroup.push(seat);
    }
  }

  addSeatGroup() {
    if (!this.newGroupName || this.newGroupPrice <= 0 || this.selectedSeatsForGroup.length === 0) {
      alert('Vui lòng nhập tên nhóm, giá vé và chọn ít nhất 1 ghế.');
      return;
    }
    this.seatGroups.push({
      name: this.newGroupName,
      price: this.newGroupPrice,
      seats: [...this.selectedSeatsForGroup]
    });
    this.newGroupName = '';
    this.newGroupPrice = 0;
    this.selectedSeatsForGroup = [];
    this.showAddGroupForm = false;
  }

  removeSeatGroup(index: number) {
    this.seatGroups.splice(index, 1);
  }

  addPickupPoint() {
    this.pickupPoints.push({
      name: this.pickupPointsList[0],
      address: 'Địa chỉ tự động điền',
      timeHour: 8,
      timeMinute: 0,
      date: '2026-06-24'
    });
  }

  removePickupPoint(index: number) {
    this.pickupPoints.splice(index, 1);
  }

  addStopPoint() {
    this.stopPoints.push({
      name: this.stopPointsList[0],
      address: 'Địa chỉ tự động điền',
      timeHour: 17,
      timeMinute: 0,
      date: '2026-06-24'
    });
  }

  removeStopPoint(index: number) {
    this.stopPoints.splice(index, 1);
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.activeDropdownId = null;
  }

  openDetail(trip: TripReportItem) {
    this.initTripCosts(trip);
    this.selectedTrip = trip;
    this.modalActiveTab = 'tuyen-xe';
    this.showDetailModal = true;
  }

  openCostDetail(trip: TripReportItem) {
    this.initTripCosts(trip);
    this.selectedTrip = trip;
    this.modalActiveTab = 'chi-phi';
    this.showDetailModal = true;
  }

  initTripCosts(trip: TripReportItem) {
    trip.fuelCost = trip.fuelCost || Math.round((trip.cost || 2000000) * 0.5);
    trip.tollCost = trip.tollCost || Math.round((trip.cost || 2000000) * 0.15);
    trip.driverSalary = trip.driverSalary || Math.round((trip.cost || 2000000) * 0.25);
    trip.assistantSalary = trip.assistantSalary || Math.round((trip.cost || 2000000) * 0.05);
    trip.otherCost = trip.otherCost || Math.round((trip.cost || 2000000) * 0.05);
  }

  updateTotalCost(trip: TripReportItem) {
    trip.fuelCost = Number(trip.fuelCost || 0);
    trip.tollCost = Number(trip.tollCost || 0);
    trip.driverSalary = Number(trip.driverSalary || 0);
    trip.assistantSalary = Number(trip.assistantSalary || 0);
    trip.otherCost = Number(trip.otherCost || 0);
    trip.cost = trip.fuelCost + trip.tollCost + trip.driverSalary + trip.assistantSalary + trip.otherCost;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.selectedTrip = null;
  }

  toggleTripStatus(trip: TripReportItem) {
    if (trip.status === 'completed') {
      trip.status = 'waiting';
    } else {
      trip.status = 'completed';
    }
  }
  startDate = '2026-05-01';
  endDate = '2026-05-31';
  selectedRoute = '';
  selectedVehicle = '';
  selectedStatus = '';

  routesList: string[] = [
    'Dập Đá - Bến xe miền Đông',
    'Tuy Phước - Bến xe miền Đông',
    'Phù Cát - An Sương',
    'Nhơn Khánh - Ngã tư An Sương',
    'TP.HCM - Đà Lạt',
    'TP.HCM - Nha Trang',
    'TP.HCM - Vũng Tàu',
    'Cần Thơ - Rạch Giá',
  ];

  vehiclesList: string[] = [
    '77B-00842',
    '77B-05055',
    '77B-08021',
    '77B-02082',
    '51B-12345',
    '72B-45678',
    '65B-99911',
  ];

  tripsData: TripReportItem[] = [
    {
      id: 'LT100303',
      routeName: 'Dập Đá - Bến xe miền Đông',
      vehiclePlate: '77B-00842',
      vehicleType: 'Limousine_22_phong',
      departureTime: '22:00',
      departureDate: '2026-05-20',
      soldSeats: 3,
      totalSeats: 22,
      revenue: 1000000,
      cost: 1650000,
      fuelCost: 800000,
      tollCost: 200000,
      driverSalary: 500000,
      assistantSalary: 0,
      otherCost: 150000,
      driverName: 'Lý Mẫn Hạo',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100304',
      routeName: 'Tuy Phước - Bến xe miền Đông',
      vehiclePlate: '77B-05055',
      vehicleType: 'Limousine_22_phong',
      departureTime: '13:20',
      departureDate: '2026-05-20',
      soldSeats: 5,
      totalSeats: 22,
      revenue: 1500000,
      cost: 1720000,
      fuelCost: 850000,
      tollCost: 220000,
      driverSalary: 500000,
      assistantSalary: 0,
      otherCost: 150000,
      driverName: 'Huỳnh Minh Khang',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100305',
      routeName: 'Phù Cát - An Sương',
      vehiclePlate: '77B-08021',
      vehicleType: 'Limousine_22_phong',
      departureTime: '11:00',
      departureDate: '2026-05-21',
      soldSeats: 8,
      totalSeats: 22,
      revenue: 1800000,
      cost: 2350000,
      fuelCost: 1100000,
      tollCost: 250000,
      driverSalary: 600000,
      assistantSalary: 250000,
      otherCost: 150000,
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Lê Thế Hùng',
      status: 'completed',
    },
    {
      id: 'LT100306',
      routeName: 'Nhơn Khánh - Ngã tư An Sương',
      vehiclePlate: '77B-02082',
      vehicleType: 'Limousine_22_phong',
      departureTime: '18:00',
      departureDate: '2026-05-22',
      soldSeats: 4,
      totalSeats: 22,
      revenue: 1180000,
      cost: 2280000,
      fuelCost: 1050000,
      tollCost: 230000,
      driverSalary: 600000,
      assistantSalary: 250000,
      otherCost: 150000,
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Nguyễn Đức Minh',
      status: 'completed',
    },
    {
      id: 'LT100101',
      routeName: 'TP.HCM - Đà Lạt',
      vehiclePlate: '51B-12345',
      vehicleType: 'Giường_nằm_36',
      departureTime: '08:00',
      departureDate: '2026-05-02',
      soldSeats: 28,
      totalSeats: 36,
      revenue: 8400000,
      cost: 2650000,
      fuelCost: 1200000,
      tollCost: 280000,
      driverSalary: 800000,
      assistantSalary: 250000,
      otherCost: 120000,
      driverName: 'Lê Hoàng Sơn',
      assistantName: 'Phạm Quốc Bảo',
      status: 'completed',
    },
    {
      id: 'LT100102',
      routeName: 'TP.HCM - Đà Lạt',
      vehiclePlate: '51B-12345',
      vehicleType: 'Giường_nằm_36',
      departureTime: '20:00',
      departureDate: '2026-05-05',
      soldSeats: 32,
      totalSeats: 36,
      revenue: 9600000,
      cost: 2720000,
      fuelCost: 1250000,
      tollCost: 280000,
      driverSalary: 800000,
      assistantSalary: 250000,
      otherCost: 140000,
      driverName: 'Lê Hoàng Sơn',
      assistantName: 'Phạm Quốc Bảo',
      status: 'completed',
    },
    {
      id: 'LT100401',
      routeName: 'TP.HCM - Vũng Tàu',
      vehiclePlate: '72B-45678',
      vehicleType: 'Limousine_9_chỗ',
      departureTime: '14:00',
      departureDate: '2026-05-10',
      soldSeats: 7,
      totalSeats: 9,
      revenue: 1260000,
      cost: 820000,
      fuelCost: 350000,
      tollCost: 120000,
      driverSalary: 280000,
      assistantSalary: 0,
      otherCost: 70000,
      driverName: 'Phan Văn Trị',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100402',
      routeName: 'TP.HCM - Vũng Tàu',
      vehiclePlate: '72B-45678',
      vehicleType: 'Limousine_9_chỗ',
      departureTime: '16:00',
      departureDate: '2026-05-11',
      soldSeats: 9,
      totalSeats: 9,
      revenue: 1620000,
      cost: 840000,
      fuelCost: 360000,
      tollCost: 120000,
      driverSalary: 280000,
      assistantSalary: 0,
      otherCost: 80000,
      driverName: 'Phan Văn Trị',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100701',
      routeName: 'Cần Thơ - Rạch Giá',
      vehiclePlate: '65B-99911',
      vehicleType: 'Ghế_ngồi_29',
      departureTime: '05:30',
      departureDate: '2026-05-12',
      soldSeats: 22,
      totalSeats: 29,
      revenue: 2860000,
      cost: 1450000,
      fuelCost: 680000,
      tollCost: 90000,
      driverSalary: 450000,
      assistantSalary: 0,
      otherCost: 230000,
      driverName: 'Nguyễn Thanh Tùng',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100307',
      routeName: 'Dập Đá - Bến xe miền Đông',
      vehiclePlate: '77B-00842',
      vehicleType: 'Limousine_22_phong',
      departureTime: '07:00',
      departureDate: '2026-05-15',
      soldSeats: 18,
      totalSeats: 22,
      revenue: 5400000,
      cost: 2100000,
      fuelCost: 950000,
      tollCost: 210000,
      driverSalary: 650000,
      assistantSalary: 200000,
      otherCost: 90000,
      driverName: 'Lý Mẫn Hạo',
      assistantName: 'Trần Ngọc Bảo',
      status: 'completed',
    },
    {
      id: 'LT100308',
      routeName: 'Tuy Phước - Bến xe miền Đông',
      vehiclePlate: '77B-05055',
      vehicleType: 'Limousine_22_phong',
      departureTime: '10:00',
      departureDate: '2026-05-16',
      soldSeats: 20,
      totalSeats: 22,
      revenue: 6000000,
      cost: 2180000,
      fuelCost: 980000,
      tollCost: 220000,
      driverSalary: 650000,
      assistantSalary: 230000,
      otherCost: 100000,
      driverName: 'Huỳnh Minh Khang',
      assistantName: 'Lê Minh Tuấn',
      status: 'completed',
    },
    {
      id: 'LT100309',
      routeName: 'Phù Cát - An Sương',
      vehiclePlate: '77B-08021',
      vehicleType: 'Limousine_22_phong',
      departureTime: '15:30',
      departureDate: '2026-05-18',
      soldSeats: 15,
      totalSeats: 22,
      revenue: 4500000,
      cost: 2050000,
      fuelCost: 900000,
      tollCost: 200000,
      driverSalary: 650000,
      assistantSalary: 200000,
      otherCost: 100000,
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Lê Thế Hùng',
      status: 'completed',
    },
    {
      id: 'LT100310',
      routeName: 'Nhơn Khánh - Ngã tư An Sương',
      vehiclePlate: '77B-02082',
      vehicleType: 'Limousine_22_phong',
      departureTime: '09:00',
      departureDate: '2026-05-19',
      soldSeats: 22,
      totalSeats: 22,
      revenue: 6600000,
      cost: 2250000,
      fuelCost: 1000000,
      tollCost: 250000,
      driverSalary: 650000,
      assistantSalary: 220000,
      otherCost: 130000,
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Nguyễn Đức Minh',
      status: 'completed',
    },
    {
      id: 'LT100103',
      routeName: 'TP.HCM - Đà Lạt',
      vehiclePlate: '51B-12345',
      vehicleType: 'Giường_nằm_36',
      departureTime: '13:00',
      departureDate: '2026-05-24',
      soldSeats: 30,
      totalSeats: 36,
      revenue: 9000000,
      cost: 2700000,
      fuelCost: 1230000,
      tollCost: 280000,
      driverSalary: 800000,
      assistantSalary: 250000,
      otherCost: 140000,
      driverName: 'Lê Hoàng Sơn',
      assistantName: 'Phạm Quốc Bảo',
      status: 'completed',
    },
    {
      id: 'LT100403',
      routeName: 'TP.HCM - Vũng Tàu',
      vehiclePlate: '72B-45678',
      vehicleType: 'Limousine_9_chỗ',
      departureTime: '18:00',
      departureDate: '2026-05-25',
      soldSeats: 8,
      totalSeats: 9,
      revenue: 1440000,
      cost: 830000,
      fuelCost: 355000,
      tollCost: 120000,
      driverSalary: 280000,
      assistantSalary: 0,
      otherCost: 75000,
      driverName: 'Phan Văn Trị',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100702',
      routeName: 'Cần Thơ - Rạch Giá',
      vehiclePlate: '65B-99911',
      vehicleType: 'Ghế_ngồi_29',
      departureTime: '14:00',
      departureDate: '2026-05-28',
      soldSeats: 25,
      totalSeats: 29,
      revenue: 3250000,
      cost: 1480000,
      fuelCost: 700000,
      tollCost: 90000,
      driverSalary: 450000,
      assistantSalary: 0,
      otherCost: 240000,
      driverName: 'Nguyễn Thanh Tùng',
      assistantName: 'N/A',
      status: 'completed',
    },
    {
      id: 'LT100311',
      routeName: 'Dập Đá - Bến xe miền Đông',
      vehiclePlate: '77B-00842',
      vehicleType: 'Limousine_22_phong',
      departureTime: '23:30',
      departureDate: '2026-05-30',
      soldSeats: 19,
      totalSeats: 22,
      revenue: 5700000,
      cost: 2120000,
      fuelCost: 960000,
      tollCost: 210000,
      driverSalary: 650000,
      assistantSalary: 200000,
      otherCost: 100000,
      driverName: 'Lý Mẫn Hạo',
      assistantName: 'Trần Ngọc Bảo',
      status: 'completed',
    },
  ];

  filteredTrips: TripReportItem[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    let result = this.tripsData;

    // Filter by start date
    if (this.startDate) {
      result = result.filter(t => t.departureDate >= this.startDate);
    }

    // Filter by end date
    if (this.endDate) {
      result = result.filter(t => t.departureDate <= this.endDate);
    }

    // Filter by route
    if (this.selectedRoute) {
      result = result.filter(t => t.routeName === this.selectedRoute);
    }

    // Filter by vehicle plate
    if (this.selectedVehicle) {
      result = result.filter(t => t.vehiclePlate === this.selectedVehicle);
    }

    // Filter by status
    if (this.selectedStatus) {
      result = result.filter(t => t.status === this.selectedStatus);
    }

    this.filteredTrips = result;
  }

  resetFilters() {
    this.startDate = '2026-05-01';
    this.endDate = '2026-05-31';
    this.selectedRoute = '';
    this.selectedVehicle = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  exportExcel() {
    alert('✓ Đã xuất báo cáo chi tiết lợi nhuận chuyến xe thành công dưới dạng file Excel!');
  }

  // Getters for Stats Cards
  get totalTripsCount() {
    return this.filteredTrips.length;
  }

  get totalRevenue() {
    return this.filteredTrips.reduce((sum, t) => sum + t.revenue, 0);
  }

  get totalCost() {
    return this.filteredTrips.reduce((sum, t) => sum + t.cost, 0);
  }

  get totalProfit() {
    return this.totalRevenue - this.totalCost;
  }

  // Helpers
  formatDate(d: string) {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return d;
  }

  getFillPercentage(sold: number, total: number): number {
    if (!total) return 0;
    return Math.round((sold / total) * 100);
  }

  getStatusText(status: string) {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'running': return 'Đang chạy';
      case 'waiting': return 'Chờ chạy';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
