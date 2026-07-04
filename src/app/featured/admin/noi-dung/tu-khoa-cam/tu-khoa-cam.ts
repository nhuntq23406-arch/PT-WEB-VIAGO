import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/toast.service';

interface Keyword {
  maTuKhoa: string;
  noiDung: string;
  mucDoViPham: 'Nặng' | 'Trung bình' | 'Nhẹ';
  moTaMucDo: string;
  trangThai: 'Đang áp dụng' | 'Đã khóa';
  capNhatCuoi: string;
  nguoiThucHien: string;
}

const MOCK_KEYWORDS: Keyword[] = [
  {
    maTuKhoa: 'TKC00001',
    noiDung: 'lừa đảo',
    mucDoViPham: 'Nặng',
    moTaMucDo: 'Chặn gửi, bắt buộc nhập lại',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:15',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00002',
    noiDung: 'quỵt tiền',
    mucDoViPham: 'Nặng',
    moTaMucDo: 'Chặn gửi, bắt buộc nhập lại',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:17',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00003',
    noiDung: 'đm',
    mucDoViPham: 'Nặng',
    moTaMucDo: 'Chặn gửi, bắt buộc nhập lại',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:20',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00004',
    noiDung: 'chửi thề',
    mucDoViPham: 'Trung bình',
    moTaMucDo: 'Yêu cầu chỉnh sửa nội dung',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:22',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00005',
    noiDung: 'ăn chặn',
    mucDoViPham: 'Nặng',
    moTaMucDo: 'Chặn gửi, bắt buộc nhập lại',
    trangThai: 'Đã khóa',
    capNhatCuoi: '2026-07-03 10:25',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00006',
    noiDung: 'vcl',
    mucDoViPham: 'Trung bình',
    moTaMucDo: 'Yêu cầu chỉnh sửa nội dung',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:30',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00007',
    noiDung: 'nhà xe rách',
    mucDoViPham: 'Nhẹ',
    moTaMucDo: 'Nhắc nhở vi phạm (không chặn)',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:32',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00008',
    noiDung: 'tài xế mất dạy',
    mucDoViPham: 'Trung bình',
    moTaMucDo: 'Yêu cầu chỉnh sửa nội dung',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:35',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00009',
    noiDung: 'xe bẩn',
    mucDoViPham: 'Nhẹ',
    moTaMucDo: 'Nhắc nhở vi phạm (không chặn)',
    trangThai: 'Đang áp dụng',
    capNhatCuoi: '2026-07-03 10:38',
    nguoiThucHien: 'Ban Vận Hành'
  },
  {
    maTuKhoa: 'TKC00010',
    noiDung: 'chạy ẩu',
    mucDoViPham: 'Nhẹ',
    moTaMucDo: 'Nhắc nhở vi phạm (không chặn)',
    trangThai: 'Đã khóa',
    capNhatCuoi: '2026-07-03 10:40',
    nguoiThucHien: 'Ban Vận Hành'
  }
];

@Component({
  selector: 'app-tu-khoa-cam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tu-khoa-cam.html',
  styleUrl: './tu-khoa-cam.css'
})
export class TuKhoaCamComponent implements OnInit {
  Math = Math;
  keywords: Keyword[] = [];
  filteredKeywords: Keyword[] = [];

  // Tabs and Filters
  currentTab = 'Tất cả';
  searchText = '';
  filterMucDo = 'Tất cả mức độ';
  filterSort = 'Mới nhất tạo trước';

  // Modals
  showCreateModal = false;
  showEditModal = false;
  showSuccessModal = false;
  successMessageTitle = '';
  successMessageBody = '';
  private successTimer: ReturnType<typeof setTimeout> | null = null;

  // Forms
  newKeyword: Partial<Keyword> = { noiDung: '', mucDoViPham: 'Trung bình' };
  createFormSubmitted = false;

  editingKeyword: Keyword | null = null;
  editFormSubmitted = false;

  // Pagination fields
  itemsPerPage = 10;
  currentPage = 1;

