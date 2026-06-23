import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ScheduleItem {
  id: number;
  routeCode: string;
  routeName: string;
  vehiclePlate: string;
  driverName: string;
  assistantName?: string;
  departureDate: string;
  departureTime: string;
  status: 'running' | 'waiting' | 'completed' | 'locked';
}

interface RouteItem {
  code: string;
  name: string;
}

@Component({
  selector: 'app-lich-trinh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lich-trinh.html',
  styleUrl: './lich-trinh.css',
})
export class LichTrinhComponent implements OnInit {
  routesList: RouteItem[] = [
    { code: 'T001', name: 'TP.HCM ↔ Đà Lạt' },
    { code: 'T002', name: 'TP.HCM ↔ Nha Trang' },
    { code: 'T003', name: 'TP.HCM ↔ Cần Thơ' },
    { code: 'T004', name: 'TP.HCM ↔ Vũng Tàu' },
    { code: 'T005', name: 'Đà Lạt ↔ Nha Trang' },
    { code: 'T006', name: 'Nha Trang ↔ Đà Nẵng' },
    { code: 'T007', name: 'Cần Thơ ↔ Rạch Giá' },
    { code: 'T008', name: 'Đà Lạt ↔ Buôn Ma Thuột' },
    { code: 'T009', name: 'Đà Lạt ↔ TP.HCM' },
    { code: 'T010', name: 'Nha Trang ↔ TP.HCM' },
    { code: 'T011', name: 'Cần Thơ ↔ TP.HCM' },
    { code: 'T012', name: 'Vũng Tàu ↔ TP.HCM' },
    { code: 'T013', name: 'Nha Trang ↔ Đà Lạt' },
    { code: 'T014', name: 'Đà Nẵng ↔ Nha Trang' },
    { code: 'T015', name: 'Rạch Giá ↔ Cần Thơ' },
    { code: 'T016', name: 'Buôn Ma Thuột ↔ Đà Lạt' },
    { code: 'T017', name: 'Dập Đá ↔ Bến xe miền Đông' },
    { code: 'T018', name: 'Phù Cát ↔ An Sương' },
    { code: 'T019', name: 'Nhơn Khánh ↔ Ngã tư An Sương' },
  ];

  schedulesList: ScheduleItem[] = [
    {
      id: 1,
      routeCode: 'T017',
      routeName: 'Dập Đá ↔ Bến xe miền Đông',
      vehiclePlate: '77B-00842',
      driverName: 'Trần Hoàng Long',
      departureDate: '2026-06-10',
      departureTime: '01:00',
      status: 'waiting',
    },
    {
      id: 2,
      routeCode: 'T018',
      routeName: 'Phù Cát ↔ An Sương',
      vehiclePlate: '77B-08021',
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Lê Thế Hùng',
      departureDate: '2026-06-09',
      departureTime: '11:00',
      status: 'waiting',
    },
    {
      id: 3,
      routeCode: 'T019',
      routeName: 'Nhơn Khánh ↔ Ngã tư An Sương',
      vehiclePlate: '77B-02082',
      driverName: 'Nguyễn Văn Nam',
      assistantName: 'Nguyễn Đức Minh',
      departureDate: '2026-05-31',
      departureTime: '18:00',
      status: 'completed',
    },
    {
      id: 4,
      routeCode: 'T001',
      routeName: 'TP.HCM ↔ Đà Lạt',
      vehiclePlate: '51B-12345',
      driverName: 'Lê Hoàng Sơn',
      assistantName: 'Phạm Quốc Bảo',
      departureDate: '2026-06-22',
      departureTime: '08:00',
      status: 'running',
    },
    {
      id: 5,
      routeCode: 'T009',
      routeName: 'Đà Lạt ↔ TP.HCM',
      vehiclePlate: '49B-98765',
      driverName: 'Trần Minh Triết',
      assistantName: 'Võ Hoàng Long',
      departureDate: '2026-06-22',
      departureTime: '22:30',
      status: 'waiting',
    },
    {
      id: 6,
      routeCode: 'T004',
      routeName: 'TP.HCM ↔ Vũng Tàu',
      vehiclePlate: '72B-45678',
      driverName: 'Phan Văn Trị',
      departureDate: '2026-06-21',
      departureTime: '14:00',
      status: 'completed',
    },
    {
      id: 7,
      routeCode: 'T007',
      routeName: 'Cần Thơ ↔ Rạch Giá',
      vehiclePlate: '65B-99911',
      driverName: 'Nguyễn Thanh Tùng',
      departureDate: '2026-06-23',
      departureTime: '05:30',
      status: 'locked',
    },
  ];

