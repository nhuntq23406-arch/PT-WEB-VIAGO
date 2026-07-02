import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quan-ly-tai-khoan-nhan-vien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quan-ly-tai-khoan-nhan-vien.html',
  styleUrl: './quan-ly-tai-khoan-nhan-vien.css',
})
export class QuanLyTaiKhoanNhanVien implements OnInit {
  activeTab = 'all';

  // Filters State
  searchQuery = '';
  searchRole = 'all';
  appliedSearchQuery = '';
  appliedSearchRole = 'all';

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    const saved = localStorage.getItem('viago_employees');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Ensure we remove any driver roles/accounts from storage
      parsed = parsed.filter((e: any) => e.defaultRole !== 'Tài xế' && !e.code.startsWith('TX'));
      
      // If the cache contains old logs (e.g. less logs than the new default for NVDP100001)
      const cachedAdmin = parsed.find((e: any) => e.code === 'NVDP100001');
      if (!cachedAdmin || !cachedAdmin.logs || cachedAdmin.logs.length < 5) {
        // Force refresh cache with new logs
        localStorage.setItem('viago_employees', JSON.stringify(this.employees));
        return;
      }
      
      this.employees = parsed;
      localStorage.setItem('viago_employees', JSON.stringify(this.employees));
    } else {
      localStorage.setItem('viago_employees', JSON.stringify(this.employees));
    }
  }

  saveEmployeesToStorage() {
    localStorage.setItem('viago_employees', JSON.stringify(this.employees));
  }

  // Edit Modal State
  selectedEmployee: any = null;
  showEditModal = false;
  editSubTab = 'profile'; // 'profile' | 'rbac' | 'contact'
  showStatusUpdateAlert = false;
  statusUpdateAlertMessage = '';

  closeStatusUpdateAlert() {
    this.showStatusUpdateAlert = false;
  }

  // Create Modal State
  showCreateModal = false;
  createSubTab = 'profile'; // 'profile' | 'rbac' | 'contact'
  newEmployee: any = {
    code: '',
    username: '',
    firstName: '',
    lastName: '',
    name: '',
    phone: '',
    email: '',
    gender: 'Nam',
    birthDate: '',
    initials: '',
    status: 'Đang hoạt động',
    defaultRole: 'Nhân viên bán vé',
    roles: 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)',
    date: '',
    logs: [],
    permissions: ['datve', 'baocao'],
    address: '',
    notes: '',
    password: '',
    showPassword: false
  };

  setCreateSubTab(tab: string) {
    this.createSubTab = tab;
  }

  // Lock Confirmation Modal State
  showLockConfirmModal = false;
  lockReason = '';

  permissionSearchQuery = '';

  permissionModules = [
    { key: 'datve', title: 'Quản lý vé', desc: 'Cho phép truy cập và thực hiện các nghiệp vụ đặt vé mới, tra cứu bối cảnh vé, hoàn tiền và sửa thông tin vé.', expanded: true, icon: 'ticket' },
    { key: 'tintuc', title: 'Quản lý tin tức', desc: 'Cho phép tạo, sửa, xóa các bài viết tin tức trên trang chủ.', expanded: false, icon: 'news' },
    { key: 'dieuphoi', title: 'Quản lý điều hành', desc: 'Cho phép điều hành tuyến xe, lịch trình, xe chạy và tài xế.', expanded: false, icon: 'dispatch' },
    { key: 'khachhang', title: 'Quản lý khách hàng', desc: 'Cho phép quản lý tài khoản khách hàng, xem đánh giá phản hồi.', expanded: false, icon: 'customer' },
    { key: 'nhanvien', title: 'Quản lý nhân viên', desc: 'Cho phép quản lý tài khoản nhân viên, cấu hình quyền hạn.', expanded: false, icon: 'employee' },
    { key: 'chinhsach', title: 'Quản lý chính sách', desc: 'Cho phép điều chỉnh chính sách, điều khoản dịch vụ.', expanded: false, icon: 'policy' },
    { key: 'tukhoacam', title: 'Quản lý từ khóa cấm', desc: 'Cho phép cấu hình các từ khóa cấm trong đánh giá.', expanded: false, icon: 'ban' },
    { key: 'baocao', title: 'Báo cáo', desc: 'Cho phép xem báo cáo doanh thu, sản lượng, vận hành.', expanded: false, icon: 'report' },
    { key: 'nhatky', title: 'Quản lý nhật ký', desc: 'Cho phép xem nhật ký hoạt động hệ thống.', expanded: false, icon: 'log' },
  ];

  employees = [
    {
      code: 'NVDP100001',
      username: 'NVDP100001',
      name: 'Nguyen Van Dieu Phoi',
      initials: 'DP',
      phone: '0909999999',
      email: 'dieuphoi@viago.vn',
      date: '28/06/2026',
      status: 'Đang hoạt động',
      gender: 'Nam',
      birthDate: '1995-06-28',
      defaultRole: 'Nhân viên điều phối',
      roles: 'NHÂN VIÊN ĐIỀU PHỐI (3 QUYỀN)',
      permissions: ['dieuphoi', 'baocao', 'nhatky'],
      address: 'Văn phòng VIAGO, TP.HCM',
      notes: 'Điều phối chính',
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
    },
    {
      code: 'BQL100001',
      username: 'quanly1',
      name: 'Hoang Anh Tuan',
      initials: 'AT',
      phone: '0901234567',
      email: 'tuan.ha@gmail.com',
      date: '10/01/2026',
      status: 'Đang hoạt động',
      gender: 'Nam',
      birthDate: '1988-04-12',
      defaultRole: 'Ban quản lý',
      roles: 'BAN QUẢN LÝ (1 QUYỀN)',
      permissions: ['baocao'],
      address: '12 Nguyễn Trãi, Quận 5, TP.HCM',
      notes: 'Làm việc xuất sắc, trách nhiệm cao.',
      logs: [
        { type: 'create', title: 'Khởi tạo tài khoản', time: '2026-01-10 08:00:00', desc: 'Khởi tạo tài khoản quản lý hệ thống.', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000000_QA1' },
        { type: 'update', title: 'Báo cáo', time: '2026-05-20 11:30:00', desc: 'Xem báo cáo doanh thu tháng 4/2026', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000000_QA2' },
        { type: 'update', title: 'Báo cáo & Xuất file', time: '2026-06-05 14:15:00', desc: 'Xuất dữ liệu danh sách khách hàng tháng 5', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000000_QA3' }
      ]
    },
    {
      code: 'CL100301',
      username: 'tuanha',
      name: 'Hoàng Anh Tuấn',
      initials: 'AT',
      phone: '0908765432',
      email: 'tuanha.cl@gmail.com',
      date: '15/02/2026',
      status: 'Đang hoạt động',
      gender: 'Nam',
      birthDate: '1990-11-23',
      defaultRole: 'Ban quản lý',
      roles: 'BAN QUẢN LÝ (1 QUYỀN)',
      permissions: ['baocao'],
      address: '45 Lê Lợi, Quận 1, TP.HCM',
      notes: '',
      logs: [
        { type: 'create', title: 'Cấp quyền truy cập', time: '2026-02-15 09:30:00', desc: 'Thêm mới tài khoản Ban quản lý.', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000001_TH1' },
        { type: 'update', title: 'Báo cáo', time: '2026-04-12 10:00:00', desc: 'Xem báo cáo hoạt động vận hành quý 1', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000001_TH2' },
        { type: 'update', title: 'Báo cáo & Xuất file', time: '2026-06-12 15:30:00', desc: 'Xuất file báo cáo tài chính tuần', ip: '127.0.0.1', code: 'VIAGO_LOG_1781200000001_TH3' }
      ]
    },
    {
      code: 'CL100303',
      username: 'trangpt',
      name: 'Trần Thị Trang',
      initials: 'TT',
      phone: '0912345678',
      email: 'trangpt@gmail.com',
      date: '20/02/2026',
      status: 'Đang hoạt động',
      gender: 'Nữ',
      birthDate: '1993-08-15',
      defaultRole: 'Nhân viên bán vé',
      roles: 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)',
      permissions: ['datve', 'baocao'],
      address: '78 CMT8, Quận 3, TP.HCM',
      notes: '',
      logs: [
        { type: 'create', title: 'Đăng nhập lần đầu', time: '2026-02-20 10:15:00', desc: 'Nhân viên đăng nhập thành công vào hệ thống bán vé.', ip: '192.168.1.55', code: 'VIAGO_LOG_1781200000002_TR1' },
        { type: 'update', title: 'Đăng nhập', time: '2026-05-10 09:12:00', desc: 'Nhân viên đăng nhập thành công vào hệ thống Admin.', ip: '192.168.1.55', code: 'VIAGO_LOG_1781200000002_TR2' },
        { type: 'update', title: 'Đăng nhập', time: '2026-06-20 08:45:00', desc: 'Nhân viên đăng nhập thành công vào hệ thống Admin.', ip: '192.168.1.55', code: 'VIAGO_LOG_1781200000002_TR3' }
      ]
    },
    {
      code: 'NVDP100002',
      username: 'linhnv',
      name: 'Nguyễn Văn Linh',
      initials: 'VL',
      phone: '0934567890',
      email: 'linhnv.dispatch@gmail.com',
      date: '01/03/2026',
      status: 'Đang hoạt động',
      gender: 'Nam',
      birthDate: '1992-05-18',
      defaultRole: 'Nhân viên điều phối',
      roles: 'NHÂN VIÊN ĐIỀU PHỐI (3 QUYỀN)',
      permissions: ['dieuphoi', 'baocao', 'nhatky'],
      address: '109 Lý Thường Kiệt, Quận Tân Bình, TP.HCM',
      notes: '',
      logs: [
        {
          type: 'update',
          title: 'Quản lý lịch trình',
          time: '2026-06-28 20:05:00',
          desc: 'Cập nhật chuyến xe Sài Gòn - Vũng Tàu lúc 08:00',
          ip: '192.168.1.60',
          code: 'VIAGO_LOG_1782656081234_UPD332'
        },
        {
          type: 'update',
          title: 'Quản lý lịch trình',
          time: '2026-06-15 14:20:00',
          desc: 'Cập nhật lịch trình tuyến xe limousine Vũng Tàu',
          ip: '192.168.1.60',
          code: 'VIAGO_LOG_1782656081234_UPD333'
        },
        {
          type: 'update',
          title: 'Quản lý lịch trình',
          time: '2026-05-25 11:00:00',
          desc: 'Điều chỉnh tài xế cho chuyến xe VTA-002',
          ip: '192.168.1.60',
          code: 'VIAGO_LOG_1782656081234_UPD334'
        }
      ]
    },
    {
      code: 'NVDP100069',
      username: 'dungpt',
      name: 'Phạm Thanh Dũng',
      initials: 'TD',
      phone: '0907475177',
      email: 'dungpt.dispatch@gmail.com',
      date: '12/03/2026',
      status: 'Đã khóa',
      gender: 'Nam',
      birthDate: '1991-02-25',
      defaultRole: 'Nhân viên điều phối',
      roles: 'NHÂN VIÊN ĐIỀU PHỐI (3 QUYỀN)',
      permissions: ['dieuphoi', 'baocao', 'nhatky'],
      address: '12 Trần Phú, Quận 5, TP.HCM',
      notes: '',
      logs: [
        {
          type: 'lock',
          title: 'Quản lý tài khoản',
          time: '2026-05-20 14:00:00',
          desc: 'Khóa tài khoản nhân viên. Lý do: Nghỉ việc tạm thời',
          ip: '127.0.0.1',
          code: 'VIAGO_LOG_1781200000003_LK1'
        },
        {
          type: 'update',
          title: 'Quản lý lịch trình',
          time: '2026-04-05 08:30:00',
          desc: 'Đồng bộ danh sách tuyến xe liên tỉnh',
          ip: '127.0.0.1',
          code: 'VIAGO_LOG_1781200000003_UPD2'
        }
      ],
      lockInfo: {
        date: '2026-05-20 14:00',
        reason: 'Nghỉ việc tạm thời'
      }
    },
    {
      code: 'NVBV100127',
      username: 'maitt',
      name: 'Trần Thị Mai',
      initials: 'TM',
      phone: '0934567890',
      email: 'mai.tt@yahoo.com',
      date: '20/03/2026',
      status: 'Đang hoạt động',
      gender: 'Nữ',
      birthDate: '1993-09-08',
      defaultRole: 'Nhân viên bán vé',
      roles: 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)',
      permissions: ['datve', 'baocao'],
      address: '90 Trần Hưng Đạo, Quận 1, TP.HCM',
      notes: '',
      logs: [
        {
          type: 'update',
          title: 'Đặt vé',
          time: '2026-06-28 21:02:15',
          desc: 'Đặt vé thành công cho khách hàng Nguyen Van A, Mã vé: VIAGO_TKT_12345',
          ip: '192.168.1.102',
          code: 'VIAGO_LOG_1782656102123_TKT1'
        },
        {
          type: 'update',
          title: 'Tra cứu vé',
          time: '2026-06-24 16:30:00',
          desc: 'Tra cứu thông tin vé của khách hàng Tran Thi C',
          ip: '192.168.1.102',
          code: 'VIAGO_LOG_1782656102123_TKT2'
        },
        {
          type: 'update',
          title: 'Hủy vé',
          time: '2026-06-18 10:15:00',
          desc: 'Hủy vé đặt thành công cho mã vé VIAGO_TKT_00129',
          ip: '192.168.1.102',
          code: 'VIAGO_LOG_1782656102123_TKT3'
        }
      ]
    },
    {
      code: 'NVBV100126',
      username: 'kiemnt',
      name: 'Nguyễn Thị Kiểm',
      initials: 'TK',
      phone: '0908739484',
      email: 'kiem.nt@gmail.com',
      date: '22/03/2026',
      status: 'Đang hoạt động',
      gender: 'Nữ',
      birthDate: '1980-05-31',
      defaultRole: 'Nhân viên bán vé',
      roles: 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)',
      permissions: ['datve', 'baocao'],
      address: '34 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      notes: '',
      logs: [
        {
          type: 'update',
          title: 'Đặt vé',
          time: '2026-06-28 20:45:00',
          desc: 'Đặt vé thành công cho khách hàng Tran Thi B, Mã vé: VIAGO_TKT_12346',
          ip: '192.168.1.103',
          code: 'VIAGO_LOG_1782656085123_TKT2'
        },
        {
          type: 'update',
          title: 'Chỉnh sửa thông tin vé',
          time: '2026-06-26 11:20:00',
          desc: 'Thay đổi thông tin ghế ngồi cho vé VIAGO_TKT_12346 từ A1 sang A2',
          ip: '192.168.1.103',
          code: 'VIAGO_LOG_1782656085123_TKT3'
        },
        {
          type: 'update',
          title: 'Đổi mật khẩu',
          time: '2026-06-14 15:40:00',
          desc: 'Yêu cầu thay đổi mật khẩu hệ thống thành công',
          ip: '192.168.1.103',
          code: 'VIAGO_LOG_1782656085123_TKT4'
        }
      ]
    }
  ];

  get filteredEmployees() {
    let list = this.employees;

    // Filter by Tab
    if (this.activeTab === 'active') {
      list = list.filter(e => e.status === 'Đang hoạt động');
    } else if (this.activeTab === 'locked') {
      list = list.filter(e => e.status === 'Đã khóa');
    }

    // Filter by Search Query (applied)
    if (this.appliedSearchQuery.trim()) {
      const q = this.appliedSearchQuery.toLowerCase().trim();
      list = list.filter(e =>
        e.code.toLowerCase().includes(q) ||
        e.username.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.defaultRole.toLowerCase().includes(q)
      );
    }

    // Filter by Role (applied)
    if (this.appliedSearchRole !== 'all') {
      list = list.filter(e => e.defaultRole === this.appliedSearchRole);
    }

    return list;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  applyFilter() {
    this.appliedSearchQuery = this.searchQuery;
    this.appliedSearchRole = this.searchRole;
  }

  clearSearchQuery() {
    this.searchQuery = '';
    this.applyFilter();
  }

  generateNextEmployeeCode(prefix: string): string {
    let maxNum = 100000;
    this.employees.forEach(e => {
      if (e.code.startsWith(prefix)) {
        const num = parseInt(e.code.replace(prefix, ''), 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    return prefix + (maxNum + 1);
  }

  getPrefixForRole(role: string): string {
    switch (role) {
      case 'Quản trị viên': return 'QTV';
      case 'Ban quản lý': return 'BQL';
      case 'Nhân viên bán vé': return 'NVBV';
      case 'Nhân viên điều phối': return 'NVDP';
      default: return 'NV';
    }
  }

  getRolesGroupForRole(role: string): string {
    switch (role) {
      case 'Quản trị viên': return 'QUẢN TRỊ VIÊN (9 QUYỀN)';
      case 'Ban quản lý': return 'BAN QUẢN LÝ (1 QUYỀN)';
      case 'Nhân viên bán vé': return 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)';
      case 'Nhân viên điều phối': return 'NHÂN VIÊN ĐIỀU PHỐI (3 QUYỀN)';
      default: return 'NHÂN VIÊN (0 QUYỀN)';
    }
  }

  // Open Edit Modal
  openEditModal(employee: any) {
    this.selectedEmployee = JSON.parse(JSON.stringify(employee));
    
    // Parse firstName and lastName
    const nameParts = (this.selectedEmployee.name || '').trim().split(' ');
    if (nameParts.length > 1) {
      this.selectedEmployee.firstName = nameParts.pop();
      this.selectedEmployee.lastName = nameParts.join(' ');
    } else {
      this.selectedEmployee.firstName = this.selectedEmployee.name || '';
      this.selectedEmployee.lastName = '';
    }

    if (!this.selectedEmployee.permissions) {
      this.selectedEmployee.permissions = [];
    }

    this.selectedEmployee.showPassword = false;

    this.showEditModal = true;
    this.editSubTab = 'profile'; // 'profile' | 'rbac' | 'contact'
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  setEditSubTab(tab: string) {
    this.editSubTab = tab;
  }

  toggleEmployeeStatus() {
    if (this.selectedEmployee) {
      if (this.selectedEmployee.status === 'Đang hoạt động') {
        this.openLockConfirmModal();
      } else {
        // Unlock
        this.selectedEmployee.status = 'Đang hoạt động';
        this.selectedEmployee.lockInfo = null;

        if (!this.selectedEmployee.logs) this.selectedEmployee.logs = [];
        this.selectedEmployee.logs.unshift({
          type: 'unlock',
          title: 'Quản lý tài khoản',
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          desc: 'Mở khóa tài khoản nhân viên.',
          ip: '127.0.0.1',
          code: 'VIAGO_LOG_' + Date.now()
        });

        // Sync immediately
        const idx = this.employees.findIndex(e => e.code === this.selectedEmployee.code);
        if (idx !== -1) {
          (this.employees[idx] as any).status = 'Đang hoạt động';
          delete (this.employees[idx] as any).lockInfo;
          (this.employees[idx] as any).logs = JSON.parse(JSON.stringify(this.selectedEmployee.logs));
        }

        this.saveEmployeesToStorage();

        this.statusUpdateAlertMessage = 'Trạng thái tài khoản đã chuyển sang <strong>Đang hoạt động</strong>.';
        this.showStatusUpdateAlert = true;
      }
    }
  }

  saveEmployeeChanges() {
    if (this.selectedEmployee) {
      // Combine firstName and lastName
      const first = (this.selectedEmployee.firstName || '').trim();
      const last = (this.selectedEmployee.lastName || '').trim();
      this.selectedEmployee.name = last ? `${last} ${first}` : first;
      
      // Update initials
      const nameParts = this.selectedEmployee.name.split(' ');
      let initials = 'NV';
      if (nameParts.length >= 2) {
        initials = (nameParts[nameParts.length - 2][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else if (nameParts.length > 0) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
      }
      this.selectedEmployee.initials = initials;

      // Add log
      if (!this.selectedEmployee.logs) this.selectedEmployee.logs = [];
      this.selectedEmployee.logs.unshift({
        type: 'update',
        title: 'Quản lý tài khoản',
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        desc: 'Cập nhật thông tin cơ bản cho nhân viên: ' + this.selectedEmployee.name,
        ip: '127.0.0.1',
        code: 'VIAGO_LOG_' + Date.now()
      });

      // Sync Roles Group string
      this.updateRolesCount();
      
      const idx = this.employees.findIndex(e => e.code === this.selectedEmployee.code);
      if (idx !== -1) {
        this.employees[idx] = JSON.parse(JSON.stringify(this.selectedEmployee));
      }
      this.saveEmployeesToStorage();
      this.closeEditModal();
    }
  }

  openLockConfirmModal() {
    this.lockReason = '';
    this.showLockConfirmModal = true;
  }

  closeLockConfirmModal() {
    this.showLockConfirmModal = false;
  }

  confirmLockEmployee() {
    const finalReason = this.lockReason.trim() || 'Không có lý do cụ thể';
    if (this.selectedEmployee) {
      this.selectedEmployee.status = 'Đã khóa';
      this.selectedEmployee.lockInfo = {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: finalReason
      };

      if (!this.selectedEmployee.logs) this.selectedEmployee.logs = [];
      this.selectedEmployee.logs.unshift({
        type: 'lock',
        title: 'Quản lý tài khoản',
        time: this.selectedEmployee.lockInfo.date,
        desc: 'Khóa tài khoản nhân viên. Lý do: ' + this.selectedEmployee.lockInfo.reason,
        ip: '127.0.0.1',
        code: 'VIAGO_LOG_' + Date.now()
      });

      // Sync
      const idx = this.employees.findIndex(e => e.code === this.selectedEmployee.code);
      if (idx !== -1) {
        (this.employees[idx] as any).status = 'Đã khóa';
        (this.employees[idx] as any).lockInfo = JSON.parse(JSON.stringify(this.selectedEmployee.lockInfo));
        (this.employees[idx] as any).logs = JSON.parse(JSON.stringify(this.selectedEmployee.logs));
      }

      this.saveEmployeesToStorage();

      this.closeLockConfirmModal();
      this.statusUpdateAlertMessage = 'Trạng thái tài khoản đã chuyển sang <strong>Đã khóa</strong>.';
      this.showStatusUpdateAlert = true;
    }
  }

  openCreateModal() {
    this.newEmployee = {
      code: '',
      username: '',
      firstName: '',
      lastName: '',
      name: '',
      phone: '',
      email: '',
      gender: 'Nam',
      birthDate: '',
      initials: '',
      status: 'Đang hoạt động',
      defaultRole: 'Nhân viên bán vé',
      roles: 'NHÂN VIÊN BÁN VÉ (2 QUYỀN)',
      date: new Date().toLocaleDateString('vi-VN'),
      logs: [],
      permissions: ['datve', 'baocao'],
      address: '',
      notes: '',
      password: '',
      showPassword: false
    };
    this.createSubTab = 'profile';
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createEmployee() {
    // Sync name if filled via separate firstName/lastName
    if (!this.newEmployee.name && (this.newEmployee.firstName || this.newEmployee.lastName)) {
      this.newEmployee.name = ((this.newEmployee.lastName || '') + ' ' + (this.newEmployee.firstName || '')).trim();
    }

    if (!this.newEmployee.username || !this.newEmployee.name || !this.newEmployee.phone) {
      alert('Vui lòng điền đầy đủ Tên truy cập, Họ tên và Số điện thoại!');
      return;
    }

    // Determine prefix and code
    const prefix = this.getPrefixForRole(this.newEmployee.defaultRole);
    this.newEmployee.code = this.generateNextEmployeeCode(prefix);

    // Roles group string
    this.newEmployee.roles = this.getRolesGroupForRole(this.newEmployee.defaultRole);

    // Initials
    const nameParts = this.newEmployee.name.trim().split(' ');
    let initials = 'NV';
    if (nameParts.length > 0) {
      if (nameParts.length >= 2) {
        initials = (nameParts[nameParts.length - 2][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else {
        initials = nameParts[0].substring(0, 2).toUpperCase();
      }
    }
    this.newEmployee.initials = initials;

    // Create log
    this.newEmployee.logs.push({
      type: 'create',
      title: 'Tạo mới',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      desc: 'Tạo mới tài khoản nhân viên: ' + this.newEmployee.name,
      ip: '127.0.0.1',
      code: 'VIAGO_LOG_' + Date.now()
    });

    this.employees.unshift(JSON.parse(JSON.stringify(this.newEmployee)));
    this.saveEmployeesToStorage();
    this.closeCreateModal();
  }

  // RBAC permissions helper methods
  isPermissionChecked(key: string, isCreate = false): boolean {
    const target = isCreate ? this.newEmployee : this.selectedEmployee;
    if (!target || !target.permissions) return false;
    return target.permissions.includes(key);
  }

  togglePermission(key: string, isCreate = false) {
    const target = isCreate ? this.newEmployee : this.selectedEmployee;
    if (!target) return;
    if (!target.permissions) target.permissions = [];
    const idx = target.permissions.indexOf(key);
    if (idx === -1) {
      target.permissions.push(key);
    } else {
      target.permissions.splice(idx, 1);
    }
    if (isCreate) {
      this.updateCreateRolesCount();
    } else {
      this.updateRolesCount();
    }
  }

  updateRolesCount() {
    if (!this.selectedEmployee) return;
    const count = this.selectedEmployee.permissions ? this.selectedEmployee.permissions.length : 0;
    const base = this.selectedEmployee.defaultRole.toUpperCase();
    this.selectedEmployee.roles = `${base} (${count} QUYỀN)`;
  }

  updateCreateRolesCount() {
    if (!this.newEmployee) return;
    const count = this.newEmployee.permissions ? this.newEmployee.permissions.length : 0;
    const base = this.newEmployee.defaultRole.toUpperCase();
    this.newEmployee.roles = `${base} (${count} QUYỀN)`;
  }

  applyRoleTemplate(roleType: string, isCreate = false) {
    const target = isCreate ? this.newEmployee : this.selectedEmployee;
    if (!target) return;
    if (roleType === 'admin') {
      target.permissions = ['datve', 'tintuc', 'dieuphoi', 'khachhang', 'nhanvien', 'chinhsach', 'tukhoacam', 'baocao', 'nhatky'];
      target.defaultRole = 'Quản trị viên';
    } else if (roleType === 'manager') {
      target.permissions = ['baocao'];
      target.defaultRole = 'Ban quản lý';
    } else if (roleType === 'dispatcher') {
      target.permissions = ['dieuphoi', 'baocao'];
      target.defaultRole = 'Nhân viên điều phối';
    } else if (roleType === 'cashier') {
      target.permissions = ['datve', 'baocao'];
      target.defaultRole = 'Nhân viên bán vé';
    }
    if (isCreate) {
      this.updateCreateRolesCount();
    } else {
      this.updateRolesCount();
    }
  }

  get visiblePermissionModules() {
    if (!this.permissionSearchQuery.trim()) return this.permissionModules;
    const q = this.permissionSearchQuery.toLowerCase().trim();
    return this.permissionModules.filter(m => m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  }

  isAllPermissionsChecked(isCreate = false): boolean {
    const target = isCreate ? this.newEmployee : this.selectedEmployee;
    if (!target || !target.permissions) return false;
    const visibleKeys = this.visiblePermissionModules.map((m: any) => m.key);
    if (visibleKeys.length === 0) return false;
    return visibleKeys.every((k: string) => target.permissions.includes(k));
  }

  toggleSelectAllPermissions(isCreate = false) {
    const target = isCreate ? this.newEmployee : this.selectedEmployee;
    if (!target) return;
    if (!target.permissions) target.permissions = [];
    const visibleKeys = this.visiblePermissionModules.map((m: any) => m.key);
    
    if (this.isAllPermissionsChecked(isCreate)) {
      target.permissions = target.permissions.filter((k: string) => !visibleKeys.includes(k));
    } else {
      visibleKeys.forEach((k: string) => {
        if (!target.permissions.includes(k)) {
          target.permissions.push(k);
        }
      });
    }
    if (isCreate) {
      this.updateCreateRolesCount();
    } else {
      this.updateRolesCount();
    }
  }

  toggleModuleExpanded(module: any) {
    module.expanded = !module.expanded;
  }

  getPermissionTitle(key: string): string {
    const found = this.permissionModules.find(m => m.key === key);
    return found ? found.title : key;
  }
}
