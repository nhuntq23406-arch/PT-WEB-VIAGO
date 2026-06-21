import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dat-ve-moi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dat-ve-moi.html',
  styleUrl: './dat-ve-moi.css',
})
export class DatVeMoiComponent implements OnInit {
  currentStep = 1;

  routes = [
    { id: 'T001', name: 'TP.HCM ↔ Đà Lạt', duration: '6h 30p', price: 180000 },
    { id: 'T002', name: 'TP.HCM ↔ Nha Trang', duration: '9h 00p', price: 220000 },
    { id: 'T003', name: 'TP.HCM ↔ Cần Thơ', duration: '3h 15p', price: 120000 },
    { id: 'T004', name: 'TP.HCM ↔ Vũng Tàu', duration: '2h 30p', price: 90000 },
    { id: 'T005', name: 'Đà Lạt ↔ Nha Trang', duration: '4h 00p', price: 150000 },
    { id: 'T006', name: 'Nha Trang ↔ Đà Nẵng', duration: '8h 00p', price: 200000 },
    { id: 'T007', name: 'Cần Thơ ↔ Rạch Giá', duration: '2h 00p', price: 80000 },
    { id: 'T008', name: 'Đà Lạt ↔ Buôn Ma Thuột', duration: '5h 00p', price: 160000 },
    // Chiều ngược lại
    { id: 'T009', name: 'Đà Lạt ↔ TP.HCM', duration: '6h 30p', price: 180000 },
    { id: 'T010', name: 'Nha Trang ↔ TP.HCM', duration: '9h 00p', price: 220000 },
    { id: 'T011', name: 'Cần Thơ ↔ TP.HCM', duration: '3h 15p', price: 120000 },
    { id: 'T012', name: 'Vũng Tàu ↔ TP.HCM', duration: '2h 30p', price: 90000 },
    { id: 'T013', name: 'Nha Trang ↔ Đà Lạt', duration: '4h 00p', price: 150000 },
    { id: 'T014', name: 'Đà Nẵng ↔ Nha Trang', duration: '8h 00p', price: 200000 },
    { id: 'T015', name: 'Rạch Giá ↔ Cần Thơ', duration: '2h 00p', price: 80000 },
    { id: 'T016', name: 'Buôn Ma Thuột ↔ Đà Lạt', duration: '5h 00p', price: 160000 },
  ];

  seatTypes = [
    { id: 'ghe', name: 'Ghế ngồi', multiplier: 1 },
    { id: 'giuong', name: 'Giường nằm', multiplier: 1.3 },
    { id: 'limousine', name: 'Limousine VIP', multiplier: 1.8 },
  ];

  allSeats: string[] = [];
  takenSeats = ['A1', 'A2', 'B3', 'C1', 'D4', 'E2'];
  selectedSeats: string[] = [];

  departureTimes = ['06:00', '08:30', '10:00', '13:00', '15:30', '20:00', '22:30'];
  pickupPoints: string[] = [];
  dropoffPoints: string[] = [];

  booking = {
    routeId: '', date: '', departureTime: '', seatType: 'ghe',
    passengerName: '', passengerPhone: '', passengerEmail: '',
    pickupPoint: '', dropoffPoint: '', note: '',
  };

  get selectedRoute() { return this.routes.find(r => r.id === this.booking.routeId); }
  get selectedSeatType() { return this.seatTypes.find(s => s.id === this.booking.seatType); }
  get totalPrice() {
    if (!this.selectedRoute || !this.selectedSeatType || this.selectedSeats.length === 0) return 0;
    return this.selectedRoute.price * this.selectedSeatType.multiplier * this.selectedSeats.length;
  }

  ngOnInit() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    for (const row of rows) for (let col = 1; col <= 4; col++) this.allSeats.push(`${row}${col}`);
    this.booking.date = new Date().toISOString().split('T')[0];
  }

  isTaken(seat: string) { return this.takenSeats.includes(seat); }
  isSelected(seat: string) { return this.selectedSeats.includes(seat); }
  toggleSeat(seat: string) {
    if (this.isTaken(seat)) return;
    const i = this.selectedSeats.indexOf(seat);
    if (i > -1) this.selectedSeats.splice(i, 1); else this.selectedSeats.push(seat);
  }

  onRouteChange() {
    const route = this.routes.find(r => r.id === this.booking.routeId);
    if (!route) {
      this.pickupPoints = [];
      this.dropoffPoints = [];
      return;
    }

    let parts = route.name.split('↔').map(s => s.trim());
    if (parts.length < 2) {
      parts = route.name.split('→').map(s => s.trim());
    }
    const startCity = parts[0] || '';
    const endCity = parts[1] || '';

    const cityPoints: { [key: string]: string[] } = {
      'TP.HCM': ['Bến xe Miền Đông', 'Quận 1', 'Thủ Đức'],
      'Đà Lạt': ['Bến xe Đà Lạt', 'Chợ Đà Lạt', 'Quảng trường Lâm Viên'],
      'Nha Trang': ['Bến xe Nha Trang', 'Trung tâm Nha Trang', 'Bãi biển Trần Phú'],
      'Cần Thơ': ['Bến xe Cần Thơ', 'Bến Ninh Kiều', 'Quận Cái Răng'],
      'Vũng Tàu': ['Bến xe Vũng Tàu', 'Bãi Sau Vũng Tàu', 'Bãi Trước'],
      'Đà Nẵng': ['Bến xe Đà Nẵng', 'Quận Hải Châu', 'Cầu Rồng'],
      'Rạch Giá': ['Bến xe Rạch Giá', 'Bến tàu Rạch Giá', 'Quận Rạch Giá'],
      'Buôn Ma Thuột': ['Bến xe Buôn Ma Thuột', 'Ngã sáu Buôn Ma Thuột']
    };

    this.pickupPoints = cityPoints[startCity] || ['Điểm đón chính', 'Điểm đón trung tâm'];
    this.dropoffPoints = cityPoints[endCity] || ['Điểm trả chính', 'Điểm trả trung tâm'];
  }

  next() { if (this.currentStep < 4) this.currentStep++; }
  prev() { if (this.currentStep > 1) this.currentStep--; }

  submit() {
    alert(`✓ Đặt vé thành công!\nHành khách: ${this.booking.passengerName}\nSĐT: ${this.booking.passengerPhone}\nTổng tiền: ${this.totalPrice.toLocaleString('vi-VN')}đ`);
    this.currentStep = 1;
    this.selectedSeats = [];
    this.booking = { routeId: '', date: new Date().toISOString().split('T')[0], departureTime: '', seatType: 'ghe', passengerName: '', passengerPhone: '', passengerEmail: '', pickupPoint: '', dropoffPoint: '', note: '' };
  }
}
