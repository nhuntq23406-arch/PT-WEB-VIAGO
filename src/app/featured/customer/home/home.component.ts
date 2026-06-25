import { Component, OnInit, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchableDropdownComponent } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { VoucherService, Voucher } from '../../../core/services/voucher.service';
import { VoucherCardComponent } from '../../../shared/components/voucher-card/voucher-card.component';
import { ToastService } from '../../../shared/toast.service';
import { LunarDatePickerComponent } from '../../../shared/components/lunar-date-picker/lunar-date-picker.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent, VoucherCardComponent, LunarDatePickerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('destinationDropdown') destinationDropdown!: SearchableDropdownComponent;

  // Checkout & Voucher Simulation State (Obsolete, kept for safety)
  ticketPrice = 250000;
  appliedVoucher: Voucher | null = null;
  voucherCodeInput = '';
  showVoucherModal = false;
  selectedModalVoucher: Voucher | null = null;
  bestVoucherRecommended: Voucher | null = null;

  // Homepage Voucher Pagination State
  currentPromoPage = 1;

  get totalPromoPages(): number {
    return Math.ceil(this.voucherService.publicVouchers.length / 3);
  }

  get paginatedPromos(): Voucher[] {
    const startIndex = (this.currentPromoPage - 1) * 3;
    return this.voucherService.publicVouchers.slice(startIndex, startIndex + 3);
  }

  prevPromoPage(): void {
    if (this.currentPromoPage > 1) {
      this.currentPromoPage--;
    }
  }

  nextPromoPage(): void {
    if (this.currentPromoPage < this.totalPromoPages) {
      this.currentPromoPage++;
    }
  }

  heroImages = [
    '/asset/images/customer/hero_banner_1.png',
    '/asset/images/customer/hero_banner_2.png',
    '/asset/images/customer/hero_banner_3.png'
  ];
  currentHeroIndex = signal(0);
  private heroIntervalId: any;

  tripType: 'one-way' | 'round-trip' = 'one-way';
  departure = '';
  destination = '';
  departureDate = '';
  returnDate = '';
  ticketCount = 1;



  allCities = [
    'TP. Hồ Chí Minh',
    'Đà Lạt',
    'Nha Trang',
    'Cần Thơ',
    'Vũng Tàu',
    'Đà Nẵng',
    'Rạch Giá',
    'Buôn Ma Thuột'
  ];

  departureCities: string[] = [];
  destinationCities: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public voucherService: VoucherService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.departureCities = [...this.allCities];
    this.destinationCities = [...this.allCities];
    this.startHeroTimer();

    // Read query parameters to auto-fill search panel or apply voucher
    this.route.queryParams.subscribe(params => {
      if (params['departure']) {
        this.departure = params['departure'];
        this.updateDestinationCities();
      }
      if (params['destination']) {
        this.destination = params['destination'];
        this.updateDestinationCities();
      }
      if (params['applyVoucher']) {
        const code = params['applyVoucher'];
        if (code === 'WELCOME50') {
          const user = this.authService.currentUser();
          if (user) {
            const isFirstTime = user.rank === 'Không có' && (user.tickets || 0) === 0 && (user.spent || 0) === 0;
            if (!isFirstTime) {
              this.toastService.showError('Mã WELCOME50 chỉ áp dụng cho chuyến đi đầu tiên của tài khoản mới.');
              return;
            }
          }
        }
        this.toastService.showSuccess(`Đã chọn áp dụng mã ${code} cho chuyến đi tiếp theo!`);
      }
    });
  }

  ngOnDestroy() {
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
  }

  startHeroTimer() {
    this.heroIntervalId = setInterval(() => {
      this.currentHeroIndex.update(idx => (idx + 1) % this.heroImages.length);
    }, 5000);
  }

  setHeroIndex(index: number) {
    this.currentHeroIndex.set(index);
    this.resetHeroTimer();
  }

  previousHeroIndex() {
    this.currentHeroIndex.update(idx => (idx - 1 + this.heroImages.length) % this.heroImages.length);
    this.resetHeroTimer();
  }

  nextHeroIndex() {
    this.currentHeroIndex.update(idx => (idx + 1) % this.heroImages.length);
    this.resetHeroTimer();
  }

  private resetHeroTimer() {
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
    this.startHeroTimer();
  }

  onDepartureChange(val: string) {
    this.departure = val;
    this.updateDestinationCities();
  }

  onDestinationChange(val: string) {
    this.destination = val;
  }

  updateDestinationCities() {
    if (this.departure === 'TP.HCM' || this.departure === 'TP. Hồ Chí Minh') {
      // If Departure is TP.HCM / TP. Hồ Chí Minh, Destination is limited to: Đà Lạt, Nha Trang, Cần Thơ, Vũng Tàu
      this.destinationCities = ['Đà Lạt', 'Nha Trang', 'Cần Thơ', 'Vũng Tàu'];
    } else if (this.departure) {
      // Exclude departure city
      this.destinationCities = this.allCities.filter(city => city !== this.departure);
    } else {
      this.destinationCities = [...this.allCities];
    }

    // Clear selected destination if it's no longer in the filtered destination list
    if (this.destination && !this.destinationCities.includes(this.destination)) {
      this.destination = '';
    }
  }

  swapLocations() {
    const tempDep = this.departure;
    const tempDest = this.destination;

    this.departure = tempDest;
    this.updateDestinationCities();

    if (this.destinationCities.includes(tempDep)) {
      this.destination = tempDep;
    } else {
      this.destination = '';
    }
  }

  onSubmitSearch() {
    if (!this.departure) {
      alert('Vui lòng chọn điểm đi.');
      return;
    }
    if (!this.destination) {
      alert('Vui lòng chọn điểm đến.');
      return;
    }
    if (!this.departureDate) {
      alert('Vui lòng chọn ngày đi.');
      return;
    }
    if (this.tripType === 'round-trip' && !this.returnDate) {
      alert('Vui lòng chọn ngày về.');
      return;
    }

    const searchParams = {
      tripType: this.tripType,
      departure: this.departure,
      destination: this.destination,
      departureDate: this.departureDate,
      returnDate: this.tripType === 'round-trip' ? this.returnDate : null,
      ticketCount: this.ticketCount
    };

    alert(`Tìm kiếm vé xe VIAGO:
- Loại vé: ${this.tripType === 'one-way' ? 'Một chiều' : 'Khứ hồi'}
- Hành trình: ${searchParams.departure} → ${searchParams.destination}
- Ngày đi: ${searchParams.departureDate}
${searchParams.returnDate ? `- Ngày về: ${searchParams.returnDate}\n` : ''}- Số vé: ${searchParams.ticketCount}`);
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // --- CHECKOUT & VOUCHER SIMULATION ---

  get checkoutSubtotal(): number {
    return this.ticketPrice * this.ticketCount;
  }

  get discountAmount(): number {
    if (!this.appliedVoucher) return 0;
    const subtotal = this.checkoutSubtotal;
    if (this.appliedVoucher.type === 'percentage') {
      return subtotal * (this.appliedVoucher.value / 100);
    } else {
      return Math.min(this.appliedVoucher.value, subtotal);
    }
  }

  get finalTotal(): number {
    return Math.max(0, this.checkoutSubtotal - this.discountAmount);
  }

  applyGuestVoucher(): void {
    if (!this.voucherCodeInput) {
      this.toastService.showError('Vui lòng nhập mã giảm giá.');
      return;
    }
    const code = this.voucherCodeInput.toUpperCase().trim();
    // Validate from public list
    const found = this.voucherService.publicVouchers.find(v => v.code === code);
    if (found) {
      this.appliedVoucher = found;
      this.toastService.showSuccess(`Áp dụng mã ${code} thành công!`);
    } else {
      const user = this.authService.currentUser();
      if (user) {
        const memberVouchers = this.voucherService.getWalletVouchers(user.id);
        const memberFound = memberVouchers.find(v => v.code === code);
        if (memberFound) {
          this.appliedVoucher = memberFound;
          this.toastService.showSuccess(`Áp dụng mã ${code} thành công!`);
          return;
        }
      }
      this.toastService.showError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  }

  openMemberVoucherModal(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    const wallet = this.voucherService.getWalletVouchers(user.id);
    if (wallet.length === 0) {
      this.toastService.showError('Ví của bạn chưa có voucher nào. Hãy lưu mã từ trang chủ!');
      return;
    }
    
    // Find the best voucher for auto-recommendation
    const best = this.getBestVoucher(wallet, this.checkoutSubtotal);
    this.bestVoucherRecommended = best;
    this.selectedModalVoucher = best; // select best by default
    this.showVoucherModal = true;
  }

  getBestVoucher(wallet: Voucher[], subtotal: number): Voucher | null {
    if (wallet.length === 0) return null;
    let bestVoucher: Voucher | null = null;
    let maxDiscount = 0;
    
    wallet.forEach(v => {
      let discount = 0;
      if (v.type === 'percentage') {
        discount = subtotal * (v.value / 100);
      } else {
        discount = v.value;
      }
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestVoucher = v;
      }
    });
    
    return bestVoucher;
  }

  confirmMemberVoucher(): void {
    if (this.selectedModalVoucher) {
      this.appliedVoucher = this.selectedModalVoucher;
      this.toastService.showSuccess(`Áp dụng mã ${this.appliedVoucher.code} thành công!`);
    }
    this.showVoucherModal = false;
  }

  removeVoucher(): void {
    this.appliedVoucher = null;
    this.voucherCodeInput = '';
    this.toastService.showSuccess('Đã hủy áp dụng mã giảm giá.');
  }

  simulatePaymentSuccess(): void {
    this.toastService.showSuccess('Thanh toán giả lập thành công! Cảm ơn bạn đã lựa chọn VIAGO.');
    this.appliedVoucher = null;
    this.voucherCodeInput = '';
  }
}