  toastService = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.keywords = [...MOCK_KEYWORDS];
    this.filterData();
  }

  // --- STATS GETTERS ---
  get totalKeywords(): number {
    return this.keywords.length;
  }
  private isActiveStatus(status: string): boolean {
    return status === 'Đang áp dụng';
  }

  get totalActive(): number {
    return this.keywords.filter(k => this.isActiveStatus(k.trangThai)).length;
  }
  get totalLocked(): number {
    return this.keywords.filter(k => !this.isActiveStatus(k.trangThai)).length;
  }
  get totalNang(): number {
    return this.keywords.filter(k => k.mucDoViPham === 'Nặng').length;
  }
  get totalTrungBinh(): number {
    return this.keywords.filter(k => k.mucDoViPham === 'Trung bình').length;
  }
  get totalNhe(): number {
    return this.keywords.filter(k => k.mucDoViPham === 'Nhẹ').length;
  }

  // --- FILTERING ---
  selectTab(tab: string) {
    this.currentTab = tab;
    this.currentPage = 1; // Reset to page 1
    this.filterData();
  }

  filterData() {
    let result = [...this.keywords];
    this.currentPage = 1;

    // Tab Filter
    if (this.currentTab === 'Đang áp dụng') {
      result = result.filter(k => this.isActiveStatus(k.trangThai));
    } else if (this.currentTab === 'Đã khóa') {
      result = result.filter(k => !this.isActiveStatus(k.trangThai));
    }

    // Dropdown Filter
    if (this.filterMucDo !== 'Tất cả mức độ') {
      result = result.filter(k => k.mucDoViPham === this.filterMucDo);
    }

    // Search
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      result = result.filter(k => 
        k.maTuKhoa.toLowerCase().includes(search) || 
        k.noiDung.toLowerCase().includes(search)
      );
    }

    // Sort based on selection
    if (this.filterSort === 'Mới nhất tạo trước') {
      result.sort((a, b) => b.capNhatCuoi.localeCompare(a.capNhatCuoi));
    } else if (this.filterSort === 'Cũ nhất tạo trước') {
      result.sort((a, b) => a.capNhatCuoi.localeCompare(b.capNhatCuoi));
    } else if (this.filterSort === 'Theo từ khóa A-Z') {
      result.sort((a, b) => a.noiDung.localeCompare(b.noiDung));
    }

    this.filteredKeywords = result;
  }

  // --- PAGINATION GETTERS ---
  get totalPages(): number {
    return Math.ceil(this.filteredKeywords.length / this.itemsPerPage) || 1;
  }

  get paginatedKeywords(): Keyword[] {
    return this.filteredKeywords.slice(this.startIndex, this.endIndex);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredKeywords.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private parseDateTime(value: string): Date {
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    return new Date(normalized);
  }

  // --- MODAL ACTIONS ---
  openCreateModal() {
    this.newKeyword = { noiDung: '', mucDoViPham: 'Trung bình' };
    this.createFormSubmitted = false;
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  saveNewKeyword() {
    this.createFormSubmitted = true;
    if (!this.newKeyword.noiDung?.trim()) {
      this.toastService.showError('Vui lòng nhập nội dung từ khóa');
      return;
    }

    let moTa = 'Nhắc nhở vi phạm (không chặn)';
    if (this.newKeyword.mucDoViPham === 'Nặng') moTa = 'Chặn gửi, bắt buộc nhập lại';
    else if (this.newKeyword.mucDoViPham === 'Trung bình') moTa = 'Yêu cầu chỉnh sửa nội dung';

    const newId = 'TKC' + String(this.keywords.length + 1).padStart(5, '0');
    this.keywords.unshift({
      maTuKhoa: newId,
      noiDung: this.newKeyword.noiDung,
      mucDoViPham: this.newKeyword.mucDoViPham as any,
      moTaMucDo: moTa,
      trangThai: 'Đang áp dụng',
      capNhatCuoi: new Date().toISOString().slice(0, 16).replace('T', ' '),
      nguoiThucHien: 'Ban Vận Hành'
    });
    
    this.filterData();
    this.closeCreateModal();
    this.showCenteredSuccess(
      'Tạo từ khóa thành công',
      `Từ khóa ${newId} đã được thêm vào danh sách kiểm duyệt.`
    );
  }

  openEditModal(kw: Keyword) {
    this.editingKeyword = { ...kw };
    this.editFormSubmitted = false;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingKeyword = null;
  }

  saveEditKeyword() {
    this.editFormSubmitted = true;
    if (!this.editingKeyword?.noiDung?.trim()) {
      this.toastService.showError('Vui lòng nhập nội dung từ khóa');
      return;
    }

    const idx = this.keywords.findIndex(k => k.maTuKhoa === this.editingKeyword!.maTuKhoa);
    if (idx !== -1) {
      const original = this.keywords[idx];
      const hasChanged = 
        original.noiDung !== this.editingKeyword.noiDung ||
        original.mucDoViPham !== this.editingKeyword.mucDoViPham ||
        original.trangThai !== this.editingKeyword.trangThai;

      if (!hasChanged) {
        this.toastService.showError('Không có dữ liệu nào thay đổi');
        return;
      }

      let moTa = 'Nhắc nhở vi phạm (không chặn)';
      if (this.editingKeyword.mucDoViPham === 'Nặng') moTa = 'Chặn gửi, bắt buộc nhập lại';
      else if (this.editingKeyword.mucDoViPham === 'Trung bình') moTa = 'Yêu cầu chỉnh sửa nội dung';

      this.editingKeyword.moTaMucDo = moTa;
      this.editingKeyword.capNhatCuoi = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const keywordCode = this.editingKeyword.maTuKhoa;
      this.keywords[idx] = { ...this.editingKeyword! };
      this.filterData();
      this.closeEditModal();
      this.showCenteredSuccess(
        'Cập nhật thành công',
        `Từ khóa ${keywordCode} đã được lưu thông tin mới.`
      );
    }
  }

  toggleKeywordStatus() {
    if (this.editingKeyword) {
      const nextStatus = this.editingKeyword.trangThai === 'Đang áp dụng' ? 'Đã khóa' : 'Đang áp dụng';
      const idx = this.keywords.findIndex(k => k.maTuKhoa === this.editingKeyword!.maTuKhoa);

      if (idx !== -1) {
        this.keywords[idx] = {
          ...this.keywords[idx],
          trangThai: nextStatus,
          capNhatCuoi: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };
        this.filterData();
      }

      const keywordCode = this.editingKeyword.maTuKhoa;
      this.closeEditModal();
      this.showCenteredSuccess(
        nextStatus === 'Đã khóa' ? 'Đã khóa từ khóa' : 'Đã kích hoạt lại từ khóa',
        `Trạng thái của ${keywordCode} đã được cập nhật thành ${nextStatus}.`
      );
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = null;
    }
    this.cdr.detectChanges();
  }

  private showCenteredSuccess(title: string, body: string) {
    this.successMessageTitle = title;
    this.successMessageBody = body;
    this.showSuccessModal = true;
    this.cdr.detectChanges();

    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }

    this.successTimer = setTimeout(() => this.closeSuccessModal(), 2000);
  }
}
