import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface LostItem {
  id: number;
  name: string;
  date: string;
  route: string;
  location: string;
  imageUrl: string;
  status: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  activeTab: 'thue-xe' | 'that-lac' = 'thue-xe';
  showSuccessModal = false;
  modalTitle = '';
  modalDesc = '';

  lostItems: LostItem[] = [
    {
      id: 1,
      name: 'Ví da đen',
      date: '23/10/2026',
      route: 'Sài Gòn - Đà Lạt',
      location: 'VP Hàng Xanh',
      imageUrl: '/asset/images/customer/wallet.png',
      status: 'Chưa nhận'
    },
    {
      id: 2,
      name: 'Điện thoại iPhone',
      date: '28/10/2026',
      route: 'Đà Nẵng - Huế',
      location: 'VP Đà Nẵng',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 3,
      name: 'Balo xám',
      date: '22/10/2026',
      route: 'Hà Nội - Sapa',
      location: 'VP Mỹ Đình',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 4,
      name: 'Đồng hồ thông minh',
      date: '29/10/2026',
      route: 'TP.HCM - Quảng Ngãi',
      location: 'VP Quảng Ngãi',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 5,
      name: 'Tai nghe Airpods',
      date: '30/10/2026',
      route: 'Sài Gòn - Nha Trang',
      location: 'VP Nha Trang',
      imageUrl: '/asset/images/customer/airpods.png',
      status: 'Chưa nhận'
    },
    {
      id: 6,
      name: 'Túi xách da nữ',
      date: '02/11/2026',
      route: 'Hà Nội - Hải Phòng',
      location: 'VP Gia Lâm',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 7,
      name: 'Kính mắt thời trang',
      date: '04/11/2026',
      route: 'Đà Lạt - Sài Gòn',
      location: 'VP Lê Hồng Phong',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 8,
      name: 'Laptop Dell',
      date: '06/11/2026',
      route: 'Huế - Đà Nẵng',
      location: 'VP Huế',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80',
      status: 'Chưa nhận'
    },
    {
      id: 9,
      name: 'Ô dù màu xanh',
      date: '07/11/2026',
      route: 'Hà Nội - Ninh Bình',
      location: 'VP Giáp Bát',
      imageUrl: '/asset/images/customer/umbrella.png',
      status: 'Chưa nhận'
    }
  ];

  paginatedLostItems: LostItem[] = [];
  lostCurrentPage = 1;
  lostPageSize = 5;
  lostTotalPages = 1;
  lostPagesArray: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkQueryParams();

    // Subscribe to router navigation events to detect tab changes on same URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkQueryParams();
    });

    this.setupLostPagination();
  }

  setupLostPagination() {
    const baseItems = [
      { name: 'Ví da đen', imageUrl: '/asset/images/customer/wallet.png' },
      { name: 'Điện thoại iPhone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80' },
      { name: 'Balo xám', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80' },
      { name: 'Đồng hồ thông minh', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tai nghe Airpods', imageUrl: '/asset/images/customer/airpods.png' },
      { name: 'Túi xách da nữ', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kính mắt thời trang', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80' },
      { name: 'Laptop Dell', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ô dù màu xanh', imageUrl: '/asset/images/customer/umbrella.png' }
    ];

    const routes = [
      'TP.HCM - Đà Lạt', 'Đà Lạt - TP.HCM',
      'TP.HCM - Nha Trang', 'Nha Trang - TP.HCM',
      'TP.HCM - Cần Thơ', 'Cần Thơ - TP.HCM',
      'TP.HCM - Vũng Tàu', 'Vũng Tàu - TP.HCM',
      'Đà Lạt - Nha Trang', 'Nha Trang - Đà Lạt',
      'Nha Trang - Đà Nẵng', 'Đà Nẵng - Nha Trang',
      'Cần Thơ - Rạch Giá', 'Rạch Giá - Cần Thơ',
      'Đà Lạt - Buôn Ma Thuột', 'Buôn Ma Thuột - Đà Lạt'
    ];
    const locations = [
      'VP Hàng Xanh', 'VP Đà Nẵng', 'VP Mỹ Đình', 'VP Quảng Ngãi', 'VP Nha Trang',
      'VP Gia Lâm', 'VP Lê Hồng Phong', 'VP Huế', 'VP Giáp Bát', 'VP Vũng Tàu'
    ];

    const fullItems: LostItem[] = [];
    for (let i = 0; i < 25; i++) {
      const base = baseItems[i % baseItems.length];
      const route = routes[i % routes.length];
      const location = locations[i % locations.length];
      
      const dateObj = new Date(2026, 9, 20 + (i % 10)); // Oct 2026
      const d = String(dateObj.getDate()).padStart(2, '0');
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const y = dateObj.getFullYear();

      const occurrence = Math.floor(i / baseItems.length) + 1;
      const displayName = occurrence === 1 ? base.name : `${base.name} #${occurrence}`;

      fullItems.push({
        id: i + 1,
        name: displayName,
        date: `${d}/${m}/${y}`,
        route: route,
        location: location,
        imageUrl: base.imageUrl,
        status: i % 4 === 0 ? 'Đã trả' : 'Chưa nhận'
      });
    }
    this.lostItems = fullItems;
    this.lostTotalPages = Math.ceil(this.lostItems.length / this.lostPageSize);
    this.lostPagesArray = Array.from({ length: this.lostTotalPages }, (_, i) => i + 1);
    this.updatePaginatedLostItems();
  }

  setLostPage(page: number) {
    if (page >= 1 && page <= this.lostTotalPages) {
      this.lostCurrentPage = page;
      this.updatePaginatedLostItems();
    }
  }

  updatePaginatedLostItems() {
    const startIndex = (this.lostCurrentPage - 1) * this.lostPageSize;
    this.paginatedLostItems = this.lostItems.slice(startIndex, startIndex + this.lostPageSize);
    this.cdr.detectChanges();
  }

  checkQueryParams() {
    const urlTree = this.router.parseUrl(this.router.url);
    const tab = urlTree.queryParams['tab'];
    if (tab === 'that-lac') {
      this.activeTab = 'that-lac';
    } else {
      this.activeTab = 'thue-xe';
    }
    this.cdr.detectChanges();
  }

  setTab(tab: 'thue-xe' | 'that-lac') {
    this.activeTab = tab;
    // Update the URL query params without reloading the page
    this.router.navigate(['/dich-vu'], {
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  submitRentalForm(event: Event) {
    event.preventDefault();
    this.modalTitle = 'Gửi Yêu Cầu Thành Công!';
    this.modalDesc = 'Yêu cầu đăng ký thuê xe của bạn đã được ghi nhận. Nhà xe sẽ liên hệ lại với bạn trong vòng 24 giờ tới để báo giá và xác nhận.';
    this.showSuccessModal = true;
  }

  submitLostForm(event: Event) {
    event.preventDefault();
    this.modalTitle = 'Khai Báo Thành Công!';
    this.modalDesc = 'Yêu cầu khai báo thất lạc tài sản của bạn đã được gửi thành công. Đội ngũ đối soát kho của VIAGO sẽ rà soát hành trình chuyến xe và liên hệ lại với bạn trong vòng 24 giờ qua số điện thoại cung cấp.';
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  alert(message: string) {
    window.alert(message);
  }
}
