import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: string;
  seats: number;
  registrationExpiry: string;
  amenities: string[];
  status: 'Đang hoạt động' | 'Bảo trì' | 'Đã khóa';
}

@Component({
  selector: 'app-phuong-tien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phuong-tien.html',
  styleUrls: ['./phuong-tien.css']
})
export class PhuongTienComponent implements OnInit {
  activeTab: 'Tất cả' | 'Đang hoạt động' | 'Bảo trì' | 'Đã khóa' = 'Tất cả';
  searchQuery: string = '';
  selectedType: string = 'Tất cả loại xe';
  selectedStatus: string = 'Tất cả trạng thái';

  isModalOpen = false;
  isEditMode = false;
  currentVehicle: any = {};
  isUploadingReg = false;
  isUploadingIns = false;
  isUploadingVeh = false;
  errors: any = {};

  vehicleConfigs: { [key: string]: { floors: number, rows: number, seats: number } } = {
    'Limousine': { floors: 2, rows: 2, seats: 22 },
    'Giường nằm': { floors: 2, rows: 3, seats: 34 },
    'Cabin đôi': { floors: 2, rows: 2, seats: 24 }
  };

  amenitiesList = [
    { id: 'wifi', label: 'Wifi', icon: 'wifi' },
    { id: 'water', label: 'Nước uống', icon: 'local_drink' },
    { id: 'usb', label: 'Cổng sạc USB', icon: 'usb' },
    { id: 'massage', label: 'Ghế massage', icon: 'airline_seat_recline_extra' },
    { id: 'entertainment', label: 'Màn hình giải trí', icon: 'tv' },
    { id: 'wc', label: 'WC', icon: 'wc' },
    { id: 'blanket', label: 'Chăn gối', icon: 'hotel' }
  ];

  vehicleTypes = ['Tất cả loại xe', 'Limousine', 'Giường nằm', 'Cabin đôi'];
  statusOptions = ['Tất cả trạng thái', 'Đang hoạt động', 'Bảo trì', 'Đã khóa'];

  allVehicles: Vehicle[] = [
    { id: 1, name: 'VIAGO Limousine 01', licensePlate: '51B-123.45', type: 'Limousine', seats: 9, registrationExpiry: '15/12/2026', amenities: ['Wifi', 'Nước uống', 'Cổng sạc USB'], status: 'Đang hoạt động' },
    { id: 2, name: 'VIAGO Limousine 02', licensePlate: '51B-234.56', type: 'Limousine', seats: 9, registrationExpiry: '28/09/2026', amenities: ['Wifi', 'Ghế massage', 'Cổng sạc USB'], status: 'Đang hoạt động' },
    { id: 3, name: 'VIAGO Limousine 03', licensePlate: '51B-345.67', type: 'Limousine', seats: 9, registrationExpiry: '10/03/2027', amenities: ['Wifi', 'Nước uống', 'Màn hình giải trí'], status: 'Bảo trì' },
    { id: 4, name: 'VIAGO Giường Nằm 01', licensePlate: '51F-456.78', type: 'Giường nằm', seats: 34, registrationExpiry: '22/11/2026', amenities: ['Wifi', 'Chăn gối', 'WC'], status: 'Đang hoạt động' },
    { id: 5, name: 'VIAGO Giường Nằm 02', licensePlate: '51F-567.89', type: 'Giường nằm', seats: 34, registrationExpiry: '05/01/2027', amenities: ['Wifi', 'Màn hình giải trí', 'WC'], status: 'Đang hoạt động' },
    { id: 6, name: 'VIAGO Giường Nằm 03', licensePlate: '51F-678.90', type: 'Giường nằm', seats: 40, registrationExpiry: '18/08/2026', amenities: ['Wifi', 'Chăn gối', 'Cổng sạc USB'], status: 'Bảo trì' },
    { id: 7, name: 'VIAGO Cabin Đôi 01', licensePlate: '51F-789.12', type: 'Cabin đôi', seats: 24, registrationExpiry: '30/04/2027', amenities: ['Wifi', 'TV riêng', 'WC'], status: 'Đang hoạt động' },
    { id: 8, name: 'VIAGO Cabin Đôi 02', licensePlate: '51F-890.23', type: 'Cabin đôi', seats: 24, registrationExpiry: '12/06/2027', amenities: ['Wifi', 'TV riêng', 'Cổng sạc USB'], status: 'Đang hoạt động' },
    { id: 9, name: 'VIAGO Cabin Đôi 03', licensePlate: '51F-901.34', type: 'Cabin đôi', seats: 22, registrationExpiry: '25/10/2026', amenities: ['Wifi', 'TV riêng', 'Chăn gối', 'WC'], status: 'Đã khóa' },
    { id: 10, name: 'VIAGO Giường Nằm 04', licensePlate: '51F-112.45', type: 'Giường nằm', seats: 40, registrationExpiry: '14/02/2027', amenities: ['Wifi', 'Chăn gối', 'Màn hình giải trí'], status: 'Đang hoạt động' },
  ];

