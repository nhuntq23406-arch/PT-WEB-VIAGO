import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ToastService } from '../../../../shared/toast.service';

interface CancelRefundRule {
  truocGio: number;
  phiHuy: number;
}

interface Policy {
  maCS: string;
  tenChinhSach: string;
  loaiChinhSach: string;
  trangThai: 'Đang áp dụng' | 'Đã khóa';
  ngayApDung: string;
  capNhatCuoi: string;
  nguoiThucHien: string;
  noiDungChinhSach: string;
  mocThoiGianHuyVe?: CancelRefundRule[];
}

const MOCK_POLICIES: Policy[] = [
  {
    "maCS": "CS00001",
    "tenChinhSach": "Chính sách đặt vé và giữ chỗ trực tuyến",
    "loaiChinhSach": "Chính sách đặt vé",
    "ngayApDung": "2026-07-03",
    "capNhatCuoi": "2026-07-03 09:00",
    "trangThai": "Đang áp dụng",
    "nguoiThucHien": "Ban Vận Hành",
    "noiDungChinhSach": "<p>Hệ thống cho phép người dùng đặt vé trực tuyến thông qua website và ứng dụng di động ViAGO. Khi thực hiện giao dịch, quý khách vui lòng lưu ý:</p><ul><li>Hệ thống hỗ trợ giữ ghế tối đa 15 phút sau khi lệnh đặt chỗ được khởi tạo thành công.</li><li>Đơn hàng trong thời gian này sẽ ở trạng thái chờ thanh toán.</li><li>Hệ thống sẽ tự động hủy lệnh đặt vé nếu quá thời hạn 15 phút mà chưa nhận được xác nhận thanh toán thành công.</li><li>Quý khách yêu cầu cung cấp chính xác họ tên và số điện thoại liên lạc để nhận mã vé điện tử.</li><li>Khách hàng được quyền tự do chọn ghế theo sơ đồ thời gian thực được hiển thị trên hệ thống.</li><li>Nhà xe hoặc ban quản lý ViAGO có quyền điều chỉnh vị trí ghế trong các trường hợp đặc biệt (thay đổi xe, lỗi kỹ thuật ghế ngồi) nhưng vẫn đảm bảo đúng hạng vé đã đặt.</li></ul>"
  },
  {
    "maCS": "CS00002",
    "tenChinhSach": "Chính sách thay đổi và chỉnh sửa thông tin vé",
    "loaiChinhSach": "Chính sách chỉnh sửa vé",
    "ngayApDung": "2026-07-03",
    "capNhatCuoi": "2026-07-03 09:05",
    "trangThai": "Đang áp dụng",
    "nguoiThucHien": "Ban Vận Hành",
    "noiDungChinhSach": "<p>ViAGO hỗ trợ khách hàng thay đổi các thông tin cơ bản sau khi đã hoàn tất đặt vé:</p><ul><li>Chế độ chỉnh sửa chỉ áp dụng cho các vé đã thanh toán thành công.</li><li>Yêu cầu chỉnh sửa phải được thực hiện trước giờ xe khởi hành ít nhất 2 tiếng.</li><li>Mỗi mã vé chỉ được hỗ trợ chỉnh sửa tối đa 2 lần.</li><li>Quý khách được phép thay đổi: Thông tin liên hệ, ghi chú gửi nhà xe, điểm đón và điểm trả trong cùng lộ trình.</li><li>ViAGO không thu phí chỉnh sửa nếu quý khách đáp ứng đầy đủ các điều kiện nêu trên.</li></ul>"
  },
  {
    "maCS": "CS00003",
    "tenChinhSach": "Chính sách hủy vé và hoàn tiền cho hành khách",
    "loaiChinhSach": "Chính sách hoàn hủy",
    "ngayApDung": "2026-07-03",
    "capNhatCuoi": "2026-07-03 09:10",
    "trangThai": "Đang áp dụng",
    "nguoiThucHien": "Ban Vận Hành",
    "noiDungChinhSach": "<p>Chính sách hủy vé được quy định rõ ràng nhằm đảm bảo quyền lợi cho cả khách hàng và nhà xe:</p><ul><li>Điều kiện được hủy vé phụ thuộc vào quy định riêng của từng nhà xe được hiển thị tại bước đặt vé.</li><li>Số tiền hoàn lại được tính dựa trên thời gian quý khách gửi yêu cầu hủy vé (thường giảm dần theo thời gian sát giờ khởi hành).</li><li>Quy trình hoàn tiền sẽ được thực hiện tự động về đúng tài khoản thanh toán ban đầu của khách hàng.</li><li>Trạng thái xử lý hoàn tiền sẽ được cập nhật liên tục qua email hoặc trong phần \"Lịch sử đặt vé\".</li><li>Các trường hợp không được hoàn tiền bao gồm: Vé hủy sau giờ khởi hành, vé khuyến mãi không áp dụng hoàn hủy, khách hàng không có mặt tại điểm đón đúng giờ.</li></ul>",
    "mocThoiGianHuyVe": [
      { truocGio: 24, phiHuy: 0 },
      { truocGio: 12, phiHuy: 50 },
      { truocGio: 0, phiHuy: 100 }
    ]
  },
  {
    "maCS": "CS00004",
    "tenChinhSach": "Điều khoản dịch vụ và cam kết bồi thường",
    "loaiChinhSach": "Điều khoản dịch vụ",
    "ngayApDung": "2026-07-03",
    "capNhatCuoi": "2026-07-03 09:15",
    "trangThai": "Đang áp dụng",
    "nguoiThucHien": "Ban Vận Hành",
    "noiDungChinhSach": "<p>ViAGO cam kết mang đến trải nghiệm di chuyển an toàn và thuận tiện nhất:</p><ul><li>Chúng tôi cam kết giữ đúng chỗ và loại xe cho khách hàng sở hữu mã vé hợp lệ.</li><li>Trong trường hợp xe gặp sự cố kỹ thuật, ViAGO và nhà xe sẽ hỗ trợ chuyển quý khách sang chuyến gần nhất có thể.</li><li>Hoàn tiền 100% giá trị vé nếu nhà xe không thể cung cấp dịch vụ như đã cam kết và không có phương án thay thế phù hợp.</li><li>Tặng thêm voucher giảm giá đền bù cho các sự cố gây trễ giờ nghiêm trọng do lỗi chủ quan từ nhà xe.</li><li>Các trường hợp bất khả kháng (thiên tai, dịch bệnh, tắc đường do tai nạn giao thông, quy định của cơ quan nhà nước) sẽ được miễn trừ trách nhiệm bồi thường.</li></ul>"
  },
  {
    "maCS": "CS00005",
    "tenChinhSach": "Chính sách cộng đồng về đánh giá và phản hồi chuyến đi",
    "loaiChinhSach": "Chính sách cộng đồng",
    "ngayApDung": "2026-07-03",
    "capNhatCuoi": "2026-07-03 09:20",
    "trangThai": "Đang áp dụng",
    "nguoiThucHien": "Ban Vận Hành",
    "noiDungChinhSach": "<p>Chúng tôi luôn lắng nghe ý kiến từ khách hàng để cải thiện chất lượng dịch vụ:</p><ul><li>Chỉ những khách hàng đã thực sự hoàn thành chuyến đi mới có quyền thực hiện đánh giá.</li><li>Mỗi mã vé chỉ được gửi đánh giá một lần duy nhất.</li><li>Nội dung đánh giá bằng văn bản có giới hạn độ dài tối thiểu và tối đa theo quy định của hệ thống.</li><li>Hệ thống cho phép đính kèm tối đa 3 hình ảnh thực tế về chuyến đi.</li><li>Hệ thống tự động kiểm duyệt và ẩn các nội dung chứa từ ngữ phản cảm hoặc thông tin cá nhân trái phép.</li><li>Mọi đánh giá từ 1–2 sao sẽ được hệ thống tự động chuyển tiếp đến bộ phận Chăm sóc khách hàng để xử lý và phản hồi trong vòng 24 giờ làm việc.</li></ul>"
  }
];

