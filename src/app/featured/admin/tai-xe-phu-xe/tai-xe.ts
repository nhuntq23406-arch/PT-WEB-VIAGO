import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Personnel {
  id: number;
  name: string;
  role: 'Tài xế' | 'Phụ xe';
  dob: string;
  phone: string;
  licenseClass: string;
  licenseExpiry: string;
  status: 'Đang làm việc' | 'Nghỉ phép' | 'Đã khóa';
}

@Component({
  selector: 'app-tai-xe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tai-xe.html',
  styleUrls: ['./tai-xe.css']
})
export class TaiXeComponent implements OnInit {
  activeTab: 'Tất cả' | 'Tài xế' | 'Phụ xe' | 'Đã khóa' = 'Tất cả';
  searchQuery: string = '';
  roleFilter: string = 'Tất cả';
  licenseFilter: string = 'Tất cả';
  statusFilter: string = 'Tất cả';

  isModalOpen = false;
  isEditMode = false;
  currentPersonnel: any = {};
  isUploadingAvatar = false;
  isUploadingLicense = false;
  errors: any = {};

  roleOptions = ['Tất cả', 'Tài xế', 'Phụ xe'];
  licenseOptions = ['Tất cả', 'B2', 'C', 'D', 'E'];
  statusOptions = ['Tất cả', 'Đang làm việc', 'Nghỉ phép', 'Đã khóa'];

  allPersonnel: Personnel[] = [
    { id: 1, name: 'Nguyễn Văn Minh', role: 'Tài xế', dob: '15/03/1985', phone: '0901234567', licenseClass: 'E', licenseExpiry: '20/08/2028', status: 'Đang làm việc' },
    { id: 2, name: 'Trần Quốc Huy', role: 'Tài xế', dob: '22/07/1988', phone: '0912345678', licenseClass: 'E', licenseExpiry: '14/11/2027', status: 'Đang làm việc' },
    { id: 3, name: 'Lê Hoàng Nam', role: 'Tài xế', dob: '10/12/1983', phone: '0933456789', licenseClass: 'E', licenseExpiry: '05/04/2029', status: 'Nghỉ phép' },
    { id: 4, name: 'Phạm Đức Thành', role: 'Tài xế', dob: '28/01/1990', phone: '0944567890', licenseClass: 'D', licenseExpiry: '18/09/2028', status: 'Đang làm việc' },
    { id: 5, name: 'Võ Thanh Tùng', role: 'Tài xế', dob: '07/05/1987', phone: '0965678901', licenseClass: 'D', licenseExpiry: '30/06/2027', status: 'Đang làm việc' },
    { id: 6, name: 'Nguyễn Văn Phúc', role: 'Phụ xe', dob: '12/09/1995', phone: '0976789012', licenseClass: 'B2', licenseExpiry: '15/05/2028', status: 'Đang làm việc' },
    { id: 7, name: 'Trần Minh Khang', role: 'Phụ xe', dob: '25/11/1998', phone: '0987890123', licenseClass: 'B2', licenseExpiry: '22/10/2027', status: 'Đang làm việc' },
    { id: 8, name: 'Lê Quốc Bảo', role: 'Phụ xe', dob: '18/02/1996', phone: '0398901234', licenseClass: 'C', licenseExpiry: '09/03/2029', status: 'Nghỉ phép' },
    { id: 9, name: 'Phan Gia Hưng', role: 'Phụ xe', dob: '04/06/1999', phone: '0389012345', licenseClass: 'B2', licenseExpiry: '28/12/2028', status: 'Đang làm việc' },
    { id: 10, name: 'Đặng Nhật Quang', role: 'Phụ xe', dob: '30/08/1997', phone: '0370123456', licenseClass: 'C', licenseExpiry: '17/07/2027', status: 'Đã khóa' },
  ];

  filteredPersonnel: Personnel[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.filterPersonnel();
  }

  // Helper methods for tab counts
  getTotalCount(): number {
    return this.allPersonnel.length;
  }

  getDriverCount(): number {
    return this.allPersonnel.filter(p => p.role === 'Tài xế' && p.status !== 'Đã khóa').length;
  }

  getAssistantCount(): number {
    return this.allPersonnel.filter(p => p.role === 'Phụ xe' && p.status !== 'Đã khóa').length;
  }

  getLockedCount(): number {
    return this.allPersonnel.filter(p => p.status === 'Đã khóa').length;
  }

  setTab(tab: 'Tất cả' | 'Tài xế' | 'Phụ xe' | 'Đã khóa') {
    this.activeTab = tab;
    this.filterPersonnel();
  }

  filterPersonnel() {
    this.filteredPersonnel = this.allPersonnel.filter(p => {
      // Filter by Tabs
      let matchesTab = true;
      if (this.activeTab === 'Tài xế') matchesTab = p.role === 'Tài xế' && p.status !== 'Đã khóa';
      else if (this.activeTab === 'Phụ xe') matchesTab = p.role === 'Phụ xe' && p.status !== 'Đã khóa';
      else if (this.activeTab === 'Đã khóa') matchesTab = p.status === 'Đã khóa';
      else matchesTab = true;

      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        p.phone.includes(this.searchQuery);

      const matchesRole = this.roleFilter === 'Tất cả' || p.role === this.roleFilter;
      const matchesLicense = this.licenseFilter === 'Tất cả' || p.licenseClass === this.licenseFilter;
      const matchesStatus = this.statusFilter === 'Tất cả' || p.status === this.statusFilter;

      return matchesTab && matchesSearch && matchesRole && matchesLicense && matchesStatus;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.roleFilter = 'Tất cả';
    this.licenseFilter = 'Tất cả';
    this.statusFilter = 'Tất cả';
    this.filterPersonnel();
  }

  openAddModal() {
    this.isEditMode = false;
    this.errors = {};
    this.currentPersonnel = {
      status: 'Đang làm việc',
      role: this.activeTab === 'Phụ xe' ? 'Phụ xe' : 'Tài xế',
      licenseClass: '',
      avatar: null,
      licenseImage: null
    };
    this.isModalOpen = true;
  }

  openEditModal(p: Personnel) {
    this.isEditMode = true;
    this.errors = {};
    this.currentPersonnel = { ...p };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePersonnel() {
    this.errors = {
      name: !this.currentPersonnel.name,
      phone: !this.currentPersonnel.phone,
      role: !this.currentPersonnel.role,
      licenseClass: !this.currentPersonnel.licenseClass,
      licenseExpiry: !this.currentPersonnel.licenseExpiry
    };

    if (Object.values(this.errors).some(Boolean)) return;

    if (this.isEditMode) {
      const index = this.allPersonnel.findIndex(p => p.id === this.currentPersonnel.id);
      if (index !== -1) this.allPersonnel[index] = this.currentPersonnel;
    } else {
      this.currentPersonnel.id = Math.max(0, ...this.allPersonnel.map(p => p.id)) + 1;
      this.allPersonnel.push(this.currentPersonnel);
    }
    this.filterPersonnel();
    this.closeModal();
  }

  onImageUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentPersonnel[field] = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(field: string) {
    this.currentPersonnel[field] = null;
  }

  toggleLock(p: Personnel) {
    const action = p.status === 'Đã khóa' ? 'mở khóa' : 'khóa';
    if (confirm(`Bạn có chắc chắn muốn ${action} nhân sự ${p.name}?`)) {
      p.status = p.status === 'Đã khóa' ? 'Đang làm việc' : 'Đã khóa';
      this.filterPersonnel();
    }
  }
}