  filteredSchedules: ScheduleItem[] = [];
  activeTab: 'all' | 'running' | 'waiting' | 'completed' | 'locked' = 'all';
  filterRoute = '';
  searchText = '';

  // Modal control
  showFormModal = false;
  showDetailModal = false;
  isEditing = false;
  selectedSchedule: ScheduleItem | null = null;

  newSchedule: Partial<ScheduleItem> = {};

  // Tabbed modal states
  modalActiveTab: 'tuyen-xe' | 'thoi-gian' = 'tuyen-xe';
  
  driversList: string[] = ['Trần Hoàng Long', 'Nguyễn Văn Nam', 'Lê Hoàng Sơn', 'Trần Minh Triết', 'Phan Văn Trị', 'Nguyễn Thanh Tùng'];
  assistantsList: string[] = ['Lê Thế Hùng', 'Nguyễn Đức Minh', 'Phạm Quốc Bảo', 'Võ Hoàng Long'];
  vehicleNamesList: string[] = ['Limousine 3', 'Limousine VIP', 'Giường nằm 40 chỗ', 'Ghế ngồi 29 chỗ'];
  platesList: string[] = ['77B-00842', '77B-08021', '77B-02082', '51B-12345', '49B-98765', '72B-45678', '65B-99911'];
  
  // Seat layout mock
  lowerSeats = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A'];
  upperSeats = ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'];
  
  // Price setup
  generalPrice = 250000;
  seatGroups: { name: string; price: number; seats: string[] }[] = [];
  showAddGroupForm = false;
  newGroupName = '';
  newGroupPrice = 0;
  selectedSeatsForGroup: string[] = [];

  // Timeline inputs
  departureHour = 1;
  departureMinute = 0;
  totalDurationHours = 11;
  totalDurationMinutes = 15;
  
  openBeforeDays = 10;
  closeBeforeMinutes = 30;
  holdMinutes = 15;

  // Pickup and stops points
  pickupPointsList = ['Bến xe Miền Tây', 'Bến xe Miền Đông', 'Ngã tư Ga', 'Suối Tiên'];
  stopPointsList = ['Trạm dừng chân Minh Khải', 'Trạm dừng chân Lê Hoàng', 'Bến xe Quy Nhơn'];

  pickupPoints = [
    { name: 'Bến xe Miền Tây', address: '395 Kinh Dương Vương, An Lạc, Bình Tân, TP.HCM', timeHour: 8, timeMinute: 0, date: '2026-06-24' }
  ];
  stopPoints = [
    { name: 'Trạm dừng chân Minh Khải', address: 'Quy Nhơn, Bình Định', timeHour: 17, timeMinute: 0, date: '2026-06-24' }
  ];

