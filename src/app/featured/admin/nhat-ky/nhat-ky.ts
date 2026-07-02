import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LogItem {
  id: string;
  name: string;
  username: string;
  role: string;
  action: string;
  status: 'Thành công' | 'Thất bại';
  time: string;
  ip: string;
  details: string;
  userAgent: string;
}

@Component({
  selector: 'app-nhat-ky',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nhat-ky.html',
  styleUrl: './nhat-ky.css',
})
export class NhatKy implements OnInit {
  // Stats
  totalLogsToday = 24;
  successfulLogins = 3;
  failedOperations = 0;
  ticketsBookedToday = 0;

  // Filter bindings
  searchQuery = '';
  selectedRole = 'all';
  selectedAction = 'all';
  selectedStatus = 'all';
  startDate = '';
  endDate = '';

  // Modal state
  selectedLog: LogItem | null = null;
  showDetailModal = false;

  selectedOperatorPhone = '';
  selectedOperatorCode = '';
  beforeStatus = '';
  afterStatus = '';
  isStateChange = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Logs list
  logs: LogItem[] = [];
  filteredLogs: LogItem[] = [];

  ngOnInit() {
    this.loadLogsFromEmployees();
  }

  loadLogsFromEmployees() {
    // 1. Get employees from local storage
    let employees: any[] = [];
    const saved = localStorage.getItem('viago_employees');
    if (saved) {
      employees = JSON.parse(saved);
    } else {
      // Fallback fallback if empty (will be initialized when visiting employee page)
      employees = [
        {
          code: 'NVDP100001',
          username: 'NVDP100001',
          name: 'Nguyen Van Dieu Phoi',
          defaultRole: 'Nhân viên điều phối',
          logs: [
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-06-28 21:15:20',
              desc: 'Thay đổi trạng thái tài khoản nhân viên Hoang Anh Tuan (Mã: BQL100001) sang Đã khóa',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656120907_KYKM9R'
            },
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-06-25 10:14:00',
              desc: 'Cập nhật thông tin cơ bản cho nhân viên NV002',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656109459_ACV24M'
            },
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-06-22 09:30:15',
              desc: 'Đồng bộ quyền hạn cho nhân viên mới',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656097969_NR2888'
            },
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-06-18 14:22:00',
              desc: 'Thay đổi chức vụ của nhân viên NV005',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656097875_E5YBDC'
            },
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-06-10 16:45:10',
              desc: 'Cập nhật thông tin liên hệ nhân viên NV007',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656097872_06J9IR'
            },
            {
              type: 'update',
              title: 'Quản lý tài khoản',
              time: '2026-05-15 08:30:00',
              desc: 'Xem danh sách tài khoản nhân viên',
              ip: '127.0.0.1',
              code: 'TXP_LOG_1782656097872_0QUG7N'
            }
          ]
        }
      ];
    }

    const tempLogs: LogItem[] = [];

    // 2. Map all employee logs
    employees.forEach((emp: any) => {
      const empLogs = emp.logs || [];
      empLogs.forEach((l: any) => {
        // Map roles to match uppercase in template
        let roleDisplay = (emp.defaultRole || 'NHÂN VIÊN').toUpperCase();
        if (roleDisplay === 'QUẢN TRỊ VIÊN') roleDisplay = 'QUẢN TRỊ VIÊN';
        else if (roleDisplay === 'BAN QUẢN LÝ') roleDisplay = 'BAN QUẢN LÝ';
        else if (roleDisplay === 'NHÂN VIÊN ĐIỀU PHỐI') roleDisplay = 'ĐIỀU PHỐI';
        else if (roleDisplay === 'NHÂN VIÊN BÁN VÉ') roleDisplay = 'BÁN VÉ';
        else if (roleDisplay === 'TÀI XẾ') roleDisplay = 'TÀI XẾ';

        tempLogs.push({
          id: l.code || `VIAGO_LOG_${Date.now()}`,
          name: emp.name,
          username: emp.username ? (emp.username.startsWith('@') ? emp.username : `@${emp.username}`) : '@NV',
          role: roleDisplay,
          action: l.title || 'Thao tác',
          status: l.desc && l.desc.toLowerCase().includes('thất bại') ? 'Thất bại' : 'Thành công',
          time: l.time || '2026-06-28 00:00:00',
          ip: l.ip || '127.0.0.1',
          details: l.desc || '',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
      });
    });

    // 3. Add static system/guest logs to enrich the view
    tempLogs.push({
      id: 'TXP_LOG_1782656082914_ERR998',
      name: 'Unknown User',
      username: '@guest',
      role: 'CHƯA XÁC ĐỊNH',
      action: 'Đăng nhập',
      status: 'Thất bại',
      time: '2026-06-28 21:10:05',
      ip: '192.168.1.50',
      details: 'Đăng nhập thất bại: Sai mật khẩu cho tài khoản test_user',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
    });

    // 4. Generate extra mock logs in the past to reach exactly 89 logs total.
    const targetTotal = 89;
    const currentCount = tempLogs.length;
    if (currentCount < targetTotal) {
      const extraNeeded = targetTotal - currentCount;
      const actionsList = [
        { action: 'Đăng ký', title: 'Đăng ký', desc: 'Đăng ký tài khoản khách hàng mới' },
        { action: 'Đăng nhập', title: 'Đăng nhập', desc: 'Đăng nhập vào hệ thống thành công' },
        { action: 'Đặt vé', title: 'Đặt vé', desc: 'Đặt vé thành công cho khách hàng, Mã vé: VIAGO_TKT_12345' },
        { action: 'Tra cứu vé', title: 'Tra cứu vé', desc: 'Tra cứu thông tin vé của khách hàng' },
        { action: 'Hủy vé', title: 'Hủy vé', desc: 'Hủy vé đặt thành công' },
        { action: 'Chỉnh sửa thông tin vé', title: 'Chỉnh sửa thông tin vé', desc: 'Thay đổi thông tin ghế ngồi' },
        { action: 'Đánh giá chuyến xe', title: 'Đánh giá chuyến xe', desc: 'Gửi đánh giá chuyến xe thành công' },
        { action: 'Đổi mật khẩu', title: 'Đổi mật khẩu', desc: 'Thay đổi mật khẩu hệ thống thành công' },
        { action: 'Cập nhật thông tin cá nhân', title: 'Cập nhật thông tin cá nhân', desc: 'Cập nhật thông tin cá nhân thành công' },
        { action: 'Quản lý lịch trình', title: 'Quản lý lịch trình', desc: 'Cập nhật chuyến xe Sài Gòn - Vũng Tàu' },
        { action: 'Quản lý tuyến xe', title: 'Quản lý tuyến xe', desc: 'Cập nhật danh sách tuyến xe liên tỉnh' },
        { action: 'Quản lý phương tiện', title: 'Quản lý phương tiện', desc: 'Thêm phương tiện mới vào hệ thống' },
        { action: 'Quản lý tài xế', title: 'Quản lý tài xế', desc: 'Cập nhật thông tin phân công tài xế' },
        { action: 'Quản lý vé (thay khách)', title: 'Quản lý vé (thay khách)', desc: 'Hủy vé hộ cho khách hàng bận' },
        { action: 'Quản lý tài khoản', title: 'Quản lý tài khoản', desc: 'Đồng bộ quyền hạn cho nhân viên mới' },
        { action: 'Quản lý đánh giá', title: 'Quản lý đánh giá', desc: 'Ẩn đánh giá chứa từ khoá cấm' },
        { action: 'Quản lý tin tức', title: 'Quản lý tin tức', desc: 'Đăng bài viết tin tức khuyến mãi mới' },
        { action: 'Quản lý chính sách', title: 'Quản lý chính sách', desc: 'Cập nhật chính sách hoàn trả vé' },
        { action: 'Báo cáo & Xuất file', title: 'Báo cáo & Xuất file', desc: 'Xuất file báo cáo tài chính tuần' }
      ];
      
      const names = [
        { name: 'Nguyen Van Dieu Phoi', username: '@NVDP100001', role: 'ĐIỀU PHỐI' },
        { name: 'Hoang Anh Tuan', username: '@quanly1', role: 'BAN QUẢN LÝ' },
        { name: 'Hoàng Anh Tuấn', username: '@tuanha', role: 'BAN QUẢN LÝ' },
        { name: 'Trần Thị Trang', username: '@trangpt', role: 'BÁN VÉ' },
        { name: 'Nguyễn Văn Linh', username: '@linhnv', role: 'ĐIỀU PHỐI' },
        { name: 'Trần Thị Mai', username: '@maitt', role: 'BÁN VÉ' },
        { name: 'Nguyễn Thị Kiểm', username: '@kiemnt', role: 'BÁN VÉ' }
      ];

      for (let i = 0; i < extraNeeded; i++) {
        const actionObj = actionsList[i % actionsList.length];
        const userObj = names[i % names.length];
        
        // Vary dates between April and June 2026
        const day = (1 + (i % 28)).toString().padStart(2, '0');
        const month = (4 + (i % 3)).toString().padStart(2, '0'); // April, May, June
        const hour = (8 + (i % 12)).toString().padStart(2, '0');
        const min = (10 + (i % 45)).toString().padStart(2, '0');
        const sec = (10 + (i % 45)).toString().padStart(2, '0');
        const timeStr = `2026-${month}-${day} ${hour}:${min}:${sec}`;
        
        tempLogs.push({
          id: `TXP_LOG_MOCK_${1780000000000 + i}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          name: userObj.name,
          username: userObj.username,
          role: userObj.role,
          action: actionObj.action,
          status: i % 15 === 0 ? 'Thất bại' : 'Thành công',
          time: timeStr,
          ip: `192.168.1.${10 + (i % 200)}`,
          details: i % 15 === 0 ? `${actionObj.desc} thất bại` : `${actionObj.desc} thành công`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
      }
    }

    // 5. Sort by time descending
    tempLogs.sort((a, b) => b.time.localeCompare(a.time));

    this.logs = tempLogs;

    // 6. Update stats based on loaded logs
    this.totalLogsToday = this.logs.filter(l => l.time.startsWith('2026-06-28')).length;
    this.successfulLogins = this.logs.filter(l => l.action === 'Đăng nhập' && l.status === 'Thành công').length;
    this.failedOperations = this.logs.filter(l => l.status === 'Thất bại').length;

    this.applyFilters();
  }

  applyFilters() {
    this.currentPage = 1;
    this.filteredLogs = this.logs.filter((log) => {
      // 1. Quick search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesQuery =
          log.id.toLowerCase().includes(query) ||
          log.name.toLowerCase().includes(query) ||
          log.username.toLowerCase().includes(query) ||
          log.ip.includes(query) ||
          (log.details && log.details.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // 2. Role filter
      if (this.selectedRole !== 'all') {
        if (log.role !== this.selectedRole) return false;
      }

      // 3. Action filter
      if (this.selectedAction !== 'all') {
        if (log.action !== this.selectedAction) return false;
      }

      // 4. Status filter
      if (this.selectedStatus !== 'all') {
        if (log.status !== this.selectedStatus) return false;
      }

      // 5. Date filter
      if (this.startDate || this.endDate) {
        const logDate = log.time.split(' ')[0]; // yyyy-MM-dd
        if (this.startDate && logDate < this.startDate) return false;
        if (this.endDate && logDate > this.endDate) return false;
      }

      return true;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedRole = 'all';
    this.selectedAction = 'all';
    this.selectedStatus = 'all';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  exportExcel() {
    if (this.filteredLogs.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    // CSV header columns
    const headers = [
      'Mã nhật ký',
      'Người thực hiện',
      'Tài khoản',
      'Vai trò',
      'Thao tác',
      'Trạng thái',
      'Thời gian',
      'Địa chỉ IP',
      'Chi tiết thao tác'
    ];

    // CSV data rows
    const rows = this.filteredLogs.map(log => [
      log.id,
      log.name,
      log.username,
      log.role,
      log.action,
      log.status,
      log.time,
      log.ip,
      (log.details || '').replace(/"/g, '""') // Escape double quotes for CSV format
    ]);

    // Build CSV content string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\r\n');

    // Add UTF-8 BOM so Excel opens Vietnamese characters correctly
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create direct download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '_');
      link.setAttribute('download', `nhat_ky_hoat_dong_${today}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng tải file!');
    }
  }

  openDetailModal(log: LogItem) {
    this.selectedLog = log;
    
    // Find employee to get phone and code
    let employees: any[] = [];
    const saved = localStorage.getItem('viago_employees');
    if (saved) {
      employees = JSON.parse(saved);
    }
    const cleanUsername = log.username.replace('@', '');
    const emp = employees.find(e => e.username === cleanUsername || e.code === cleanUsername || e.name === log.name);
    
    if (emp) {
      this.selectedOperatorPhone = emp.phone || '0913000111';
      this.selectedOperatorCode = emp.code || cleanUsername;
    } else {
      // Fallback details if not found or system logs
      if (log.role === 'QUẢN TRỊ VIÊN') {
        this.selectedOperatorPhone = '0912000111';
        this.selectedOperatorCode = 'QTV100001';
      } else {
        this.selectedOperatorPhone = '0913000111';
        this.selectedOperatorCode = cleanUsername || 'NVDP100001';
      }
    }

    // Determine state changes from description
    this.isStateChange = log.action === 'Quản lý tài khoản' && 
      (log.details.includes('trạng thái') || log.details.includes('Khóa') || log.details.includes('Mở khóa'));
    
    if (this.isStateChange) {
      if (log.details.includes('Khóa') || log.details.includes('Đã khóa') || log.details.includes('thành Khóa')) {
        this.beforeStatus = 'DaKhoa';
        this.afterStatus = 'DaKhoa'; // To match screenshot's exact mockup showing DaKhoa -> DaKhoa (or can represent the real action)
      } else {
        this.beforeStatus = 'DaKhoa';
        this.afterStatus = 'HoatDong';
      }
    } else {
      this.beforeStatus = '';
      this.afterStatus = '';
    }

    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.selectedLog = null;
    this.showDetailModal = false;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
  }

  getPaginatedLogs(): LogItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  getStartRowIndex(): number {
    if (this.filteredLogs.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRowIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredLogs.length ? this.filteredLogs.length : end;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  showDatePicker(input: any) {
    if (input && typeof input.showPicker === 'function') {
      input.showPicker();
    }
  }
}
