import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PromotionItem {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_refund';
  value: number;
  maxDiscountValue?: number;
  minOrderValue?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'upcoming' | 'expired' | 'paused';
  memberTiers?: string[]; // Bronze, Silver, Gold
  forNewCustomerOnly?: boolean;
  forBirthdayOnly?: boolean;
}

@Component({
  selector: 'app-khuyen-mai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './khuyen-mai.html',
  styleUrl: './khuyen-mai.css',
})
export class KhuyenMaiComponent implements OnInit {
  promotionsList: PromotionItem[] = [
    {
      id: 1,
      code: 'WELCOME50',
      name: 'Chào mừng khách mới - Welcome Gift',
      description: 'Giảm ngay 50.000đ cho lần đặt vé đầu tiên trên ứng dụng VIAGO. Áp dụng cho tất cả tuyến xe.',
      type: 'fixed',
      value: 50000,
      minOrderValue: 100000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 9999,
      usageCount: 1432,
      status: 'active',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: true,
      forBirthdayOnly: false,
    },
    {
      id: 2,
      code: 'EARLYBIRD15',
      name: 'Đặt sớm - Early Bird 15%',
      description: 'Giảm 15% khi đặt vé trước ít nhất 7 ngày so với ngày khởi hành. Tối đa giảm 45.000đ/vé.',
      type: 'percentage',
      value: 15,
      maxDiscountValue: 45000,
      minOrderValue: 150000,
      startDate: '2026-06-01',
      endDate: '2026-09-30',
      usageLimit: 500,
      usageCount: 213,
      status: 'active',
      memberTiers: ['Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 3,
      code: 'BDAY20',
      name: 'Mừng sinh nhật - Birthday Surprise',
      description: 'Tặng 20% ưu đãi đặc biệt trong tháng sinh nhật của bạn. Áp dụng không giới hạn tuyến.',
      type: 'percentage',
      value: 20,
      maxDiscountValue: 60000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 9999,
      usageCount: 387,
      status: 'active',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: true,
    },
    {
      id: 4,
      code: 'SUMMER30',
      name: 'Hè rực rỡ - Summer Special',
      description: 'Giảm 30.000đ cho các chuyến xe tuyến du lịch: Đà Lạt, Nha Trang, Vũng Tàu trong mùa hè 2026.',
      type: 'fixed',
      value: 30000,
      minOrderValue: 120000,
      startDate: '2026-06-15',
      endDate: '2026-08-31',
      usageLimit: 1000,
      usageCount: 654,
      status: 'active',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 5,
      code: 'GOLDVIP20',
      name: 'Đặc quyền Gold - VIP Exclusive',
      description: 'Ưu đãi đặc biệt 20% dành riêng cho hội viên Gold. Áp dụng tất cả tuyến Limousine VIP.',
      type: 'percentage',
      value: 20,
      maxDiscountValue: 80000,
      minOrderValue: 200000,
      startDate: '2026-06-01',
      endDate: '2026-12-31',
      usageLimit: 300,
      usageCount: 89,
      status: 'active',
      memberTiers: ['Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 6,
      code: 'FREEHUY',
      name: 'Miễn phí hoàn hủy - Free Cancel',
      description: 'Hoàn tiền 100% không mất phí khi hủy vé trước 24 giờ khởi hành. Áp dụng tất cả hội viên.',
      type: 'free_refund',
      value: 0,
      startDate: '2026-04-01',
      endDate: '2026-06-30',
      usageLimit: 2000,
      usageCount: 2000,
      status: 'expired',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 7,
      code: 'TETNHUE25',
      name: 'Tết Nguyên Đán 2027 - Tet Special',
      description: 'Giảm 25% cho các chuyến xe Tết. Đặt sớm có quà tặng kèm theo gói du lịch.',
      type: 'percentage',
      value: 25,
      maxDiscountValue: 100000,
      minOrderValue: 200000,
      startDate: '2027-01-01',
      endDate: '2027-02-10',
      usageLimit: 800,
      usageCount: 0,
      status: 'upcoming',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 8,
      code: 'GROUPTRIP',
      name: 'Đi nhóm - Group Booking Deal',
      description: 'Đặt từ 4 vé trở lên trên cùng một chuyến, mỗi vé được giảm 40.000đ. Áp dụng tất cả tuyến.',
      type: 'fixed',
      value: 40000,
      minOrderValue: 400000,
      startDate: '2026-07-01',
      endDate: '2026-10-31',
      usageLimit: 400,
      usageCount: 0,
      status: 'upcoming',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 9,
      code: 'MIDWEEK10',
      name: 'Ngày giữa tuần - Midweek Boost',
      description: 'Giảm 10% các chuyến xuất phát từ Thứ 2 đến Thứ 5 trong tuần để kích cầu đi lại.',
      type: 'percentage',
      value: 10,
      maxDiscountValue: 25000,
      startDate: '2026-06-01',
      endDate: '2026-07-31',
      usageLimit: 600,
      usageCount: 342,
      status: 'paused',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 10,
      code: 'APPONLY70',
      name: 'Chỉ trên App - App Exclusive',
      description: 'Giảm 70.000đ khi đặt vé qua ứng dụng VIAGO Mobile. Ưu đãi chỉ áp dụng qua app.',
      type: 'fixed',
      value: 70000,
      minOrderValue: 250000,
      startDate: '2026-05-01',
      endDate: '2026-06-15',
      usageLimit: 1500,
      usageCount: 1500,
      status: 'expired',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 11,
      code: 'SILVER10',
      name: 'Ưu đãi Silver - Silver Reward',
      description: 'Hội viên Silver nhận giảm giá 10% trên toàn bộ các tuyến xe thường. Không giới hạn số lượt.',
      type: 'percentage',
      value: 10,
      maxDiscountValue: 30000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 9999,
      usageCount: 512,
      status: 'active',
      memberTiers: ['Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
    {
      id: 12,
      code: 'LOYALTY100',
      name: 'Khách hàng thân thiết - Loyalty Cash',
      description: 'Tặng voucher 100.000đ cho khách hàng đã hoàn thành từ 10 chuyến trở lên trong năm 2026.',
      type: 'fixed',
      value: 100000,
      minOrderValue: 0,
      startDate: '2026-08-01',
      endDate: '2026-12-31',
      usageLimit: 200,
      usageCount: 0,
      status: 'upcoming',
      memberTiers: ['Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    },
  ];

  filteredPromotions: PromotionItem[] = [];
  activeTab: 'all' | 'active' | 'upcoming' | 'expired' | 'paused' = 'all';
  filterType = '';
  searchText = '';

  // Modals state
  showAddModal = false;
  showDetailModal = false;
  isEditing = false;
  selectedPromo: PromotionItem | null = null;
  newPromo: Partial<PromotionItem> = {};

  // Tabbed modal states
  modalActiveTab: 'co-ban' | 'dieu-kien' = 'co-ban';
  allTiers: string[] = ['Bronze', 'Silver', 'Gold'];
  activeDropdownId: number | null = null;

  ngOnInit() {
    this.applyFilters();
  }

  setTab(tab: 'all' | 'active' | 'upcoming' | 'expired' | 'paused') {
    this.activeTab = tab;
    this.applyFilters();
  }

  setModalTab(tab: 'co-ban' | 'dieu-kien') {
    this.modalActiveTab = tab;
  }

  toggleTier(tier: string) {
    if (!this.newPromo.memberTiers) {
      this.newPromo.memberTiers = [];
    }
    const idx = this.newPromo.memberTiers.indexOf(tier);
    if (idx > -1) {
      this.newPromo.memberTiers.splice(idx, 1);
    } else {
      this.newPromo.memberTiers.push(tier);
    }
  }

  toggleDropdown(id: number, event: Event) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.activeDropdownId = null;
  }

  applyFilters() {
    let result = this.promotionsList;

    if (this.activeTab !== 'all') {
      result = result.filter(p => p.status === this.activeTab);
    }

    if (this.filterType) {
      result = result.filter(p => p.type === this.filterType);
    }

    if (this.searchText) {
      const query = this.searchText.toLowerCase();
      result = result.filter(
        p =>
          p.code.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    this.filteredPromotions = result;
  }

  resetFilters() {
    this.filterType = '';
    this.searchText = '';
    this.applyFilters();
  }

  openDetail(promo: PromotionItem) {
    this.isEditing = true;
    this.selectedPromo = promo;
    this.newPromo = { ...promo, memberTiers: promo.memberTiers ? [...promo.memberTiers] : [] };
    this.modalActiveTab = 'co-ban';
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.selectedPromo = null;
  }

  openAddModal() {
    this.isEditing = false;
    this.selectedPromo = null;
    this.newPromo = {
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 10,
      maxDiscountValue: 30000,
      minOrderValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      usageCount: 0,
      status: 'active',
      memberTiers: ['Bronze', 'Silver', 'Gold'],
      forNewCustomerOnly: false,
      forBirthdayOnly: false,
    };
    this.modalActiveTab = 'co-ban';
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitAdd(e: Event) {
    e.preventDefault();
    if (!this.newPromo.code || !this.newPromo.name || !this.newPromo.description) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    const codeUpper = this.newPromo.code.toUpperCase().trim();

    if (this.isEditing && this.selectedPromo) {
      const idx = this.promotionsList.findIndex(p => p.id === this.selectedPromo!.id);
      if (idx > -1) {
        this.promotionsList[idx] = {
          ...this.selectedPromo,
          ...this.newPromo,
          code: codeUpper,
        } as PromotionItem;
      }
    } else {
      if (this.promotionsList.some(p => p.code === codeUpper)) {
        alert('Mã khuyến mãi này đã tồn tại trên hệ thống!');
        return;
      }
      const nextId = this.promotionsList.length > 0 ? Math.max(...this.promotionsList.map(p => p.id)) + 1 : 1;
      this.promotionsList.push({
        id: nextId,
        code: codeUpper,
        name: this.newPromo.name!,
        description: this.newPromo.description!,
        type: this.newPromo.type! as any,
        value: this.newPromo.value || 0,
        maxDiscountValue: this.newPromo.maxDiscountValue || undefined,
        minOrderValue: this.newPromo.minOrderValue || undefined,
        startDate: this.newPromo.startDate!,
        endDate: this.newPromo.endDate!,
        usageLimit: this.newPromo.usageLimit || 100,
        usageCount: 0,
        status: this.newPromo.status as any || 'active',
        memberTiers: this.newPromo.memberTiers || [],
        forNewCustomerOnly: !!this.newPromo.forNewCustomerOnly,
        forBirthdayOnly: !!this.newPromo.forBirthdayOnly,
      });
    }

    this.applyFilters();
    this.closeAddModal();
    this.closeDetail();
  }

  toggleStatus(promo: PromotionItem) {
    if (promo.status === 'active') {
      promo.status = 'paused';
    } else if (promo.status === 'paused') {
      promo.status = 'active';
    } else if (promo.status === 'upcoming') {
      promo.status = 'active';
    }
    this.applyFilters();
  }

  deletePromo(promo: PromotionItem) {
    if (confirm(`Bạn có chắc muốn xóa chương trình khuyến mãi "${promo.code}" không?`)) {
      this.promotionsList = this.promotionsList.filter(p => p.id !== promo.id);
      this.applyFilters();
    }
  }

  get totalCount() { return this.promotionsList.length; }
  get activeCount() { return this.promotionsList.filter(p => p.status === 'active').length; }
  get upcomingCount() { return this.promotionsList.filter(p => p.status === 'upcoming').length; }
  get expiredCount() { return this.promotionsList.filter(p => p.status === 'expired').length; }
  get pausedCount() { return this.promotionsList.filter(p => p.status === 'paused').length; }

  getTypeText(type: string) {
    switch (type) {
      case 'percentage': return 'Giảm %';
      case 'fixed': return 'Giảm tiền mặt';
      case 'free_refund': return 'Miễn phí hoàn hủy';
      default: return '';
    }
  }

  getStatusText(status: string) {
    switch (status) {
      case 'active': return 'Đang chạy';
      case 'upcoming': return 'Sắp diễn ra';
      case 'expired': return 'Hết hạn';
      case 'paused': return 'Tạm dừng';
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
