import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/toast.service';

interface LostItem {
  ma_do_that_lac: string;
  ma_khach_hang?: string | null;
  ten_khach_hang: string;
  so_dien_thoai: string;
  email: string;
  tuyen_xe: string;
  ngay_di_chuyen: string;
  vi_tri_ghe?: string | null;
  mo_ta_vat_pham: string;
  vi_tri_tim_thay?: string | null;
  thoi_gian_tim_thay?: string | null;
  hinh_anh?: string | null;
  hinh_anh_tim_thay?: string | null;
  ghi_chu?: string | null;
  trang_thai: 'Đang tìm kiếm' | 'Đã tìm thấy' | 'Đã trả khách' | 'Đóng yêu cầu';
  ngay_tao: string;
  ngay_cap_nhat: string;
}

const MOCK_LOST_ITEMS: LostItem[] = [
  {
    ma_do_that_lac: "DTL00001",
    ma_khach_hang: "KH00084",
    ten_khach_hang: "Nguyễn Văn Hùng",
    so_dien_thoai: "0912345678",
    email: "hung.nv@example.com",
    tuyen_xe: "TP.HCM → Cần Thơ",
    ngay_di_chuyen: "2026-07-01",
    vi_tri_ghe: "Phòng A12",
    mo_ta_vat_pham: "Ví da nam màu đen, hiệu Tommy Hilfiger, bên trong có thẻ CCCD và bằng lái xe mang tên Nguyễn Văn Hùng",
    hinh_anh: "/asset/images/customer/wallet.png",
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-07-01 11:00",
    ngay_cap_nhat: "2026-07-01 11:00",
    ghi_chu: "Khách báo rơi trên xe Limousine chạy tuyến Hà Nội - Hải Phòng."
  },
  {
    ma_do_that_lac: "DTL00002",
    ma_khach_hang: "KH00109",
    ten_khach_hang: "Trần Thị Lan",
    so_dien_thoai: "0987654321",
    email: "lan.tt@example.com",
    tuyen_xe: "TP.HCM → Đà Lạt",
    ngay_di_chuyen: "2026-06-30",
    vi_tri_ghe: "Ghế số 12",
    mo_ta_vat_pham: "Điện thoại iPhone 13 Pro màu xanh dương, ốp lưng nhựa dẻo trong suốt, màn hình có vết trầy nhẹ",
    hinh_anh: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
    vi_tri_tim_thay: "Dưới khe ghế số 12, gần cửa sổ máy lạnh",
    thoi_gian_tim_thay: "2026-07-01 08:00",
    trang_thai: "Đã tìm thấy",
    ngay_tao: "2026-06-30 16:30",
    ngay_cap_nhat: "2026-07-01 08:00",
    ghi_chu: "Tài xế đã nhặt được khi dọn vệ sinh xe cuối ngày."
  },
  {
    ma_do_that_lac: "DTL00003",
    ma_khach_hang: null,
    ten_khach_hang: "Lê Minh Triết",
    so_dien_thoai: "0905123456",
    email: "triet.lm@example.com",
    tuyen_xe: "Đà Lạt → TP.HCM",
    ngay_di_chuyen: "2026-06-28",
    vi_tri_ghe: "Ghế số 8",
    mo_ta_vat_pham: "Balo vải thô màu xám sẫm nhãn hiệu Coolbell, bên trong chứa sách giáo khoa và một bộ sạc laptop Asus",
    hinh_anh: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
    vi_tri_tim_thay: "Hộc đựng hành lý phía trên ghế ngồi hàng số 8",
    thoi_gian_tim_thay: "2026-06-28 09:30",
    trang_thai: "Đã trả khách",
    ngay_tao: "2026-06-28 08:00",
    ngay_cap_nhat: "2026-06-29 14:00",
    ghi_chu: "Đã bàn giao lại cho khách tại văn phòng nhà xe ViAGO ở Hải Phòng."
  },
  {
    ma_do_that_lac: "DTL00004",
    ma_khach_hang: "KH00155",
    ten_khach_hang: "Phạm Thanh Thảo",
    so_dien_thoai: "0934567890",
    email: "thao.pt@example.com",
    tuyen_xe: "TP.HCM → Nha Trang",
    ngay_di_chuyen: "2026-07-02",
    vi_tri_ghe: "Ghế số 2",
    mo_ta_vat_pham: "Kính mắt thời trang gọng kim loại mạ vàng, tròng kính đóng nhạt, đựng trong bao da màu nâu hiệu Gentle Monster",
    hinh_anh: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-07-02 19:00",
    ngay_cap_nhat: "2026-07-02 19:00",
    ghi_chu: "Khách nghi để quên ở hộc đựng nước cạnh ghế ngồi số 2."
  },
  {
    ma_do_that_lac: "DTL00005",
    ma_khach_hang: null,
    ten_khach_hang: "Hoàng Anh Tuấn",
    so_dien_thoai: "0977112233",
    email: "tuan.ha@example.com",
    tuyen_xe: "Nha Trang → TP.HCM",
    ngay_di_chuyen: "2026-06-25",
    vi_tri_ghe: "Ghế số 15",
    mo_ta_vat_pham: "Tai nghe Airpods đựng trong kén sạc màu trắng có dán sticker màu cam",
    hinh_anh: "/asset/images/customer/airpods.png",
    hinh_anh_tim_thay: null,
    trang_thai: "Đóng yêu cầu",
    ngay_tao: "2026-06-25 14:30",
    ngay_cap_nhat: "2026-06-27 10:00",
    ghi_chu: "Khách hàng liên hệ lại thông báo đã tìm thấy tai nghe nằm sâu trong túi xách cá nhân tại nhà."
  },
  {
    ma_do_that_lac: "DTL00006",
    ma_khach_hang: "KH00201",
    ten_khach_hang: "Vũ Hoàng Giang",
    so_dien_thoai: "0911223344",
    email: "giang.vh@example.com",
    tuyen_xe: "TP.HCM → Vũng Tàu",
    ngay_di_chuyen: "2026-06-29",
    vi_tri_ghe: "Ghế số 6",
    mo_ta_vat_pham: "Đồng hồ thông minh Apple Watch Series 7 màu đen gọng nhôm dây cao su",
    hinh_anh: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80",
    vi_tri_tim_thay: "Cạnh hộc cửa xe bên lái phụ",
    thoi_gian_tim_thay: "2026-06-29 18:30",
    trang_thai: "Đã tìm thấy",
    ngay_tao: "2026-06-29 12:00",
    ngay_cap_nhat: "2026-06-29 18:30",
    ghi_chu: "Đã cất trữ tại tủ đồ thất lạc văn phòng Vũng Tàu."
  },
  {
    ma_do_that_lac: "DTL00007",
    ma_khach_hang: null,
    ten_khach_hang: "Bùi Thị Mai",
    so_dien_thoai: "0966778899",
    email: "mai.bt@example.com",
    tuyen_xe: "Đà Lạt → TP.HCM",
    ngay_di_chuyen: "2026-06-27",
    vi_tri_ghe: "Ghế số 14",
    mo_ta_vat_pham: "Túi xách da nữ màu hồng pastel nhãn hiệu Charles & Keith",
    hinh_anh: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
    vi_tri_tim_thay: "Gầm ghế ngồi số 14",
    thoi_gian_tim_thay: "2026-06-27 19:15",
    trang_thai: "Đã trả khách",
    ngay_tao: "2026-06-27 15:00",
    ngay_cap_nhat: "2026-06-28 10:30",
    ghi_chu: "Hành khách đã qua văn phòng Lê Hồng Phong ký biên bản và nhận lại túi."
  },
  {
    ma_do_that_lac: "DTL00008",
    ma_khach_hang: "KH00310",
    ten_khach_hang: "Đặng Văn Lâm",
    so_dien_thoai: "0944556677",
    email: "lam.dv@example.com",
    tuyen_xe: "TP.HCM → Nha Trang",
    ngay_di_chuyen: "2026-06-26",
    vi_tri_ghe: "Phòng B2",
    mo_ta_vat_pham: "Laptop Dell Vostro màu đen xám, có dán sticker trang trí ở mặt trước máy",
    hinh_anh: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-06-26 21:00",
    ngay_cap_nhat: "2026-06-26 21:00",
    ghi_chu: "Đang đối soát trích xuất camera hành trình chuyến xe đêm ngày 26."
  },
  {
    ma_do_that_lac: "DTL00009",
    ma_khach_hang: null,
    ten_khach_hang: "Lê Thu Thủy",
    so_dien_thoai: "0922334455",
    email: "thuy.lt@example.com",
    tuyen_xe: "Nha Trang → Đà Lạt",
    ngay_di_chuyen: "2026-06-24",
    vi_tri_ghe: "Ghế số 3",
    mo_ta_vat_pham: "Ô dù màu xanh navy gấp gọn có in logo thương hiệu ViAGO",
    hinh_anh: "/asset/images/customer/umbrella.png",
    hinh_anh_tim_thay: "/asset/images/customer/umbrella.png",
    vi_tri_tim_thay: "Hộc để đồ uống phía sau ghế số 3",
    thoi_gian_tim_thay: "2026-06-24 16:40",
    trang_thai: "Đã tìm thấy",
    ngay_tao: "2026-06-24 14:00",
    ngay_cap_nhat: "2026-06-24 16:40",
    ghi_chu: "Đã bàn giao cho kho thất lạc VP Đà Lạt lưu trữ."
  },
  {
    ma_do_that_lac: "DTL00010",
    ma_khach_hang: null,
    ten_khach_hang: "Nguyễn Quốc Khánh",
    so_dien_thoai: "0915667788",
    email: "khanh.nq@example.com",
    tuyen_xe: "TP.HCM → Đà Lạt",
    ngay_di_chuyen: "2026-07-02",
    vi_tri_ghe: "Ghế số 9",
    mo_ta_vat_pham: "Túi vải canvas màu trắng sữa đựng một số đồ trang điểm cá nhân",
    hinh_anh: null,
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-07-02 20:00",
    ngay_cap_nhat: "2026-07-02 20:00",
    ghi_chu: "Nhân viên đang liên hệ kiểm tra xe đỗ bãi trung chuyển."
  },
  {
    ma_do_that_lac: "DTL00011",
    ma_khach_hang: "KH00022",
    ten_khach_hang: "Phạm Minh Hoàng",
    so_dien_thoai: "0977889900",
    email: "hoang.pm@example.com",
    tuyen_xe: "TP.HCM → Cần Thơ",
    ngay_di_chuyen: "2026-06-20",
    vi_tri_ghe: "Ghế số 5",
    mo_ta_vat_pham: "Sách tiểu thuyết tiếng Anh bìa mềm và một kính đọc sách viễn thị gọng đen",
    hinh_anh: null,
    hinh_anh_tim_thay: null,
    trang_thai: "Đóng yêu cầu",
    ngay_tao: "2026-06-20 18:00",
    ngay_cap_nhat: "2026-06-22 09:00",
    ghi_chu: "Khách báo không cần hỗ trợ tìm tiếp do giá trị thấp."
  },
  {
    ma_do_that_lac: "DTL00012",
    ma_khach_hang: null,
    ten_khach_hang: "Đỗ Thùy Trang",
    so_dien_thoai: "0909887766",
    email: "trang.dt@example.com",
    tuyen_xe: "Đà Lạt → TP.HCM",
    ngay_di_chuyen: "2026-06-22",
    vi_tri_ghe: "Ghế số 1",
    mo_ta_vat_pham: "Hộp đựng kính màu hồng chứa cây bút ký cao cấp Parker kim loại màu vàng óng",
    hinh_anh: null,
    hinh_anh_tim_thay: null,
    vi_tri_tim_thay: "Khe cắm sạc cổng USB cạnh tay vịn ghế số 1",
    thoi_gian_tim_thay: "2026-06-22 17:30",
    trang_thai: "Đã trả khách",
    ngay_tao: "2026-06-22 10:00",
    ngay_cap_nhat: "2026-06-23 15:30",
    ghi_chu: "Đã giao trực tiếp lại cho khách hàng tại Văn phòng Miền Đông."
  },
  {
    ma_do_that_lac: "DTL00013",
    ma_khach_hang: null,
    ten_khach_hang: "Nguyễn Minh Châu",
    so_dien_thoai: "0901234567",
    email: "chau.nm@example.com",
    tuyen_xe: "TP.HCM → Cần Thơ",
    ngay_di_chuyen: "2026-06-21",
    vi_tri_ghe: "Ghế số 3",
    mo_ta_vat_pham: "Mũ bảo hiểm 3/4 màu đỏ nhám, nhãn hiệu Royal",
    hinh_anh: "/asset/images/customer/wallet.png",
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-06-21 15:00",
    ngay_cap_nhat: "2026-06-21 15:00",
    ghi_chu: null
  },
  {
    ma_do_that_lac: "DTL00014",
    ma_khach_hang: "KH00084",
    ten_khach_hang: "Nguyễn Văn Hùng",
    so_dien_thoai: "0912345678",
    email: "hung.nv@example.com",
    tuyen_xe: "Đà Lạt → Nha Trang",
    ngay_di_chuyen: "2026-06-22",
    vi_tri_ghe: "Ghế số 7",
    mo_ta_vat_pham: "Bình giữ nhiệt Lock&Lock màu bạc 500ml",
    hinh_anh: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
    vi_tri_tim_thay: "Gầm ghế số 7",
    thoi_gian_tim_thay: "2026-06-22 18:00",
    trang_thai: "Đã tìm thấy",
    ngay_tao: "2026-06-22 10:00",
    ngay_cap_nhat: "2026-06-22 18:00",
    ghi_chu: "Tài xế nhặt được."
  },
  {
    ma_do_that_lac: "DTL00015",
    ma_khach_hang: null,
    ten_khach_hang: "Lê Thu Thảo",
    so_dien_thoai: "0932112233",
    email: "thao.lt@example.com",
    tuyen_xe: "Cần Thơ → Rạch Giá",
    ngay_di_chuyen: "2026-06-23",
    vi_tri_ghe: "Ghế số 10",
    mo_ta_vat_pham: "Sạc dự phòng Anker màu đen 10000mAh",
    hinh_anh: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
    hinh_anh_tim_thay: null,
    trang_thai: "Đang tìm kiếm",
    ngay_tao: "2026-06-23 11:00",
    ngay_cap_nhat: "2026-06-23 11:00",
    ghi_chu: null
  }
];