  setModalTab(tab: 'tuyen-xe' | 'thoi-gian') {
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

  ngOnInit() {
    this.applyFilters();
  }

  setTab(tab: 'all' | 'running' | 'waiting' | 'completed' | 'locked') {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.schedulesList;

    // Filter by tab
    if (this.activeTab !== 'all') {
      result = result.filter(s => s.status === this.activeTab);
    }

    // Filter by route dropdown
    if (this.filterRoute) {
      result = result.filter(s => s.routeCode === this.filterRoute);
    }

    // Search query
    if (this.searchText) {
      const query = this.searchText.toLowerCase();
      result = result.filter(
        s =>
          s.routeName.toLowerCase().includes(query) ||
          s.routeCode.toLowerCase().includes(query) ||
          s.vehiclePlate.toLowerCase().includes(query) ||
          s.driverName.toLowerCase().includes(query) ||
          (s.assistantName && s.assistantName.toLowerCase().includes(query))
      );
    }

    this.filteredSchedules = result;
  }

  resetFilters() {
    this.filterRoute = '';
    this.searchText = '';
    this.applyFilters();
  }

  openDetail(schedule: ScheduleItem) {
    this.selectedSchedule = schedule;
    this.modalActiveTab = 'tuyen-xe';
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.selectedSchedule = null;
  }

  openFormModal(schedule?: ScheduleItem) {
    this.modalActiveTab = 'tuyen-xe';
    if (schedule) {
      this.isEditing = true;
      this.selectedSchedule = schedule;
      this.newSchedule = { ...schedule };
    } else {
      this.isEditing = false;
      this.selectedSchedule = null;
      this.newSchedule = {
        routeCode: '',
        vehiclePlate: '',
        driverName: '',
        assistantName: '',
        departureDate: new Date().toISOString().split('T')[0],
        departureTime: '08:00',
        status: 'waiting',
      };
    }
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedSchedule = null;
  }

  submitForm(e: Event) {
    e.preventDefault();
    if (!this.newSchedule.routeCode || !this.newSchedule.vehiclePlate || !this.newSchedule.driverName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const selectedRouteObj = this.routesList.find(r => r.code === this.newSchedule.routeCode);
    const routeName = selectedRouteObj ? selectedRouteObj.name : 'Tuyến không xác định';

    if (this.isEditing && this.selectedSchedule) {
      // Update existing
      const idx = this.schedulesList.findIndex(s => s.id === this.selectedSchedule!.id);
      if (idx > -1) {
        this.schedulesList[idx] = {
          ...this.selectedSchedule,
          ...this.newSchedule,
          routeName: routeName,
        } as ScheduleItem;
      }
    } else {
      // Create new
      const nextId = this.schedulesList.length > 0 ? Math.max(...this.schedulesList.map(s => s.id)) + 1 : 1;
      this.schedulesList.push({
        id: nextId,
        routeCode: this.newSchedule.routeCode!,
        routeName: routeName,
        vehiclePlate: this.newSchedule.vehiclePlate!,
        driverName: this.newSchedule.driverName!,
        assistantName: this.newSchedule.assistantName || undefined,
        departureDate: this.newSchedule.departureDate!,
        departureTime: this.newSchedule.departureTime!,
        status: this.newSchedule.status as any || 'waiting',
      });
    }

    this.applyFilters();
    this.closeFormModal();
  }

  toggleStatus(schedule: ScheduleItem) {
    if (schedule.status === 'locked') {
      schedule.status = 'waiting';
    } else {
      schedule.status = 'locked';
    }
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

  deleteSchedule(schedule: ScheduleItem) {
    if (confirm(`Bạn có chắc muốn xóa lịch trình này?`)) {
      this.schedulesList = this.schedulesList.filter(s => s.id !== schedule.id);
      this.applyFilters();
    }
  }

  // Count getters
  get totalCount() { return this.schedulesList.length; }
  get runningCount() { return this.schedulesList.filter(s => s.status === 'running').length; }
  get waitingCount() { return this.schedulesList.filter(s => s.status === 'waiting').length; }
  get completedCount() { return this.schedulesList.filter(s => s.status === 'completed').length; }
  get lockedCount() { return this.schedulesList.filter(s => s.status === 'locked').length; }

  // Helpers for displaying status in Vietnamese
  getStatusText(status: string) {
    switch (status) {
      case 'running': return 'Đang chạy';
      case 'waiting': return 'Chờ khởi hành';
      case 'completed': return 'Hoàn thành';
      case 'locked': return 'Đã khóa';
      default: return '';
    }
  }

  formatDate(d: string) {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return d;
  }
}