  filteredVehicles: Vehicle[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.filterVehicles();
  }

  setTab(tab: 'Tất cả' | 'Đang hoạt động' | 'Bảo trì' | 'Đã khóa') {
    this.activeTab = tab;
    this.filterVehicles();
  }

  filterVehicles() {
    this.filteredVehicles = this.allVehicles.filter(v => {
      const matchesTab = this.activeTab === 'Tất cả' || v.status === this.activeTab;
      const matchesSearch = !this.searchQuery || 
        v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        v.licensePlate.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedType === 'Tất cả loại xe' || v.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'Tất cả trạng thái' || v.status === this.selectedStatus;

      return matchesTab && matchesSearch && matchesType && matchesStatus;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedType = 'Tất cả loại xe';
    this.selectedStatus = 'Tất cả trạng thái';
    this.filterVehicles();
  }

  openAddModal() {
    this.isEditMode = false;
    this.errors = {};
    this.currentVehicle = {
      status: 'Đang hoạt động',
      type: '',
      seats: 0,
      amenities: [],
      registrationExpiry: '',
      registrationImage: null,
      insuranceImage: null,
      vehicleImage: null
    };
    this.isModalOpen = true;
  }

  openEditModal(vehicle: Vehicle) {
    this.isEditMode = true;
    this.errors = {};
    this.currentVehicle = { ...vehicle };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveVehicle() {
    this.errors = {
      name: !this.currentVehicle.name,
      licensePlate: !this.currentVehicle.licensePlate,
      type: !this.currentVehicle.type,
      registrationExpiry: !this.currentVehicle.registrationExpiry
    };

    if (Object.values(this.errors).some(Boolean)) return;

    if (this.isEditMode) {
      const index = this.allVehicles.findIndex(v => v.id === this.currentVehicle.id);
      if (index !== -1) this.allVehicles[index] = this.currentVehicle;
    } else {
      this.currentVehicle.id = Math.max(0, ...this.allVehicles.map(v => v.id)) + 1;
      this.allVehicles.push(this.currentVehicle);
    }
    this.filterVehicles();
    this.closeModal();
  }

  onVehicleTypeChange() {
    const config = this.vehicleConfigs[this.currentVehicle.type];
    if (config) {
      this.currentVehicle.seats = config.seats;
    }
  }

  toggleAmenity(label: string) {
    if (!this.currentVehicle.amenities) this.currentVehicle.amenities = [];
    const index = this.currentVehicle.amenities.indexOf(label);
    if (index === -1) {
      this.currentVehicle.amenities.push(label);
    } else {
      this.currentVehicle.amenities.splice(index, 1);
    }
  }

  hasAmenity(label: string): boolean {
    return this.currentVehicle.amenities?.includes(label) || false;
  }

  onImageUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentVehicle[field] = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(field: string) {
    this.currentVehicle[field] = null;
  }

  toggleStatus() {
    this.currentVehicle.status = this.currentVehicle.status === 'Đã khóa' ? 'Đang hoạt động' : 'Đã khóa';
  }
}