@Component({
  selector: 'app-do-that-lac',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './do-that-lac.html',
  styleUrl: './do-that-lac.css'
})
export class DoThatLacComponent implements OnInit {
  items: LostItem[] = [];
  filteredItems: LostItem[] = [];

  // Filters
  searchText = '';
  filterTrangThai = 'Tất cả trạng thái';
  filterSort = 'Mới nhất tạo trước';

  // Routes List (Sync with Customer side options)
  routesList = [
    'TP.HCM → Cần Thơ',
    'Cần Thơ → TP.HCM',
    'TP.HCM → Vũng Tàu',
    'Vũng Tàu → TP.HCM',
    'Đà Lạt → Buôn Ma Thuột',
    'Buôn Ma Thuột → Đà Lạt',
    'Đà Lạt → Nha Trang',
    'Nha Trang → Đà Lạt',
    'Cần Thơ → Rạch Giá',
    'Rạch Giá → Cần Thơ',
    'TP.HCM → Phan Thiết',
    'Phan Thiết → TP.HCM',
    'TP.HCM → Đà Lạt',
    'Đà Lạt → TP.HCM',
    'TP.HCM → Nha Trang',
    'Nha Trang → TP.HCM',
    'Nha Trang → Đà Nẵng',
    'Đà Nẵng → Nha Trang'
  ];

