import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface RentalCar {
  id: number;
  title: string;
  category: string;
  mainImage: string;
  images: string[];
  interiorImages: string[];
  images360: string[];
  image360: string;
  shortDescription: string;
  description: string;
  seats: number;
  luggage: string;
  amenities: string[];
  features: string[];
  priceLabel: string;
  rating: number;
  reviewCount: number;
  reviews: { author: string; content: string; rating: number; }[];
  availableRoutes: string[];
  priceTable: { type: string; price: string; unit: string; }[];
  brand?: string;
  year?: number;
  origin?: string;
  fuelType?: string;
  transmission?: string;
}

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
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  activeTab: 'thue-xe' | 'that-lac' = 'thue-xe';
  showSuccessModal = false;
  showCarDetailModal = false;
  selectedCar: RentalCar | null = null;
  selectedImageIndex = 0;
  modalTitle = '';
  modalDesc = '';

  // 360 Degree Viewer States
  is360Mode = false;
  current360Index = 0;
  isDragging = false;
  startX = 0;

  // Rental booking form
  bookingForm = {
    fullName: '',
    phone: '',
    pickup: 'Hà Nội',
    destination: 'Sapa',
    date: '',
    guests: 1,
    notes: ''
  };

  lostItems: LostItem[] = [];
  uploadedImageName = '';
  uploadedImageUrl = '';

  paginatedLostItems: LostItem[] = [];
  lostCurrentPage = 1;
  lostPageSize = 12;
  lostTotalPages = 1;
  lostPagesArray: number[] = [];
  lostSearchText = '';
  lostRouteFilter = '';
  lostStatusFilter = '';
  filteredLostItems: LostItem[] = [];
  rentalCars: RentalCar[] = [
    {
      id: 1,
      title: 'Limousine 9 chỗ',
      category: 'Limousine VIP',
      mainImage: '/asset/images/customer/fleet/limo_9_1.png',
      images: [
        '/asset/images/customer/fleet/limo_9_1.png',
        '/asset/images/customer/fleet/limo_9_2.png',
        '/asset/images/customer/fleet/limo_9_3.png',
        '/asset/images/customer/fleet/limo_9_4.png',
        '/asset/images/customer/fleet/limo_9_5.png',
        '/asset/images/customer/fleet/limo_9_6.png'
      ],
      interiorImages: [],
      images360: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562591176-b4b190f845a7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
      ],
      image360: '/asset/images/customer/limo_360_placeholder.png',
      shortDescription: 'Phù hợp với các tuyến ngắn và trung bình, thời gian di chuyển linh hoạt, ghế ngồi rộng rãi.',
      description: 'Dòng xe Limousine 9 chỗ cao cấp thích hợp cho các tuyến đường ngắn và trung bình. Ghế ngồi được bọc da cao cấp rộng rãi, tích hợp cổng sạc USB, hệ thống điều hòa độc lập và thời gian di chuyển cực kỳ linh hoạt.',
      seats: 9,
      luggage: '2 vali lớn + 3 túi xách tay',
      amenities: ['Ghế da rộng rãi', 'Wifi tốc độ cao', 'Cổng sạc USB', 'Nước uống miễn phí', 'Đèn đọc sách cá nhân', 'Điều hòa mát lạnh'],
      features: ['Hệ thống treo êm ái', 'Rèm chống nắng', 'Hệ thống âm thanh Sony', 'Đèn nội thất LED ấm cúng', 'Ổ cắm điện tiện lợi'],
      priceLabel: 'Giá từ 1.200.000đ',
      rating: 4.9,
      reviewCount: 128,
      reviews: [
        { author: 'Nguyễn Văn An', content: 'Xe rất mới, ghế massage đi đường dài không lo mỏi. Tài xế nhiệt tình.', rating: 5 },
        { author: 'Trần Thị Mai', content: 'Nội thất quá sang xịn mịn, gia đình mình đi Đà Lạt ai cũng khen.', rating: 5 }
      ],
      availableRoutes: ['Hà Nội - Hải Phòng', 'Hà Nội - Hạ Long', 'TP.HCM - Vũng Tàu'],
      priceTable: [
        { type: 'Theo ngày (nội thành)', price: '1.200.000 đ', unit: 'Ngày' },
        { type: 'Hà Nội - Hạ Long (1 chiều)', price: '2.200.000 đ', unit: 'Chuyến' }
      ],
      brand: 'DCar Ford Transit custom Limousine',
      year: 2024,
      origin: 'Lắp ráp Việt Nam (Linh kiện Mỹ chính hãng)',
      fuelType: 'Dầu Diesel Euro 5',
      transmission: 'Số tự động 10 cấp êm ái'
    },
    {
      id: 2,
      title: 'Limousine giường nằm 34 chỗ',
      category: 'Giường Nằm VIP',
      mainImage: '/asset/images/customer/fleet/sleeper_34_1.png',
      images: [
        '/asset/images/customer/fleet/sleeper_34_1.png',
        '/asset/images/customer/fleet/sleeper_34_2.png',
        '/asset/images/customer/fleet/sleeper_34_3.png',
        '/asset/images/customer/fleet/sleeper_34_4.png',
        '/asset/images/customer/fleet/sleeper_34_5.png',
        '/asset/images/customer/fleet/sleeper_34_6.png'
      ],
      interiorImages: [],
      images360: [
        '/asset/images/customer/viago_sleeper_ext.png',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
      ],
      image360: '/asset/images/customer/bus_360_placeholder.png',
      shortDescription: 'Phiên bản cải tiến từ xe truyền thống, mở rộng không gian mỗi vị trí nhằm nâng cao sự thoải mái.',
      description: 'Limousine giường nằm 34 chỗ là phiên bản cải tiến vượt trội từ dòng xe giường nằm truyền thống. Không gian tại mỗi vị trí nằm được thiết kế rộng rãi và tối ưu hơn, trang bị cổng sạc, tai nghe, màn hình riêng, cực kỳ phù hợp với nhu cầu di chuyển phổ thông chất lượng cao.',
      seats: 34,
      luggage: 'Khung gầm rộng chứa được 30 vali lớn',
      amenities: ['Giường nằm 180 độ', 'Rèm kéo riêng tư', 'Tivi LCD & Tai nghe', 'Cổng sạc điện thoại', 'Nước uống & khăn lạnh', 'Chăn gối kháng khuẩn'],
      features: ['Giảm xóc bầu hơi êm ái', 'Hệ thống lọc khí tươi', 'Đèn đọc sách cá nhân', 'Đai an toàn 3 điểm', 'Wifi 5G tốc độ cao'],
      priceLabel: 'Giá từ 3.500.000đ',
      rating: 4.8,
      reviewCount: 92,
      reviews: [
        { author: 'Phạm Minh Đức', content: 'Xe chạy siêu êm, giường ngủ riêng rất thoải mái, như khách sạn di động vậy.', rating: 5 }
      ],
      availableRoutes: ['Hà Nội - Sapa', 'Hà Nội - Hà Giang', 'TP.HCM - Nha Trang'],
      priceTable: [
        { type: 'Hành trình 1 chiều', price: '3.500.000 đ', unit: 'Chuyến' },
        { type: 'Khứ hồi 2 ngày 1 đêm', price: '6.500.000 đ', unit: 'Chuyến' }
      ],
      brand: 'Thaco Mobihome Premium 34 Phòng',
      year: 2023,
      origin: 'Lắp ráp linh kiện CKD nhập khẩu',
      fuelType: 'Dầu Diesel thân thiện môi trường',
      transmission: 'Số sàn 6 cấp chịu tải êm ái'
    },
    {
      id: 3,
      title: 'Limousine 22 giường phòng (có WC)',
      category: 'Cabin Cung Điện',
      mainImage: '/asset/images/customer/fleet/cabin_22_1.png',
      images: [
        '/asset/images/customer/fleet/cabin_22_1.png',
        '/asset/images/customer/fleet/cabin_22_2.png',
        '/asset/images/customer/fleet/cabin_22_3.png',
        '/asset/images/customer/fleet/cabin_22_4.png',
        '/asset/images/customer/fleet/cabin_22_5.png',
        '/asset/images/customer/fleet/cabin_22_6.png'
      ],
      interiorImages: [],
      images360: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        '/asset/images/customer/viago_sleeper_ext.png'
      ],
      image360: '/asset/images/customer/sleeper_360_placeholder.png',
      shortDescription: 'Cabin riêng biệt đảm bảo tính riêng tư trên hành trình dài, tích hợp nhà vệ sinh trên xe.',
      description: 'Dòng xe hạng thương gia cao cấp nhất với 22 giường phòng cung điện riêng biệt. Đảm bảo tính riêng tư tuyệt đối cho hành khách trên các hành trình dài nhờ hệ thống vách ngăn và rèm độc lập, đặc biệt có tích hợp nhà vệ sinh (WC) khép kín ngay trên xe tăng tính tiện lợi tối đa.',
      seats: 22,
      luggage: 'Khoang chứa đồ dung tích lớn',
      amenities: ['Giường nằm massage', 'WC khép kín trên xe', 'Rèm cửa riêng tư độc lập', 'Rạp phim mini tại chỗ', 'Wifi 5G & Tai nghe riêng', 'Nước uống & Bánh ngọt'],
      features: ['Hệ thống giảm xóc hơi Universe', 'Đèn LED vòm hoàng gia', 'Cửa gió điều hòa thông minh', 'Cổng sạc đa năng', 'Kính tối màu chống tia UV'],
      priceLabel: 'Giá từ 4.500.000đ',
      rating: 4.95,
      reviewCount: 156,
      reviews: [
        { author: 'Quỳnh Anh', content: 'Cabin rất rộng, đi đêm ngủ một giấc thoải mái, có WC trên xe nên cực kỳ tiện.', rating: 5 }
      ],
      availableRoutes: ['Hà Nội - Sapa', 'TP.HCM - Đà Lạt', 'TP.HCM - Nha Trang'],
      priceTable: [
        { type: 'Hành trình 1 chiều', price: '4.500.000 đ', unit: 'Chuyến' },
        { type: 'Khứ hồi 3 ngày 2 đêm', price: '8.500.000 đ', unit: 'Chuyến' }
      ],
      brand: 'Tracomeco Hyundai Universe 22 Phòng',
      year: 2024,
      origin: 'Nhập khẩu 3 cục từ Hyundai Hàn Quốc',
      fuelType: 'Dầu Diesel tăng áp công suất lớn',
      transmission: 'Số sàn 6 cấp thế hệ mới'
    }
  ];

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

    // Do not default select a car on load so that the fleet list of 3 cars shows up first
    this.selectedCar = null;
  }

  on360DragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.getClientX(event);
  }

  on360DragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.selectedCar?.images360?.length) return;
    const currentX = this.getClientX(event);
    const diff = currentX - this.startX;
    if (Math.abs(diff) > 15) {
      const frames = this.selectedCar.images360.length;
      const change = Math.floor(diff / 15);
      this.current360Index = (this.current360Index - change + frames) % frames;
      this.startX = currentX;
      this.cdr.detectChanges();
    }
  }

  on360DragEnd() {
    this.isDragging = false;
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  }

  prev360() {
    if (!this.selectedCar?.images360?.length) return;
    const len = this.selectedCar.images360.length;
    this.current360Index = (this.current360Index - 1 + len) % len;
  }

  next360() {
    if (!this.selectedCar?.images360?.length) return;
    const len = this.selectedCar.images360.length;
    this.current360Index = (this.current360Index + 1) % len;
  }

  enable360Mode() {
    this.is360Mode = true;
    this.current360Index = 0;
  }

  disable360Mode() {
    this.is360Mode = false;
  }

  selectCar(car: RentalCar) {
    this.selectedCar = car;
    this.is360Mode = false;
    this.selectedImageIndex = 0;
    this.bookingForm.pickup = car.availableRoutes[0]?.split(' - ')[0] || 'Hà Nội';
    this.bookingForm.destination = car.availableRoutes[0]?.split(' - ')[1] || 'Sapa';
    this.cdr.detectChanges();
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
    const filtered = this.lostItems.filter(item => {
      const matchSearch = !this.lostSearchText || item.name.toLowerCase().includes(this.lostSearchText.trim().toLowerCase());
      const matchRoute = !this.lostRouteFilter || item.route.includes(this.lostRouteFilter);
      const matchStatus = !this.lostStatusFilter || item.status === this.lostStatusFilter;
      return matchSearch && matchRoute && matchStatus;
    });

    // Sort: unclaimed items first, claimed ('Đã trả') pushed to the bottom
    this.filteredLostItems = [
      ...filtered.filter(i => i.status !== 'Đã trả'),
      ...filtered.filter(i => i.status === 'Đã trả')
    ];

    this.lostTotalPages = Math.max(1, Math.ceil(this.filteredLostItems.length / this.lostPageSize));
    this.lostPagesArray = Array.from({ length: this.lostTotalPages }, (_, i) => i + 1);
    
    if (this.lostCurrentPage > this.lostTotalPages) {
      this.lostCurrentPage = this.lostTotalPages;
    }

    const startIndex = (this.lostCurrentPage - 1) * this.lostPageSize;
    this.paginatedLostItems = this.filteredLostItems.slice(startIndex, startIndex + this.lostPageSize);
    this.cdr.detectChanges();
  }

  onLostFilterChange() {
    this.lostCurrentPage = 1;
    this.updatePaginatedLostItems();
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
    if (tab === 'thue-xe') {
      this.selectedCar = null;
    }
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
  onLostImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadedImageName = file.name;
      this.uploadedImageUrl = URL.createObjectURL(file);
    }
  }

  submitLostForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const descInput = form.querySelector('#desc-input') as HTMLInputElement;
    const routeSelect = form.querySelector('select') as HTMLSelectElement;
    
    const itemName = descInput?.value || 'Hành lý thất lạc';
    const routeText = routeSelect?.options[routeSelect.selectedIndex]?.text || 'Tuyến chưa xác định';
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();

    const newItem = {
      id: this.lostItems.length + 1,
      name: itemName,
      date: `${d}/${m}/${y}`,
      route: routeText.replace('→', '-').replace('→', '-'),
      location: 'Kho thất lạc VIAGO',
      imageUrl: this.uploadedImageUrl || '/asset/images/customer/hero_banner.png',
      status: 'Chưa nhận'
    };

    this.lostItems = [newItem, ...this.lostItems];
    this.updatePaginatedLostItems();

    this.uploadedImageName = '';
    this.uploadedImageUrl = '';
    form.reset();

    this.modalTitle = 'Khai Báo Thành Công!';
    this.modalDesc = 'Yêu cầu khai báo thất lạc của bạn đã được ghi nhận. VIAGO đã cập nhật vật phẩm này vào danh sách đối soát. Hệ thống sẽ liên hệ lại với bạn trong vòng 24 giờ qua số điện thoại cung cấp.';
    this.showSuccessModal = true;
  }

  closeCarDetail() {
    this.showCarDetailModal = false;
    this.selectedCar = null;
    this.selectedImageIndex = 0;
  }

  openCarDetail(car: RentalCar) {
    this.selectedCar = car;
    this.selectedImageIndex = 0;
    this.showCarDetailModal = true;
  }

  setDetailImage(index: number) {
    if (this.selectedCar && index >= 0 && index < this.selectedCar.images.length) {
      this.selectedImageIndex = index;
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  alert(message: string) {
    window.alert(message);
  }
}