@Component({
  selector: 'app-chinh-sach',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './chinh-sach.html',
  styleUrl: './chinh-sach.css'
})
export class ChinhSachComponent implements OnInit {
  quillModules = {
    toolbar: '#quill-toolbar'
  };

  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];

  // Tab & Filters
  statusTabs = ['Tất cả', 'Đang áp dụng', 'Đã khóa'];
  currentTab = 'Tất cả'; // Status based filter tab
  searchText = '';
  filterLoai = 'Tất cả loại chính sách'; // Dropdown filter for policy types

  // Policy categories (dropdown options)
  categories = [
    'Chính sách đặt vé',
    'Chính sách chỉnh sửa vé',
    'Chính sách hoàn hủy',
    'Điều khoản dịch vụ',
    'Chính sách cộng đồng'
  ];
  filterSort = 'Mới nhất tạo trước';

  // Modals
  showCreateModal = false;
  showEditModal = false;
  showSuccessModal = false;
  successMessageTitle = '';
  successMessageBody = '';
  private successTimer: any = null;

  // Forms
  newPolicy: Partial<Policy> = {
    tenChinhSach: '',
    loaiChinhSach: 'Chính sách đặt vé',
    ngayApDung: new Date().toISOString().slice(0, 10),
    noiDungChinhSach: '',
    mocThoiGianHuyVe: []
  };
  createFormSubmitted = false;

  editingPolicy: Policy | null = null;
  editFormSubmitted = false;

  // Pagination
  itemsPerPage = 10;
  currentPage = 1;

  toastService = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.policies = [...MOCK_POLICIES];
    this.filterData();
  }

  // --- STATS GETTERS ---
  get totalPoliciesCount(): number {
    return this.policies.length;
  }
  get activePoliciesCount(): number {
    return this.policies.filter(p => p.trangThai === 'Đang áp dụng').length;
  }
  get lockedPoliciesCount(): number {
    return this.policies.filter(p => p.trangThai === 'Đã khóa').length;
  }

  // Card specific counts
  get countDatVe(): number {
    return this.policies.filter(p => p.loaiChinhSach === 'Chính sách đặt vé').length;
  }
  get countChinhSuaVe(): number {
    return this.policies.filter(p => p.loaiChinhSach === 'Chính sách chỉnh sửa vé').length;
  }
  get countHoanHuy(): number {
    return this.policies.filter(p => p.loaiChinhSach === 'Chính sách hoàn hủy').length;
  }
  get countDieuKhoan(): number {
    return this.policies.filter(p => p.loaiChinhSach === 'Điều khoản dịch vụ').length;
  }
  get countCongDong(): number {
    return this.policies.filter(p => p.loaiChinhSach === 'Chính sách cộng đồng').length;
  }

  // Count by status for tabs
  countByStatus(status: string): number {
    if (status === 'Tất cả') {
      return this.policies.length;
    }
    return this.policies.filter(p => p.trangThai === status).length;
  }

  // --- FILTERING ---
  selectTab(tab: string) {
    this.currentTab = tab;
    this.currentPage = 1;
    this.filterData();
  }

  filterData() {
    let result = [...this.policies];
    this.currentPage = 1;

    // Tab Filter (Status)
    if (this.currentTab === 'Đang áp dụng') {
      result = result.filter(p => p.trangThai === 'Đang áp dụng');
    } else if (this.currentTab === 'Đã khóa') {
      result = result.filter(p => p.trangThai === 'Đã khóa');
    }

    // Dropdown Filter (Policy Type)
    if (this.filterLoai !== 'Tất cả loại chính sách') {
      result = result.filter(p => p.loaiChinhSach === this.filterLoai);
    }

    // Search filter
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      result = result.filter(p => 
        p.maCS.toLowerCase().includes(search) ||
        p.tenChinhSach.toLowerCase().includes(search)
      );
    }

    // Sort based on selection
    if (this.filterSort === 'Mới nhất tạo trước') {
      result.sort((a, b) => b.capNhatCuoi.localeCompare(a.capNhatCuoi));
    } else if (this.filterSort === 'Cũ nhất tạo trước') {
      result.sort((a, b) => a.capNhatCuoi.localeCompare(b.capNhatCuoi));
    } else if (this.filterSort === 'Theo tiêu đề A-Z') {
      result.sort((a, b) => a.tenChinhSach.localeCompare(b.tenChinhSach));
    }

    this.filteredPolicies = result;
    this.cdr.detectChanges();
  }

  // --- PAGINATION GETTERS ---
  get totalPages(): number {
    return Math.ceil(this.filteredPolicies.length / this.itemsPerPage) || 1;
  }

  get paginatedPolicies(): Policy[] {
    return this.filteredPolicies.slice(this.startIndex, this.endIndex);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredPolicies.length);
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
    const windowSize = 3;
    let start = this.currentPage - Math.floor(windowSize / 2);
    let end = this.currentPage + Math.floor(windowSize / 2);

    if (start < 1) {
      start = 1;
      end = Math.min(this.totalPages, windowSize);
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, this.totalPages - windowSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  // --- TIMELINE RULE ACTIONS ---
  addRule(policy: Partial<Policy>) {
    if (!policy.mocThoiGianHuyVe) {
      policy.mocThoiGianHuyVe = [];
    }
    policy.mocThoiGianHuyVe.push({ truocGio: 0, phiHuy: 0 });
    this.cdr.detectChanges();
  }

  removeRule(policy: Partial<Policy>, index: number) {
    if (policy.mocThoiGianHuyVe) {
      policy.mocThoiGianHuyVe.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  // --- TYPE DROPDOWN CHANGE ---
  onTypeChange(policy: Partial<Policy>) {
    if (policy.loaiChinhSach === 'Chính sách hoàn hủy') {
      if (!policy.mocThoiGianHuyVe || policy.mocThoiGianHuyVe.length === 0) {
        policy.mocThoiGianHuyVe = [
          { truocGio: 24, phiHuy: 0 },
          { truocGio: 12, phiHuy: 50 },
          { truocGio: 0, phiHuy: 100 }
        ];
      }
    } else {
      policy.mocThoiGianHuyVe = [];
    }
    this.cdr.detectChanges();
  }

  // --- MODAL ACTIONS ---
  openCreateModal() {
    this.newPolicy = {
      tenChinhSach: '',
      loaiChinhSach: 'Chính sách đặt vé',
      ngayApDung: new Date().toISOString().slice(0, 10),
      noiDungChinhSach: '',
      mocThoiGianHuyVe: []
    };
    this.createFormSubmitted = false;
    this.showCreateModal = true;
    this.cdr.detectChanges();
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.cdr.detectChanges();
  }

  saveNewPolicy() {
    this.createFormSubmitted = true;
    if (!this.newPolicy.tenChinhSach?.trim()) {
      this.toastService.showError('Vui lòng nhập tên chính sách');
      return;
    }
    if (!this.newPolicy.noiDungChinhSach?.trim()) {
      this.toastService.showError('Vui lòng nhập nội dung chính sách');
      return;
    }

    const newId = 'CS' + String(this.policies.length + 1).padStart(5, '0');
    
    // Automatically generate list text for CancelRefund if selected
    if (this.newPolicy.loaiChinhSach === 'Chính sách hoàn hủy' && this.newPolicy.mocThoiGianHuyVe && this.newPolicy.mocThoiGianHuyVe.length > 0) {
      let listHtml = '<p>Chính sách hủy vé được quy định rõ ràng nhằm đảm bảo quyền lợi cho cả khách hàng và nhà xe:</p><ul class="policy-list">';
      const sortedRules = [...this.newPolicy.mocThoiGianHuyVe].sort((a, b) => b.truocGio - a.truocGio);
      sortedRules.forEach(r => {
        const refundPct = 100 - r.phiHuy;
        if (r.truocGio > 0) {
          listHtml += `<li>Hủy vé trước ${r.truocGio}h: Hành khách được hoàn lại ${refundPct}% giá vé gốc.</li>`;
        } else {
          listHtml += `<li>Hủy vé sát giờ khởi hành: Hành khách được hoàn lại ${refundPct}% giá vé gốc (Phí hủy ${r.phiHuy}%).</li>`;
        }
      });
      listHtml += '</ul>';
      this.newPolicy.noiDungChinhSach = listHtml;
    }

    const policyToSave: Policy = {
      maCS: newId,
      tenChinhSach: this.newPolicy.tenChinhSach,
      loaiChinhSach: this.newPolicy.loaiChinhSach!,
      trangThai: 'Đang áp dụng',
      ngayApDung: this.newPolicy.ngayApDung!,
      capNhatCuoi: new Date().toISOString().slice(0, 16).replace('T', ' '),
      nguoiThucHien: 'Ban Vận Hành',
      noiDungChinhSach: this.newPolicy.noiDungChinhSach,
      mocThoiGianHuyVe: this.newPolicy.mocThoiGianHuyVe
    };

    this.policies.unshift(policyToSave);
    this.filterData();
    this.closeCreateModal();
    this.showCenteredSuccess(
      'Tạo chính sách thành công',
      `Chính sách ${newId} đã được thêm vào danh sách.`
    );
  }

  openEditModal(p: Policy) {
    this.editingPolicy = JSON.parse(JSON.stringify(p)); // Deep clone
    this.editFormSubmitted = false;
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingPolicy = null;
    this.cdr.detectChanges();
  }

  saveEditPolicy() {
    this.editFormSubmitted = true;
    if (!this.editingPolicy?.tenChinhSach?.trim()) {
      this.toastService.showError('Vui lòng nhập tên chính sách');
      return;
    }
    if (!this.editingPolicy?.noiDungChinhSach?.trim()) {
      this.toastService.showError('Vui lòng nhập nội dung chính sách');
      return;
    }

    // Automatically generate list text for CancelRefund if selected
    if (this.editingPolicy.loaiChinhSach === 'Chính sách hoàn hủy' && this.editingPolicy.mocThoiGianHuyVe && this.editingPolicy.mocThoiGianHuyVe.length > 0) {
      let listHtml = '<p>Chính sách hủy vé được quy định rõ ràng nhằm đảm bảo quyền lợi cho cả khách hàng và nhà xe:</p><ul class="policy-list">';
      const sortedRules = [...this.editingPolicy.mocThoiGianHuyVe].sort((a, b) => b.truocGio - a.truocGio);
      sortedRules.forEach(r => {
        const refundPct = 100 - r.phiHuy;
        if (r.truocGio > 0) {
          listHtml += `<li>Hủy vé trước ${r.truocGio}h: Hành khách được hoàn lại ${refundPct}% giá vé gốc.</li>`;
        } else {
          listHtml += `<li>Hủy vé sát giờ khởi hành: Hành khách được hoàn lại ${refundPct}% giá vé gốc (Phí hủy ${r.phiHuy}%).</li>`;
        }
      });
      listHtml += '</ul>';
      this.editingPolicy.noiDungChinhSach = listHtml;
    }

    const idx = this.policies.findIndex(p => p.maCS === this.editingPolicy!.maCS);
    if (idx !== -1) {
      const original = this.policies[idx];
      const originalRules = original.mocThoiGianHuyVe || [];
      const currentRules = this.editingPolicy.mocThoiGianHuyVe || [];
      let rulesChanged = originalRules.length !== currentRules.length;
      if (!rulesChanged) {
        rulesChanged = originalRules.some((r, i) => r.truocGio !== currentRules[i].truocGio || r.phiHuy !== currentRules[i].phiHuy);
      }

      const hasChanged = 
        original.tenChinhSach !== this.editingPolicy.tenChinhSach ||
        original.loaiChinhSach !== this.editingPolicy.loaiChinhSach ||
        original.trangThai !== this.editingPolicy.trangThai ||
        original.noiDungChinhSach !== this.editingPolicy.noiDungChinhSach ||
        rulesChanged;

      if (!hasChanged) {
        this.toastService.showError('Không có dữ liệu nào thay đổi');
        return;
      }

      this.editingPolicy.capNhatCuoi = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const policyCode = this.editingPolicy.maCS;
      this.policies[idx] = { ...this.editingPolicy! };
      this.filterData();
      this.closeEditModal();
      this.showCenteredSuccess(
        'Cập nhật thành công',
        `Chính sách ${policyCode} đã được lưu thông tin mới.`
      );
    }
  }

  togglePolicyStatus() {
    if (this.editingPolicy) {
      const nextStatus = this.editingPolicy.trangThai === 'Đang áp dụng' ? 'Đã khóa' : 'Đang áp dụng';
      const idx = this.policies.findIndex(p => p.maCS === this.editingPolicy!.maCS);

      if (idx !== -1) {
        this.policies[idx] = {
          ...this.policies[idx],
          trangThai: nextStatus,
          capNhatCuoi: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };
        this.filterData();
      }

      const policyCode = this.editingPolicy.maCS;
      this.closeEditModal();
      this.showCenteredSuccess(
        nextStatus === 'Đã khóa' ? 'Đã khóa chính sách' : 'Đã mở khóa chính sách',
        `Trạng thái của ${policyCode} đã được cập nhật thành ${nextStatus}.`
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