  // Modals
  showCreateModal = false;
  showEditModal = false;
  showSuccessModal = false;
  successMessageTitle = '';
  successMessageBody = '';
  private successTimer: any = null;

  // Forms (Aligned to Customer Reporting Form Fields)
  newItem: Partial<LostItem> = {
    mo_ta_vat_pham: '',
    tuyen_xe: '',
    ngay_di_chuyen: new Date().toISOString().slice(0, 10),
    vi_tri_ghe: '',
    ten_khach_hang: '',
    so_dien_thoai: '',
    email: '',
    hinh_anh: '',
    ghi_chu: ''
  };
  createFormSubmitted = false;

  editingItem: LostItem | null = null;
  editFormSubmitted = false;

  // Pagination
  itemsPerPage = 12;
  currentPage = 1;

  toastService = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.items = [...MOCK_LOST_ITEMS];
    this.filterData();
  }

  // --- STATS GETTERS ---
  get totalItemsCount(): number {
    return this.items.length;
  }
  get activeSearchingCount(): number {
    return this.items.filter(i => i.trang_thai === 'Đang tìm kiếm').length;
  }
  get activeFoundCount(): number {
    return this.items.filter(i => i.trang_thai === 'Đã tìm thấy').length;
  }
  get activeReturnedCount(): number {
    return this.items.filter(i => i.trang_thai === 'Đã trả khách').length;
  }
  get activeClosedCount(): number {
    return this.items.filter(i => i.trang_thai === 'Đóng yêu cầu').length;
  }

  // --- FILTERING ---
  filterData() {
    let result = [...this.items];
    this.currentPage = 1;

    // Status Dropdown Filter
    if (this.filterTrangThai !== 'Tất cả trạng thái') {
      result = result.filter(i => i.trang_thai === this.filterTrangThai);
    }

    // Search filter
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      result = result.filter(i => 
        i.ma_do_that_lac.toLowerCase().includes(search) ||
        i.ten_khach_hang.toLowerCase().includes(search) ||
        i.so_dien_thoai.includes(search) ||
        i.tuyen_xe.toLowerCase().includes(search) ||
        i.mo_ta_vat_pham.toLowerCase().includes(search)
      );
    }

    // Sort
    if (this.filterSort === 'Mới nhất tạo trước') {
      result.sort((a, b) => b.ngay_tao.localeCompare(a.ngay_tao));
    } else if (this.filterSort === 'Cũ nhất tạo trước') {
      result.sort((a, b) => a.ngay_tao.localeCompare(b.ngay_tao));
    } else if (this.filterSort === 'Theo mô tả A-Z') {
      result.sort((a, b) => a.mo_ta_vat_pham.localeCompare(b.mo_ta_vat_pham));
    }

    this.filteredItems = result;
    this.cdr.detectChanges();
  }

  // --- PAGINATION ---
  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage) || 1;
  }

  get paginatedItems(): LostItem[] {
    return this.filteredItems.slice(this.startIndex, this.endIndex);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredItems.length);
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

  // --- MODALS ---
  openCreateModal() {
    this.newItem = {
      mo_ta_vat_pham: '',
      tuyen_xe: '',
      ngay_di_chuyen: new Date().toISOString().slice(0, 10),
      vi_tri_ghe: '',
      ten_khach_hang: '',
      so_dien_thoai: '',
      email: '',
      hinh_anh: '',
      ghi_chu: ''
    };
    this.createFormSubmitted = false;
    this.showCreateModal = true;
    this.cdr.detectChanges();
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.cdr.detectChanges();
  }

  onUploadImage(event: Event, mode: 'create' | 'edit', field: 'lost' | 'found') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        if (mode === 'create') {
          this.newItem.hinh_anh = result;
        } else if (mode === 'edit' && this.editingItem) {
          if (field === 'lost') {
            this.editingItem.hinh_anh = result;
          } else {
            this.editingItem.hinh_anh_tim_thay = result;
          }
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(mode: 'create' | 'edit', field: 'lost' | 'found') {
    if (mode === 'create') {
      this.newItem.hinh_anh = '';
    } else if (mode === 'edit' && this.editingItem) {
      if (field === 'lost') {
        this.editingItem.hinh_anh = '';
      } else {
        this.editingItem.hinh_anh_tim_thay = '';
      }
    }
    this.cdr.detectChanges();
  }

  saveNewItem() {
    this.createFormSubmitted = true;
    if (!this.newItem.mo_ta_vat_pham?.trim()) {
      this.toastService.showError('Vui lòng nhập mô tả vật phẩm thất lạc');
      return;
    }
    if (!this.newItem.tuyen_xe) {
      this.toastService.showError('Vui lòng chọn tuyến xe');
      return;
    }
    if (!this.newItem.ngay_di_chuyen) {
      this.toastService.showError('Vui lòng nhập ngày di chuyển');
      return;
    }
    if (!this.newItem.ten_khach_hang?.trim()) {
      this.toastService.showError('Vui lòng nhập họ tên hành khách');
      return;
    }
    if (!this.newItem.so_dien_thoai?.trim()) {
      this.toastService.showError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!this.newItem.email?.trim()) {
      this.toastService.showError('Vui lòng nhập địa chỉ email');
      return;
    }

    const newId = 'DTL' + String(this.items.length + 1).padStart(5, '0');
    const itemToSave: LostItem = {
      ma_do_that_lac: newId,
      ma_khach_hang: null,
      ten_khach_hang: this.newItem.ten_khach_hang,
      so_dien_thoai: this.newItem.so_dien_thoai,
      email: this.newItem.email,
      tuyen_xe: this.newItem.tuyen_xe,
      ngay_di_chuyen: this.newItem.ngay_di_chuyen,
      vi_tri_ghe: this.newItem.vi_tri_ghe?.trim() || null,
      mo_ta_vat_pham: this.newItem.mo_ta_vat_pham,
      hinh_anh: this.newItem.hinh_anh?.trim() || null,
      hinh_anh_tim_thay: null,
      trang_thai: 'Đang tìm kiếm',
      ngay_tao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ngay_cap_nhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ghi_chu: this.newItem.ghi_chu || null
    };

    this.items.unshift(itemToSave);
    this.filterData();
    this.closeCreateModal();
    this.showCenteredSuccess(
      'Tiếp nhận yêu cầu thành công',
      `Yêu cầu thất lạc ${newId} đã được tạo với trạng thái 'Đang tìm kiếm'.`
    );
  }

  openEditModal(item: LostItem) {
    this.editingItem = JSON.parse(JSON.stringify(item));
    this.editFormSubmitted = false;
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItem = null;
    this.cdr.detectChanges();
  }

  onStatusChange() {
    if (this.editingItem) {
      if (this.editingItem.trang_thai === 'Đã tìm thấy' || this.editingItem.trang_thai === 'Đã trả khách') {
        if (!this.editingItem.thoi_gian_tim_thay) {
          this.editingItem.thoi_gian_tim_thay = new Date().toISOString().slice(0, 16).replace('T', ' ');
        }
        if (!this.editingItem.vi_tri_tim_thay) {
          this.editingItem.vi_tri_tim_thay = 'Trên xe khách';
        }
      }
    }
    this.cdr.detectChanges();
  }

  saveEditItem() {
    this.editFormSubmitted = true;
    if (!this.editingItem?.mo_ta_vat_pham?.trim()) {
      this.toastService.showError('Vui lòng nhập mô tả vật phẩm thất lạc');
      return;
    }
    if (!this.editingItem?.tuyen_xe) {
      this.toastService.showError('Vui lòng chọn tuyến xe');
      return;
    }
    if (!this.editingItem?.ngay_di_chuyen) {
      this.toastService.showError('Vui lòng nhập ngày di chuyển');
      return;
    }
    if (!this.editingItem?.ten_khach_hang?.trim()) {
      this.toastService.showError('Vui lòng nhập tên hành khách');
      return;
    }
    if (!this.editingItem?.so_dien_thoai?.trim()) {
      this.toastService.showError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!this.editingItem?.email?.trim()) {
      this.toastService.showError('Vui lòng nhập email');
      return;
    }

    if (this.editingItem.trang_thai === 'Đã tìm thấy' || this.editingItem.trang_thai === 'Đã trả khách') {
      if (!this.editingItem.vi_tri_tim_thay?.trim()) {
        this.toastService.showError('Vui lòng nhập vị trí tìm thấy vật phẩm');
        return;
      }
      if (!this.editingItem.thoi_gian_tim_thay?.trim()) {
        this.toastService.showError('Vui lòng nhập thời gian tìm thấy vật phẩm');
        return;
      }
    }

    const idx = this.items.findIndex(i => i.ma_do_that_lac === this.editingItem!.ma_do_that_lac);
    if (idx !== -1) {
      const original = this.items[idx];
      const hasChanged = 
        original.ten_khach_hang !== this.editingItem.ten_khach_hang ||
        original.so_dien_thoai !== this.editingItem.so_dien_thoai ||
        original.email !== this.editingItem.email ||
        original.tuyen_xe !== this.editingItem.tuyen_xe ||
        original.ngay_di_chuyen !== this.editingItem.ngay_di_chuyen ||
        original.vi_tri_ghe !== this.editingItem.vi_tri_ghe ||
        original.mo_ta_vat_pham !== this.editingItem.mo_ta_vat_pham ||
        original.hinh_anh !== this.editingItem.hinh_anh ||
        original.hinh_anh_tim_thay !== this.editingItem.hinh_anh_tim_thay ||
        original.trang_thai !== this.editingItem.trang_thai ||
        original.vi_tri_tim_thay !== this.editingItem.vi_tri_tim_thay ||
        original.thoi_gian_tim_thay !== this.editingItem.thoi_gian_tim_thay ||
        original.ghi_chu !== this.editingItem.ghi_chu;

      if (!hasChanged) {
        this.toastService.showError('Không có dữ liệu nào thay đổi');
        return;
      }

      this.editingItem.ngay_cap_nhat = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const code = this.editingItem.ma_do_that_lac;
      this.items[idx] = { ...this.editingItem! };
      this.filterData();
      this.closeEditModal();
      this.showCenteredSuccess(
        'Cập nhật thông tin thành công',
        `Yêu cầu ${code} đã được lưu thông tin mới.`
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
