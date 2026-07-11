import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router, NavigationEnd } from '@angular/router';
import { SearchableDropdownComponent } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { AuthService } from '../../../auth/auth.service';
import { VoucherService, Voucher } from '../../../core/services/voucher.service';
import { VoucherCardComponent } from '../../../shared/components/voucher-card/voucher-card.component';
import { ToastService } from '../../../shared/toast.service';
import { LunarDatePickerComponent } from '../../../shared/components/lunar-date-picker/lunar-date-picker.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent, VoucherCardComponent, LunarDatePickerComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('destinationDropdown') destinationDropdown!: SearchableDropdownComponent;
  @ViewChild('searchButton') searchButton?: ElementRef<HTMLButtonElement>;

  private router = inject(Router);
  private routerSubscription!: Subscription;
  private pendingAutoSearch = false;
  private lastAutoSearchKey = '';

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
  todayDate = '';

  // Search results visibility
  showResults = false;

  // Search parameters copy for results view
  searchTripType: 'one-way' | 'round-trip' = 'one-way';
  searchDeparture = '';
  searchDestination = '';
  searchDepartureDate = '';
  searchReturnDate = '';
  searchTicketCount = 1;

  // Filter states
  timeFilters = {
    early: false,     // 00:00 - 06:00
    morning: false,   // 06:00 - 12:00
    afternoon: false, // 12:00 - 18:00
    night: false      // 18:00 - 24:00
  };

  selectedFloor: 'lower' | 'upper' | '' = '';

  seatFilters = {
    front: false,     // 1-4
    middle: false,    // 5-8
    back: false       // 9-12
  };

  priceFilters = {
    under300: false,  // < 300.000đ
    over300: false    // >= 300.000đ
  };

  sortBy: 'earliest' | 'latest' | 'cheapest' = 'earliest';

  // Generated list of trips
  trips: any[] = [];
  activeTripId: string | null = null;
  activeSubTab: 'seats' | 'amenities' | 'schedule' | 'points' | 'policy' | null = null;

  // Booking process states
  activeTab: 'outbound' | 'return' = 'outbound';
  activeSeatTab: 'outbound' | 'return' = 'outbound';
  outboundTrips: any[] = [];
  returnTrips: any[] = [];
  selectedOutboundTrip: any = null;
  selectedReturnTrip: any = null;
  selectedTrip: any = null;
  selectedSeats: string[] = [];
  selectedReturnSeats: string[] = [];
  selectedSeatTypes: { [seatId: string]: 'single' | 'double' } = {};
  selectedReturnSeatTypes: { [seatId: string]: 'single' | 'double' } = {};
  passengerName = '';
  passengerPhone = '';
  passengerEmail = '';
  acceptedTerms = false;
  pickupPoint = '';
  dropoffPoint = '';
  returnPickupPoint = '';
  returnDropoffPoint = '';
  pickupType: 'station' | 'shuttle' = 'station';
  dropoffType: 'station' | 'shuttle' = 'station';
  returnPickupType: 'station' | 'shuttle' = 'station';
  returnDropoffType: 'station' | 'shuttle' = 'station';
  promoCode = '';
  appliedPromo: any = null;
  showSeatLimitToast = false;
  toastMessage = '';
  toastType: 'success' | 'warning' | '' = '';
  showToast = false;
  toastTimeout: any = null;
  showPickupDropdown = false;
  showDropoffDropdown = false;
  showReturnPickupDropdown = false;
  showReturnDropoffDropdown = false;
  searchPickupText = '';
  searchDropoffText = '';
  searchReturnPickupText = '';
  searchReturnDropoffText = '';
  showPayment = false;
  showSuccessScreen = false;
  orderCode = '';
  ticketCode = '';
  showTicketModal = false;
  pendingOrder: any = null;
  pendingOrderTimeLeft = 0;
  pendingOrderTimerInterval: any = null;
  passengerNameTouched = false;
  passengerPhoneTouched = false;
  passengerEmailTouched = false;
  paymentTimeLeft = 600;
  paymentTimerInterval: any = null;
  selectedPaymentMethod = 'vietqr';

  detailedSpots: { [key: string]: string[] } = {
    'TP. Hồ Chí Minh': ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
    'Cần Thơ': ['Bến xe Trung tâm Cần Thơ', 'Văn phòng Ninh Kiều', 'Bến Ninh Kiều', 'Đại học Cần Thơ'],
    'Vũng Tàu': ['Bến xe Vũng Tàu', 'Văn phòng Vũng Tàu', 'Bãi Sau', 'Bãi Trước'],
    'Đà Lạt': ['Bến xe Liên Tỉnh Đà Lạt', 'Chợ Đà Lạt', 'Hồ Xuân Hương', 'Quảng trường Lâm Viên'],
    'Nha Trang': ['Bến xe phía Nam Nha Trang', 'Ga Nha Trang', 'Quảng trường 2/4', 'Vinpearl Harbour'],
    'Buôn Ma Thuột': ['Bến xe Phía Nam Buôn Ma Thuột', 'Ngã Sáu Buôn Ma Thuột', 'Coopmart Buôn Ma Thuột'],
    'Phan Thiết': ['Bến xe Phan Thiết', 'Chợ Phan Thiết', 'Mũi Né', 'NovaWorld Phan Thiết'],
    'Đà Nẵng': ['Bến xe Trung tâm Đà Nẵng', 'Sân bay Đà Nẵng', 'Công viên Biển Đông', 'Cầu Rồng'],
    'Rạch Giá': ['Bến xe Rạch Giá', 'Bến tàu Rạch Giá', 'Văn phòng Rạch Giá']
  };

  getDetailedSpot(city: string, index: number): string {
    if (!city) return '';
    const normalizedCity = this.normalizeCityKey(city);
    const spots = this.detailedSpots[normalizedCity] || [
      `Bến xe ${normalizedCity}`,
      `Văn phòng ${normalizedCity}`,
      `Trạm dừng ${normalizedCity}`,
      `Nội thành ${normalizedCity}`,
      `Trung tâm ${normalizedCity}`
    ];
    return spots[index % spots.length];
  }

  normalizeCityKey(city: string): string {
    if (!city) return '';
    const norm = city.trim();
    const upper = norm.toUpperCase();
    if (
      upper === 'TP. HỒ CHÍ MINH' ||
      upper === 'HỒ CHÍ MINH' ||
      upper === 'TP HỒ CHÍ MINH' ||
      upper === 'TP.HCM' ||
      upper === 'TPHCM' ||
      upper === 'SÀI GÒN' ||
      upper === 'SAI GON' ||
      upper === 'SAIGON'
    ) {
      return 'TP.HCM';
    }
    const match = this.allCities.find(c => c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === norm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    if (match) {
      return match;
    }
    return norm;
  }

  allCities = [
    'TP. Hồ Chí Minh',
    'Đà Lạt',
    'Nha Trang',
    'Cần Thơ',
    'Vũng Tàu',
    'Đà Nẵng',
    'Rạch Giá',
    'Buôn Ma Thuột',
    'Phan Thiết'
  ];

  routesData = [
    { cities: ['TP. Hồ Chí Minh', 'Cần Thơ'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '170 km', duration: '3.5 tiếng', tripsPerDay: 12, price: 180000 },
    { cities: ['TP. Hồ Chí Minh', 'Vũng Tàu'], types: ['Limousine 9 chỗ', 'Giường nằm 34 chỗ'], distance: '100 km', duration: '2 tiếng', tripsPerDay: 20, price: 160000 },
    { cities: ['Đà Lạt', 'Buôn Ma Thuột'], types: ['Giường nằm 34 chỗ'], distance: '210 km', duration: '5 tiếng', tripsPerDay: 8, price: 220000 },
    { cities: ['Đà Lạt', 'Nha Trang'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '140 km', duration: '3 tiếng', tripsPerDay: 15, price: 170000 },
    { cities: ['Cần Thơ', 'Rạch Giá'], types: ['Giường nằm 34 chỗ', 'Limousine 9 chỗ'], distance: '115 km', duration: '2.5 tiếng', tripsPerDay: 10, price: 150000 },
    { cities: ['TP. Hồ Chí Minh', 'Phan Thiết'], types: ['Giường nằm 34 chỗ'], distance: '200 km', duration: '4 tiếng', tripsPerDay: 18, price: 200000 },
    { cities: ['TP. Hồ Chí Minh', 'Đà Lạt'], types: ['Cabin 22 chỗ', 'Limousine 9 chỗ'], distance: '310 km', duration: '7 tiếng', tripsPerDay: 25, price: 250000 },
    { cities: ['TP. Hồ Chí Minh', 'Nha Trang'], types: ['Limousine 9 chỗ', 'Giường nằm 34 chỗ'], distance: '435 km', duration: '8.5 tiếng', tripsPerDay: 22, price: 300000 },
    { cities: ['Nha Trang', 'Đà Nẵng'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '530 km', duration: '11 tiếng', tripsPerDay: 14, price: 350000 }
  ];

  departureCities: string[] = [];
  destinationCities: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public voucherService: VoucherService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkPendingOrder();
    this.departureCities = [...this.allCities];
    this.destinationCities = [...this.allCities];
    this.startHeroTimer();
    
    // Set todayDate to YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.todayDate = `${yyyy}-${mm}-${dd}`;
    this.departureDate = '';

    // Reset customer view state when user clicks home or logo.
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      if (url === '/' || (url.startsWith('/?') && !url.includes('from=') && !url.includes('to='))) {
        this.resetAllStates();
      }
    });

    // Read query parameters to auto-fill search panel or apply voucher
    this.route.queryParams.subscribe(params => {
      const normalizeCity = (city: string) => city === 'TP.HCM'
        ? (this.allCities.find(item => item.startsWith('TP.')) || city)
        : city;

      if (params['departure']) {
        this.departure = params['departure'] === 'TP.HCM' ? 'TP. Hồ Chí Minh' : params['departure'];
        this.updateCitiesLists();
      }

      if (params['from']) {
        this.departure = normalizeCity(params['from']);
        this.updateCitiesLists();
      }
      if (params['destination']) {
        this.destination = normalizeCity(params['destination']);
        this.updateCitiesLists();
      }
      if (params['to']) {
        this.destination = normalizeCity(params['to']);
        this.updateCitiesLists();
      }
      if (params['date']) {
        this.departureDate = params['date'];
      }

      if (params['autoSearch'] === 'true') {
        this.tripType = 'one-way';
        this.returnDate = '';
        if (!this.departureDate) {
          this.departureDate = this.todayDate;
        }

        const autoSearchKey = `${this.departure}|${this.destination}|${this.departureDate}`;
        if (autoSearchKey !== this.lastAutoSearchKey) {
          this.lastAutoSearchKey = autoSearchKey;
          this.onSubmitSearch();
        }
        return;
      }
      if (params['destination']) {
        this.destination = params['destination'] === 'TP.HCM' ? 'TP. Hồ Chí Minh' : params['destination'];
        this.updateCitiesLists();
      }
      if (params['from']) {
        this.departure = params['from'] === 'TP.HCM' ? 'TP. Hồ Chí Minh' : params['from'];
        this.updateCitiesLists();
      }
      if (params['to']) {
        this.destination = params['to'] === 'TP.HCM' ? 'TP. Hồ Chí Minh' : params['to'];
        this.updateCitiesLists();
      }
      if (params['date']) {
        this.departureDate = params['date'];
      }
      if (params['scroll']) {
        this.scrollToPageElement(params['scroll']);
      }

      if (params['autoPayment'] === 'true' || params['step'] === 'payment') {
        this.tripType = 'one-way';
        this.searchTripType = 'one-way';
        this.departure = 'TP. Hồ Chí Minh';
        this.destination = 'Đà Lạt';
        this.departureDate = '2026-07-17';
        this.searchDeparture = 'TP. Hồ Chí Minh';
        this.searchDestination = 'Đà Lạt';
        this.searchDepartureDate = '2026-07-17';
        this.ticketCount = 1;
        this.searchTicketCount = 1;

        // Mock the selected trip matching the screenshot
        this.selectedTrip = {
          id: 'mock-trip-1',
          depLocation: 'TP. Hồ Chí Minh',
          arrLocation: 'Đà Lạt',
          depCity: 'TP. Hồ Chí Minh',
          arrCity: 'Đà Lạt',
          depTime: '08:00',
          arrTime: '15:00',
          price: 250000,
          type: 'Cabin 22 chỗ'
        };
        this.selectedOutboundTrip = this.selectedTrip;

        this.selectedSeats = ['11A'];
        this.selectedSeatTypes = { '11A': 'single' };
        
        // Apply the promo VIAGO2026 to get the 225,000đ total
        this.applyPromoCode('VIAGO2026');

        this.passengerName = 'Khách hàng';
        this.passengerPhone = '0786433457';
        this.passengerEmail = 'huynh25@gmail.com';
        this.acceptedTerms = true;
        
        this.pickupPoint = '08:00 - Bến xe Miền Đông Mới';
        this.dropoffPoint = '15:00 - Hồ Xuân Hương';

        this.orderCode = 'VIG' + Math.floor(100000 + Math.random() * 900000);
        this.ticketCode = 'VE' + Math.floor(100000 + Math.random() * 900000);

        this.showResults = true;
        this.showPayment = true;
        this.selectedPaymentMethod = 'momo';

        this.paymentTimeLeft = 600;
        this.stopPaymentTimer();
        this.paymentTimerInterval = setInterval(() => {
          if (this.paymentTimeLeft > 0) {
            this.paymentTimeLeft--;
          } else {
            this.stopPaymentTimer();
          }
        }, 1000);
      }
    });
  }

  ngAfterViewInit() {
    if (this.pendingAutoSearch) {
      this.triggerSearchButtonClick();
    }
  }

  private triggerSearchButtonClick() {
    this.pendingAutoSearch = true;
    setTimeout(() => {
      if (this.searchButton?.nativeElement) {
        this.searchButton.nativeElement.click();
      } else {
        this.onSubmitSearch();
      }
      this.pendingAutoSearch = false;
    }, 100);
  }

  private scrollToPageElement(elementId: string) {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(elementPosition - headerHeight - 16, 0);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 150);
  }

  formatDateToShort(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  ngOnDestroy() {
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
    this.stopPaymentTimer();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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
    this.updateCitiesLists();
  }

  onDestinationChange(val: string) {
    this.destination = val;
    this.updateCitiesLists();
  }

  updateCitiesLists() {
    // 1. Filter destination cities based on selected departure
    if (this.departure) {
      const depCityNormalized = this.normalizeCityKey(this.departure);
      const connected = this.routesData
        .filter(r => r.cities.map(c => this.normalizeCityKey(c)).includes(depCityNormalized))
        .map(r => {
          const other = r.cities.find(c => this.normalizeCityKey(c) !== depCityNormalized);
          return other ? this.normalizeCityKey(other) : '';
        });
      this.destinationCities = this.allCities.filter(ac => connected.includes(this.normalizeCityKey(ac)));
    } else {
      this.destinationCities = [...this.allCities];
    }

    // 2. Filter departure cities based on selected destination
    if (this.destination) {
      const destCityNormalized = this.normalizeCityKey(this.destination);
      const connected = this.routesData
        .filter(r => r.cities.map(c => this.normalizeCityKey(c)).includes(destCityNormalized))
        .map(r => {
          const other = r.cities.find(c => this.normalizeCityKey(c) !== destCityNormalized);
          return other ? this.normalizeCityKey(other) : '';
        });
      this.departureCities = this.allCities.filter(ac => connected.includes(this.normalizeCityKey(ac)));
    } else {
      this.departureCities = [...this.allCities];
    }

    // Clear values if no longer valid
    if (this.departure && !this.departureCities.includes(this.departure)) {
      this.departure = '';
    }
    if (this.destination && !this.destinationCities.includes(this.destination)) {
      this.destination = '';
    }
  }

  swapLocations() {
    const tempDep = this.departure;
    const tempDest = this.destination;

    this.departure = tempDest;
    this.destination = tempDep;

    this.updateCitiesLists();
  }

  selectPopularRoute(dep: string, dest: string) {
    const stdDep = dep === 'TP.HCM' ? 'TP. Hồ Chí Minh' : dep;
    const stdDest = dest === 'TP.HCM' ? 'TP. Hồ Chí Minh' : dest;

    this.departure = stdDep;
    this.destination = stdDest;
    this.updateCitiesLists();

    if (!this.departureDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.departureDate = `${yyyy}-${mm}-${dd}`;
    }

    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  onSubmitSearch() {
    if (!this.departure) {
      this.showNotification('Vui lòng chọn điểm đi.', 'warning');
      return;
    }
    if (!this.destination) {
      this.showNotification('Vui lòng chọn điểm đến.', 'warning');
      return;
    }
    if (!this.departureDate) {
      this.showNotification('Vui lòng chọn ngày đi.', 'warning');
      return;
    }
    if (this.departureDate < this.todayDate) {
      this.showNotification('Ngày đi không được chọn ngày trong quá khứ.', 'warning');
      return;
    }
    if (this.tripType === 'round-trip' && !this.returnDate) {
      this.showNotification('Vui lòng chọn ngày về.', 'warning');
      return;
    }
    if (this.tripType === 'round-trip' && this.returnDate < this.departureDate) {
      this.showNotification('Ngày về không được trước ngày đi.', 'warning');
      return;
    }

    // Save search params
    this.searchTripType = this.tripType;
    this.searchDeparture = this.departure;
    this.searchDestination = this.destination;
    this.searchDepartureDate = this.departureDate;
    this.searchReturnDate = this.returnDate;
    this.searchTicketCount = this.ticketCount;

    // Reset selection and active tab
    this.activeTab = 'outbound';
    this.selectedOutboundTrip = null;
    this.selectedReturnTrip = null;

    // Generate mock trips
    this.generateTrips();

    // Show results
    history.pushState({ step: 'results' }, '');
    this.showResults = true;
    this.selectedTrip = null;
    this.scrollToResults();
  }

  generateTrips() {
    this.outboundTrips = this.generateTripsForRoute(
      this.searchDeparture,
      this.searchDestination,
      this.searchDepartureDate
    );

    if (this.searchTripType === 'round-trip') {
      this.returnTrips = this.generateTripsForRoute(
        this.searchDestination,
        this.searchDeparture,
        this.searchReturnDate
      );
    } else {
      this.returnTrips = [];
    }

    this.trips = this.activeTab === 'outbound' ? this.outboundTrips : this.returnTrips;
  }

  generateTripsForRoute(dep: string, dest: string, dateStrYYYYMMDD: string): any[] {
    let dateStr = '';
    if (dateStrYYYYMMDD) {
      const parts = dateStrYYYYMMDD.split('-');
      if (parts.length === 3) {
        dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    // Find matching route
    const route = this.routesData.find(r => 
      (r.cities[0] === dep && r.cities[1] === dest) ||
      (r.cities[1] === dep && r.cities[0] === dest)
    );

    const priceVal = route ? route.price : 200000;
    const durationVal = route ? route.duration : '4 giờ';
    const distanceVal = route ? route.distance : '150 km';
    const vehicleTypes = route ? route.types : ['Limousine 20 chỗ'];

    const timeSlots = ['08:00', '13:30', '19:30', '22:15'];
    return timeSlots.map((time, idx) => {
      const typeStr = vehicleTypes[idx % vehicleTypes.length];
      
      const depHours = parseInt(time.split(':')[0], 10);
      const depMins = parseInt(time.split(':')[1], 10);
      
      let durHours = 3;
      let durMins = 0;
      if (durationVal.includes('tiếng')) {
        const hoursNum = parseFloat(durationVal.replace('tiếng', '').trim());
        durHours = Math.floor(hoursNum);
        durMins = Math.round((hoursNum - durHours) * 60);
      }
      
      let arrMins = depMins + durMins;
      let arrHours = depHours + durHours + Math.floor(arrMins / 60);
      arrMins = arrMins % 60;
      arrHours = arrHours % 24;
      
      const arrTimeStr = `${String(arrHours).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}`;

      let availableSeats = 15;
      let soldOutSeatsList: string[] = [];
      if (typeStr.includes('9 chỗ')) {
        availableSeats = 4;
        soldOutSeatsList = ['1A', '2A', '5A', '6A', '9A'];
      } else if (typeStr.includes('22 chỗ')) {
        availableSeats = 12;
        soldOutSeatsList = ['1A', '2A', '5A', '6A', '10A', '1B', '2B', '5B', '6B', '10B'];
      } else {
        availableSeats = 20;
        soldOutSeatsList = ['1A', '2A', '3A', '4A', '5A', '10A', '11A', '12A', '1B', '2B', '3B', '4B', '5B', '10B'];
      }

      const depSpots = this.detailedSpots[dep] || [`Bến xe ${dep}`];
      const destSpots = this.detailedSpots[dest] || [`Bến xe ${dest}`];

      return {
        id: `${dep}-${dest}-${time}-${idx}`,
        depCity: dep,
        arrCity: dest,
        depTime: time,
        duration: durationVal,
        distance: distanceVal,
        arrTime: arrTimeStr,
        type: typeStr,
        availableSeats: availableSeats,
        price: priceVal,
        depLocation: depSpots[idx % depSpots.length],
        arrLocation: destSpots[(idx + 2) % destSpots.length],
        floor: idx % 2 === 0 ? 'lower' : 'upper',
        seatGroup: idx % 3 === 0 ? 'front' : (idx % 3 === 1 ? 'middle' : 'back'),
        date: dateStr,
        soldOutSeats: soldOutSeatsList
      };
    });
  }

  switchActiveTab(tab: 'outbound' | 'return') {
    this.activeTab = tab;
    this.trips = tab === 'outbound' ? this.outboundTrips : this.returnTrips;
    this.scrollToResults();
  }

  getFormattedDateLong(dateStr: string): string {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const weekdays = ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
    const weekday = weekdays[dateObj.getDay()];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${weekday}, ${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  }

  timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  minutesToTime(mins: number): string {
    const hours = Math.floor((mins % (24 * 60)) / 60);
    const minutes = Math.floor(mins % 60);
    const hStr = hours < 10 ? '0' + hours : '' + hours;
    const mStr = minutes < 10 ? '0' + minutes : '' + minutes;
    return `${hStr}:${mStr}`;
  }

  toggleSubTab(trip: any, subTab: 'seats' | 'amenities' | 'schedule' | 'points' | 'policy') {
    if (this.activeTripId === trip.id && this.activeSubTab === subTab) {
      this.activeTripId = null;
      this.activeSubTab = null;
    } else {
      const isSwitchingTrip = this.activeTripId !== trip.id;
      this.activeTripId = trip.id;
      this.activeSubTab = subTab;
      if (subTab === 'seats' && isSwitchingTrip) {
        this.selectedSeats = [];
        this.selectedReturnSeats = [];
        this.selectedSeatTypes = {};
        this.selectedReturnSeatTypes = {};
      }
    }
  }

  getTripStops(trip: any): any[] {
    if (!trip) return [];
    if (trip.stops) return trip.stops;

    const depCity = trip.depCity || trip.depLocation;
    const arrCity = trip.arrCity || trip.arrLocation;

    const depSpots = this.detailedSpots[depCity] || [];
    const arrSpots = this.detailedSpots[arrCity] || [];

    const names: string[] = [];
    if (depSpots.length > 0) {
      names.push(depSpots[0]);
      for (let i = 1; i < depSpots.length; i++) {
        names.push(depSpots[i]);
      }
    } else {
      names.push(depCity);
    }

    if (arrSpots.length > 0) {
      for (let i = arrSpots.length - 1; i > 0; i--) {
        if (!names.includes(arrSpots[i])) {
          names.push(arrSpots[i]);
        }
      }
      if (!names.includes(arrSpots[0])) {
        names.push(arrSpots[0]);
      }
    } else {
      if (!names.includes(arrCity)) {
        names.push(arrCity);
      }
    }

    const finalNames = names.slice(0, 6);
    const lastSpot = arrSpots[0] || arrCity;
    if (!finalNames.includes(lastSpot)) {
      if (finalNames.length < 6) {
        finalNames.push(lastSpot);
      } else {
        finalNames[5] = lastSpot;
      }
    }

    const depMins = this.timeToMinutes(trip.depTime);
    const arrMins = this.timeToMinutes(trip.arrTime);
    let diff = arrMins - depMins;
    if (diff < 0) diff += 24 * 60;

    const stopsList = [];
    const count = finalNames.length;
    for (let i = 0; i < count; i++) {
      const fraction = count > 1 ? i / (count - 1) : 0;
      const mins = Math.round(depMins + fraction * diff);
      const stopTime = this.minutesToTime(mins);
      stopsList.push({
        time: stopTime,
        name: finalNames[i],
        isStart: i === 0,
        isEnd: i === count - 1
      });
    }

    return stopsList;
  }

  getDetailedSpotsList(city: string, baseTime: string): any[] {
    const normalizedCity = this.normalizeCityKey(city);
    const spots = this.detailedSpots[normalizedCity] || [`Bến xe ${normalizedCity}`];
    const baseMins = this.timeToMinutes(baseTime);
    return spots.map((spot, idx) => {
      const offset = idx * 15;
      const mins = baseMins + offset;
      return {
        name: spot,
        time: this.minutesToTime(mins)
      };
    });
  }

  getFilteredTrips() {
    let result = [...this.trips];

    // Filter out past trips if search date is today
    const currentSearchDate = this.activeTab === 'return' ? this.searchReturnDate : this.searchDepartureDate;
    if (currentSearchDate === this.todayDate) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      result = result.filter(trip => {
        const tripMinutes = this.timeToMinutes(trip.depTime);
        return tripMinutes > currentMinutes;
      });
    }

    // Same-day return time constraint: Giờ đi lượt về phải lớn hơn Giờ đến lượt đi + 60 phút
    if (this.searchTripType === 'round-trip' && this.activeTab === 'return' && this.selectedOutboundTrip) {
      if (this.searchDepartureDate === this.searchReturnDate) {
        let outboundArrMinutes = this.timeToMinutes(this.selectedOutboundTrip.arrTime);
        const outboundDepMinutes = this.timeToMinutes(this.selectedOutboundTrip.depTime);
        
        // If arrival time is on the next day (wrapped past midnight)
        if (outboundArrMinutes < outboundDepMinutes) {
          outboundArrMinutes += 24 * 60;
        }

        const minReturnDepMinutes = outboundArrMinutes + 60; // 60 minutes buffer
        result = result.filter(trip => {
          const returnDepMinutes = this.timeToMinutes(trip.depTime);
          return returnDepMinutes >= minReturnDepMinutes;
        });
      }
    }

    // Filter by Time
    const hasTimeFilter = this.timeFilters.early || this.timeFilters.morning || this.timeFilters.afternoon || this.timeFilters.night;
    if (hasTimeFilter) {
      result = result.filter(trip => {
        const hour = parseInt(trip.depTime.split(':')[0], 10);
        if (this.timeFilters.early && hour >= 0 && hour < 6) return true;
        if (this.timeFilters.morning && hour >= 6 && hour < 12) return true;
        if (this.timeFilters.afternoon && hour >= 12 && hour < 18) return true;
        if (this.timeFilters.night && hour >= 18 && hour < 24) return true;
        return false;
      });
    }

    // Filter by Floor
    if (this.selectedFloor) {
      result = result.filter(trip => trip.floor === this.selectedFloor);
    }

    // Filter by Seat Group
    const hasSeatFilter = this.seatFilters.front || this.seatFilters.middle || this.seatFilters.back;
    if (hasSeatFilter) {
      result = result.filter(trip => {
        if (this.seatFilters.front && trip.seatGroup === 'front') return true;
        if (this.seatFilters.middle && trip.seatGroup === 'middle') return true;
        if (this.seatFilters.back && trip.seatGroup === 'back') return true;
        return false;
      });
    }

    // Filter by Price
    const hasPriceFilter = this.priceFilters.under300 || this.priceFilters.over300;
    if (hasPriceFilter) {
      result = result.filter(trip => {
        if (this.priceFilters.under300 && trip.price < 300000) return true;
        if (this.priceFilters.over300 && trip.price >= 300000) return true;
        return false;
      });
    }

    // Sorting
    if (this.sortBy === 'earliest') {
      result.sort((a, b) => a.depTime.localeCompare(b.depTime));
    } else if (this.sortBy === 'latest') {
      result.sort((a, b) => b.depTime.localeCompare(a.depTime));
    } else if (this.sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }

  resetFilters() {
    this.timeFilters = { early: false, morning: false, afternoon: false, night: false };
    this.selectedFloor = '';
    this.seatFilters = { front: false, middle: false, back: false };
    this.priceFilters = { under300: false, over300: false };
  }

  selectFloor(floor: 'lower' | 'upper') {
    if (this.selectedFloor === floor) {
      this.selectedFloor = ''; // toggle off
    } else {
      this.selectedFloor = floor;
    }
  }

  setSortBy(sort: 'earliest' | 'latest' | 'cheapest') {
    this.sortBy = sort;
  }

  selectTrip(trip: any) {
    if (this.searchTripType === 'round-trip') {
      if (this.activeTab === 'outbound') {
        this.selectedOutboundTrip = trip;
        this.selectedSeats = [];
        this.selectedSeatTypes = {};
        this.showNotification('Đã chọn chuyến đi. Vui lòng chọn chuyến về.', 'success');
        this.switchActiveTab('return');
        return;
      } else {
        this.selectedReturnTrip = trip;
        this.selectedReturnSeats = [];
        this.selectedReturnSeatTypes = {};
      }
    }

    // Process to next step
    history.pushState({ step: 'booking' }, '');
    this.selectedTrip = this.selectedOutboundTrip || trip;
    this.activeSeatTab = 'outbound';
    this.passengerName = '';
    this.passengerPhone = '';
    this.passengerEmail = '';
    this.passengerNameTouched = false;
    this.passengerPhoneTouched = false;
    this.passengerEmailTouched = false;
    this.acceptedTerms = false;
    this.pickupPoint = '';
    this.dropoffPoint = '';
    this.returnPickupPoint = '';
    this.returnDropoffPoint = '';
    this.pickupType = 'station';
    this.dropoffType = 'station';
    this.returnPickupType = 'station';
    this.returnDropoffType = 'station';
    this.promoCode = '';
    this.appliedPromo = null;
    this.showSeatLimitToast = false;
    this.showToast = false;
    this.toastMessage = '';
    this.toastType = '';
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
    this.showReturnPickupDropdown = false;
    this.showReturnDropoffDropdown = false;
    this.searchPickupText = '';
    this.searchDropoffText = '';
    this.searchReturnPickupText = '';
    this.searchReturnDropoffText = '';
    this.showPayment = false;
    this.selectedPaymentMethod = 'vietqr';
    this.stopPaymentTimer();
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    window.scrollTo(0, 0);
  }

  cancelBooking() {
    history.back();
  }

  submitBooking() {
    this.passengerNameTouched = true;
    this.passengerPhoneTouched = true;
    this.passengerEmailTouched = true;

    if (this.selectedSeats.length === 0) {
      this.showNotification('Vui lòng chọn ít nhất một ghế cho chuyến đi.', 'warning');
      return;
    }
    if (this.searchTripType === 'round-trip' && this.selectedReturnSeats.length === 0) {
      this.showNotification('Vui lòng chọn ít nhất một ghế cho chuyến về.', 'warning');
      return;
    }
    if (this.getNameError()) {
      this.showNotification(this.getNameError(), 'warning');
      return;
    }
    if (this.getPhoneError()) {
      this.showNotification(this.getPhoneError(), 'warning');
      return;
    }
    if (this.getEmailError()) {
      this.showNotification(this.getEmailError(), 'warning');
      return;
    }
    if (!this.acceptedTerms) {
      this.showNotification('Vui lòng chấp nhận điều khoản và chính sách bảo mật.', 'warning');
      return;
    }
    if (!this.pickupPoint) {
      this.showNotification('Vui lòng chọn điểm đón cho chuyến đi.', 'warning');
      return;
    }
    if (!this.dropoffPoint) {
      this.showNotification('Vui lòng chọn điểm trả cho chuyến đi.', 'warning');
      return;
    }
    if (this.searchTripType === 'round-trip') {
      if (!this.returnPickupPoint) {
        this.showNotification('Vui lòng chọn điểm đón cho chuyến về.', 'warning');
        return;
      }
      if (!this.returnDropoffPoint) {
        this.showNotification('Vui lòng chọn điểm trả cho chuyến về.', 'warning');
        return;
      }
    }

    // Pre-generate order and ticket codes
    this.orderCode = 'VIG' + Math.floor(100000 + Math.random() * 900000);
    this.ticketCode = 'VE' + Math.floor(100000 + Math.random() * 900000);

    const pendingOrderObj = {
      orderCode: this.orderCode,
      ticketCode: this.ticketCode,
      passengerName: this.passengerName,
      passengerPhone: this.passengerPhone,
      passengerEmail: this.passengerEmail || 'khachhang@gmail.com',
      tripType: this.searchTripType,
      departure: this.searchDeparture,
      destination: this.searchDestination,
      departureDate: this.searchDepartureDate,
      returnDate: this.searchReturnDate,
      pickupPoint: this.pickupPoint,
      dropoffPoint: this.dropoffPoint,
      returnPickupPoint: this.returnPickupPoint,
      returnDropoffPoint: this.returnDropoffPoint,
      selectedSeats: [...this.selectedSeats],
      selectedReturnSeats: [...this.selectedReturnSeats],
      totalAmount: this.getBookingTotal(),
      outboundTime: this.selectedOutboundTrip?.depTime || this.selectedTrip?.depTime || '',
      returnTime: this.selectedReturnTrip?.depTime || '',
      tripName: `${this.selectedOutboundTrip?.depLocation || this.selectedTrip?.depLocation || this.searchDeparture} - ${this.selectedOutboundTrip?.arrLocation || this.selectedTrip?.arrLocation || this.searchDestination}`,
      expiresAt: Date.now() + 600000
    };

    try {
      localStorage.setItem('viago_pending_order', JSON.stringify(pendingOrderObj));
    } catch (e) {
      console.error(e);
    }

    history.pushState({ step: 'payment' }, '');
    this.showPayment = true;
    this.startPaymentTimer();
    window.scrollTo(0, 0);
  }

  toggleSeat(seatId: string, isReturn: boolean = false) {
    if (this.isSeatSoldOut(seatId, isReturn)) {
      return;
    }

    const seats = isReturn ? this.selectedReturnSeats : this.selectedSeats;
    const types = isReturn ? this.selectedReturnSeatTypes : this.selectedSeatTypes;
    const index = seats.indexOf(seatId);
    if (index > -1) {
      seats.splice(index, 1);
      delete types[seatId];
      this.showToast = false;
    } else {
      if (seats.length >= 5) {
        this.showNotification('Đã chọn đủ số ghế.', 'warning');
        return;
      }
      seats.push(seatId);
      types[seatId] = 'single';
    }
  }

  isSeatSoldOut(seatId: string, isReturn: boolean = false): boolean {
    const trip = (isReturn ? this.selectedReturnTrip : (this.selectedOutboundTrip || this.selectedTrip)) || this.trips.find(t => t.id === this.activeTripId);
    if (!trip || !trip.soldOutSeats) {
      return false;
    }
    return trip.soldOutSeats.includes(seatId);
  }

  isSeatSelected(seatId: string, isReturn: boolean = false): boolean {
    const seats = isReturn ? this.selectedReturnSeats : this.selectedSeats;
    return seats.includes(seatId);
  }

  getCurrentSeatTrip(isReturn: boolean = false): any {
    if (this.searchTripType === 'round-trip') {
      return isReturn ? this.selectedReturnTrip : this.selectedOutboundTrip;
    }
    return this.selectedTrip;
  }

  applyPromoCode(code: string) {
    if (code === 'VIAGO2026') {
      this.appliedPromo = {
        code: 'VIAGO2026',
        discountPercent: 10,
        maxDiscount: 50000
      };
      this.promoCode = 'VIAGO2026';
    } else if (code === 'BANMOI') {
      this.appliedPromo = {
        code: 'BANMOI',
        discountAmount: 20000
      };
      this.promoCode = 'BANMOI';
    } else {
      this.showNotification('Mã giảm giá không hợp lệ.', 'warning');
      this.appliedPromo = null;
    }
  }

  showNotification(message: string, type: 'success' | 'warning' = 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    const duration = type === 'success' ? 5000 : 3500;
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

  removePromoCode() {
    this.appliedPromo = null;
    this.promoCode = '';
  }

  getOutboundSubtotal(): number {
    const outboundTrip = this.selectedOutboundTrip || this.selectedTrip;
    if (!outboundTrip) return 0;
    let outboundSubtotal = 0;
    if (outboundTrip.type.includes('22 chỗ')) {
      for (const seat of this.selectedSeats) {
        const type = this.selectedSeatTypes[seat] || 'single';
        if (type === 'double') {
          outboundSubtotal += (outboundTrip.price || 390000) * 2;
        } else {
          outboundSubtotal += (outboundTrip.price || 390000);
        }
      }
    } else {
      outboundSubtotal = this.selectedSeats.length * (outboundTrip.price || 390000);
    }
    return outboundSubtotal;
  }

  getReturnSubtotal(): number {
    if (this.searchTripType !== 'round-trip' || !this.selectedReturnTrip) return 0;
    let returnSubtotal = 0;
    if (this.selectedReturnTrip.type.includes('22 chỗ')) {
      for (const seat of this.selectedReturnSeats) {
        const type = this.selectedReturnSeatTypes[seat] || 'single';
        if (type === 'double') {
          returnSubtotal += (this.selectedReturnTrip.price || 390000) * 2;
        } else {
          returnSubtotal += (this.selectedReturnTrip.price || 390000);
        }
      }
    } else {
      returnSubtotal = this.selectedReturnSeats.length * (this.selectedReturnTrip.price || 390000);
    }
    return returnSubtotal;
  }

  getBookingSubtotal(): number {
    return this.getOutboundSubtotal() + this.getReturnSubtotal();
  }

  getFormattedDateShort(dateStr: string): string {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    // In javascript dateObj.getDay() returns 0 for Sunday, 1 for Monday, etc.
    const day = dateObj.getDay();
    const weekday = day === 0 ? 'Chủ nhật' : weekdays[day - 1];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${weekday}, ${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  }

  getFormattedDateDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  getDisplaySeatLabel(seat: string): string {
    if (!seat) return '';
    const match = seat.match(/^(\d+)([AB])$/);
    if (match) {
      const num = match[1];
      const char = match[2];
      return `${char}${num.padStart(2, '0')}`;
    }
    return seat;
  }

  getPickupDisplayName(point: string): string {
    if (!point) return '';
    const idx = point.indexOf(' - ');
    return idx > -1 ? point.substring(idx + 3) : point;
  }

  getPickupPriorTime(point: string, defaultTime: string): string {
    let timePart = defaultTime;
    if (point) {
      const idx = point.indexOf(' - ');
      if (idx > -1) {
        timePart = point.substring(0, idx);
      }
    }
    return this.addMinutesToTime(timePart, -15);
  }

  getDiscountAmount(): number {
    if (!this.appliedPromo) return 0;
    const subtotal = this.getBookingSubtotal();
    if (this.appliedPromo.discountPercent) {
      const discount = (subtotal * this.appliedPromo.discountPercent) / 100;
      return Math.min(discount, this.appliedPromo.maxDiscount);
    }
    if (this.appliedPromo.discountAmount) {
      return this.appliedPromo.discountAmount;
    }
    return 0;
  }

  getBookingTotal(): number {
    const total = this.getBookingSubtotal() - this.getDiscountAmount();
    return Math.max(0, total);
  }

  addMinutesToTime(timeStr: string, minsToAdd: number): string {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    let totalMins = hours * 60 + minutes + minsToAdd;
    if (totalMins < 0) {
      totalMins = (1440 + (totalMins % 1440)) % 1440;
    } else {
      totalMins = totalMins % 1440;
    }
    const newHours = Math.floor(totalMins / 60);
    const newMinutes = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  getPickupPointsList(): { time: string, name: string }[] {
    if (!this.selectedTrip) return [];
    const city = this.normalizeCityKey(this.selectedTrip.depCity || this.searchDeparture);
    const spots = this.detailedSpots[city] || [
      `Văn phòng ${city}`,
      `Bến xe trung tâm ${city}`,
      `Đón tận nơi nội thành ${city}`
    ];
    return spots.map((spot, index) => {
      return {
        time: this.addMinutesToTime(this.selectedTrip.depTime, index * 20),
        name: spot
      };
    });
  }

  getDropoffPointsList(): { time: string, name: string }[] {
    if (!this.selectedTrip) return [];
    const city = this.normalizeCityKey(this.selectedTrip.arrCity || this.searchDestination);
    const spots = this.detailedSpots[city] || [
      `Văn phòng ${city}`,
      `Bến xe trung tâm ${city}`,
      `Trả tận nơi nội thành ${city}`
    ];
    return spots.map((spot, index) => {
      return {
        time: this.addMinutesToTime(this.selectedTrip.arrTime, index * 20),
        name: spot
      };
    });
  }

  getFilteredPickupPoints(): { time: string, name: string }[] {
    const list = this.getPickupPointsList();
    if (!this.searchPickupText) return list;
    const query = this.searchPickupText.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(query) || p.time.includes(query));
  }

  getFilteredDropoffPoints(): { time: string, name: string }[] {
    const list = this.getDropoffPointsList();
    if (!this.searchDropoffText) return list;
    const query = this.searchDropoffText.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(query) || p.time.includes(query));
  }

  selectPickupPoint(point: { time: string, name: string }) {
    this.pickupPoint = `${point.time} - ${point.name}`;
    this.showPickupDropdown = false;
  }

  selectDropoffPoint(point: { time: string, name: string }) {
    this.dropoffPoint = `${point.time} - ${point.name}`;
    this.showDropoffDropdown = false;
  }

  togglePickupDropdown() {
    this.showPickupDropdown = !this.showPickupDropdown;
    this.showDropoffDropdown = false;
    this.showReturnPickupDropdown = false;
    this.showReturnDropoffDropdown = false;
  }

  toggleDropoffDropdown() {
    this.showDropoffDropdown = !this.showDropoffDropdown;
    this.showPickupDropdown = false;
    this.showReturnPickupDropdown = false;
    this.showReturnDropoffDropdown = false;
  }

  getReturnPickupPointsList(): { time: string, name: string }[] {
    if (!this.selectedReturnTrip) return [];
    const city = this.normalizeCityKey(this.selectedReturnTrip.depCity || this.searchDestination);
    const spots = this.detailedSpots[city] || [
      `Văn phòng ${city}`,
      `Bến xe trung tâm ${city}`,
      `Đón tận nơi nội thành ${city}`
    ];
    return spots.map((spot, index) => {
      return {
        time: this.addMinutesToTime(this.selectedReturnTrip.depTime, index * 20),
        name: spot
      };
    });
  }

  getReturnDropoffPointsList(): { time: string, name: string }[] {
    if (!this.selectedReturnTrip) return [];
    const city = this.normalizeCityKey(this.selectedReturnTrip.arrCity || this.searchDeparture);
    const spots = this.detailedSpots[city] || [
      `Văn phòng ${city}`,
      `Bến xe trung tâm ${city}`,
      `Trả tận nơi nội thành ${city}`
    ];
    return spots.map((spot, index) => {
      return {
        time: this.addMinutesToTime(this.selectedReturnTrip.arrTime, index * 20),
        name: spot
      };
    });
  }

  getFilteredReturnPickupPoints(): { time: string, name: string }[] {
    const list = this.getReturnPickupPointsList();
    if (!this.searchReturnPickupText) return list;
    const query = this.searchReturnPickupText.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(query) || p.time.includes(query));
  }

  getFilteredReturnDropoffPoints(): { time: string, name: string }[] {
    const list = this.getReturnDropoffPointsList();
    if (!this.searchReturnDropoffText) return list;
    const query = this.searchReturnDropoffText.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(query) || p.time.includes(query));
  }

  toggleReturnPickupDropdown() {
    this.showReturnPickupDropdown = !this.showReturnPickupDropdown;
    this.showReturnDropoffDropdown = false;
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
  }

  toggleReturnDropoffDropdown() {
    this.showReturnDropoffDropdown = !this.showReturnDropoffDropdown;
    this.showReturnPickupDropdown = false;
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
  }

  selectReturnPickupPoint(point: { time: string, name: string }) {
    this.returnPickupPoint = `${point.time} - ${point.name}`;
    this.showReturnPickupDropdown = false;
  }

  selectReturnDropoffPoint(point: { time: string, name: string }) {
    this.returnDropoffPoint = `${point.time} - ${point.name}`;
    this.showReturnDropoffDropdown = false;
  }

  getFormattedTripDate(): string {
    if (!this.searchDepartureDate) return '';
    const dateObj = new Date(this.searchDepartureDate);
    const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekday = weekdays[dateObj.getDay()];
    const parts = this.searchDepartureDate.split('-');
    if (parts.length === 3) {
      return `${weekday}, ${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return this.searchDepartureDate;
  }

  getArrivalDate(): string {
    if (!this.searchDepartureDate) return '';
    const dateObj = new Date(this.searchDepartureDate);
    
    if (this.selectedTrip && this.selectedTrip.depTime && this.selectedTrip.arrTime) {
      const depHour = parseInt(this.selectedTrip.depTime.split(':')[0], 10);
      const arrHour = parseInt(this.selectedTrip.arrTime.split(':')[0], 10);
      if (arrHour < depHour) {
        dateObj.setDate(dateObj.getDate() + 1);
      }
    }
    
    const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekday = weekdays[dateObj.getDay()];
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${weekday}, ${dd}/${mm}/${yyyy}`;
  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  }

  scrollToResults() {
    setTimeout(() => {
      const element = document.getElementById('results-container');
      const header = document.querySelector('header');
      if (element) {
        const headerHeight = header ? header.getBoundingClientRect().height : 130;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'instant'
        });
      }
    }, 50);
  }

  goBackHome() {
    history.back();
    this.scrollToTop();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
    this.showReturnPickupDropdown = false;
    this.showReturnDropoffDropdown = false;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    this.checkPendingOrder();
    const state = event.state;
    this.showTicketModal = false;
    if (!state) {
      this.showResults = false;
      this.selectedTrip = null;
      this.showPayment = false;
      this.showSuccessScreen = false;
      this.stopPaymentTimer();
    } else if (state.step === 'results') {
      this.showResults = true;
      this.selectedTrip = null;
      this.showPayment = false;
      this.showSuccessScreen = false;
      this.stopPaymentTimer();
    } else if (state.step === 'booking') {
      this.showResults = true;
      this.showPayment = false;
      this.showSuccessScreen = false;
      this.stopPaymentTimer();
    } else if (state.step === 'payment') {
      this.showResults = true;
      this.showPayment = true;
      this.showSuccessScreen = false;
      if (!this.paymentTimerInterval) {
        this.startPaymentTimer();
      }
    } else if (state.step === 'success') {
      this.showResults = true;
      this.showPayment = false;
      this.showSuccessScreen = true;
      this.stopPaymentTimer();
    }
    this.scrollToTop();
  }

  getQRColor(): string {
    switch (this.selectedPaymentMethod) {
      case 'momo':
        return '#A50064';
      case 'vnpay':
        return '#005aab';
      case 'zalopay':
        return '#00c4cc';
      default:
        return '#152C68';
    }
  }

  getFormattedPaymentTime(): string {
    const minutes = Math.floor(this.paymentTimeLeft / 60);
    const seconds = this.paymentTimeLeft % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  }

  startPaymentTimer() {
    this.stopPaymentTimer();
    this.paymentTimeLeft = 600; // 10 minutes
    this.paymentTimerInterval = setInterval(() => {
      if (this.paymentTimeLeft > 0) {
        this.paymentTimeLeft--;
      } else {
        this.stopPaymentTimer();
        this.showNotification('Hết thời gian giữ chỗ! Vui lòng thực hiện đặt vé lại.', 'warning');
        setTimeout(() => {
          this.cancelPayment();
        }, 3000);
      }
    }, 1000);
  }

  stopPaymentTimer() {
    if (this.paymentTimerInterval) {
      clearInterval(this.paymentTimerInterval);
      this.paymentTimerInterval = null;
    }
  }

  cancelPayment() {
    this.stopPaymentTimer();
    this.showPayment = false;
    this.checkPendingOrder();
    history.back();
  }

  getPaymentMethodName(): string {
    switch (this.selectedPaymentMethod) {
      case 'vietqr':
        return 'VietQR';
      case 'momo':
        return 'Ví MoMo';
      case 'vnpay':
        return 'Ví VNPay';
      case 'zalopay':
        return 'Ví ZaloPay';
      default:
        return 'Chuyển khoản';
    }
  }

  resetToHome() {
    this.showResults = false;
    this.selectedTrip = null;
    this.showPayment = false;
    this.showSuccessScreen = false;
    this.showTicketModal = false;
    this.stopPaymentTimer();
    this.checkPendingOrder();
    history.pushState(null, '');
    this.scrollToTop();
  }

  resetAllStates() {
    this.showResults = false;
    this.selectedTrip = null;
    this.selectedOutboundTrip = null;
    this.selectedReturnTrip = null;
    this.showPayment = false;
    this.showSuccessScreen = false;
    this.showTicketModal = false;
    this.stopPaymentTimer();
    this.selectedSeats = [];
    this.selectedReturnSeats = [];
    this.selectedSeatTypes = {};
    this.selectedReturnSeatTypes = {};
    this.passengerName = '';
    this.passengerPhone = '';
    this.passengerEmail = '';
    this.passengerNameTouched = false;
    this.passengerPhoneTouched = false;
    this.passengerEmailTouched = false;
    this.acceptedTerms = false;
    this.pickupPoint = '';
    this.dropoffPoint = '';
    this.returnPickupPoint = '';
    this.returnDropoffPoint = '';
    this.showReturnPickupDropdown = false;
    this.showReturnDropoffDropdown = false;
    this.searchReturnPickupText = '';
    this.searchReturnDropoffText = '';
    this.promoCode = '';
    this.appliedPromo = null;
    this.activeTripId = null;
    this.activeSubTab = null;
    this.checkPendingOrder();
    this.scrollToTop();
  }

  viewTicketDetails() {
    this.router.navigate(['/tra-cuu-ve'], {
      queryParams: {
        phone: this.passengerPhone,
        code: this.orderCode
      }
    });
  }

  confirmPayment() {
    this.stopPaymentTimer();
    if (!this.orderCode) {
      this.orderCode = 'VIG' + Math.floor(100000 + Math.random() * 900000);
    }
    if (!this.ticketCode) {
      this.ticketCode = 'VE' + Math.floor(100000 + Math.random() * 900000);
    }

    try {
      localStorage.removeItem('viago_pending_order');
      this.pendingOrder = null;
    } catch (e) {}

    const newOrder = {
      MaDonHang: this.orderCode,
      MaKhachHang: 'KH' + Math.floor(100000 + Math.random() * 900000),
      HoTenNguoiDi: this.passengerName,
      SoDienThoai: this.passengerPhone,
      Email: this.passengerEmail || 'khachhang@gmail.com',
      ThoiGianDat: new Date().toLocaleString('vi-VN'),
      SoLuongVeDaDat: this.selectedSeats.length + (this.searchTripType === 'round-trip' ? this.selectedReturnSeats.length : 0),
      TenTuyen: `${this.selectedOutboundTrip?.depLocation || this.selectedTrip?.depLocation || this.searchDeparture} - ${this.selectedOutboundTrip?.arrLocation || this.selectedTrip?.arrLocation || this.searchDestination}`,
      GioKhoiHanh: this.selectedOutboundTrip?.depTime || this.selectedTrip?.depTime || '',
      GioTra: this.selectedOutboundTrip?.arrTime || this.selectedTrip?.arrTime || '',
      DepartureDate: this.searchDepartureDate,
      DiemDon: this.getPickupDisplayName(this.pickupPoint) || (this.selectedOutboundTrip?.depLocation || this.selectedTrip?.depLocation || this.searchDeparture),
      DiemTra: this.getPickupDisplayName(this.dropoffPoint) || (this.selectedOutboundTrip?.arrLocation || this.selectedTrip?.arrLocation || this.searchDestination),
      ThoiGianCoMatTruoc: '15 phút',
      GioCanCoMat: this.getPickupPriorTime(this.pickupPoint, this.selectedOutboundTrip?.depTime || this.selectedTrip?.depTime || ''),
      TongGiaVe: this.getBookingTotal(),
      PhuongThucThanhToan: this.getPaymentMethodName(),
      TrangThaiDonHang: 'Chờ khởi hành',
      BienSoXe: '51B-123.45',
      MaDiemDon: 'MD01',
      MaDiemTra: 'MD04',
      SoLanDaSua: 0,
      GioiHanChinhSua: 2,
      MaLichTrinh: 'LT' + Math.floor(100 + Math.random() * 900),
      Tickets: [
        ...this.selectedSeats.map((seat, idx) => ({
          MaVe: `${this.ticketCode}-${idx + 1}`,
          SoGhe: seat,
          BienSoXe: '51B-123.45',
          DiemDon: this.getPickupDisplayName(this.pickupPoint) || (this.selectedOutboundTrip?.depLocation || this.selectedTrip?.depLocation || this.searchDeparture),
          DiemDonThoiGian: `${this.selectedOutboundTrip?.depTime || this.selectedTrip?.depTime || ''} - ${this.getFormattedDateDDMMYYYY(this.searchDepartureDate)}`,
          DiemTra: this.getPickupDisplayName(this.dropoffPoint) || (this.selectedOutboundTrip?.arrLocation || this.selectedTrip?.arrLocation || this.searchDestination),
          DiemTraThoiGian: `${this.selectedOutboundTrip?.arrTime || this.selectedTrip?.arrTime || ''} - ${this.getFormattedDateDDMMYYYY(this.searchDepartureDate)}`,
          GiaVe: (() => {
            const trip = this.selectedOutboundTrip || this.selectedTrip;
            if (trip?.type?.includes('22 chỗ')) {
              const type = this.selectedSeatTypes[seat] || 'single';
              return type === 'double' ? (trip.price * 2) : trip.price;
            }
            return trip?.price || 390000;
          })(),
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: `QR-${this.ticketCode}-${seat}`
        })),
        ...(this.searchTripType === 'round-trip' && this.selectedReturnTrip ? this.selectedReturnSeats.map((seat, idx) => ({
          MaVe: `${this.ticketCode}-V-${idx + 1}`,
          SoGhe: seat,
          BienSoXe: '51B-888.88',
          DiemDon: this.getPickupDisplayName(this.returnPickupPoint) || (this.selectedReturnTrip?.depLocation || this.searchDestination),
          DiemDonThoiGian: `${this.selectedReturnTrip.depTime} - ${this.getFormattedDateDDMMYYYY(this.searchReturnDate)}`,
          DiemTra: this.getPickupDisplayName(this.returnDropoffPoint) || (this.selectedReturnTrip?.arrLocation || this.searchDeparture),
          DiemTraThoiGian: `${this.selectedReturnTrip.arrTime} - ${this.getFormattedDateDDMMYYYY(this.searchReturnDate)}`,
          GiaVe: (() => {
            if (this.selectedReturnTrip?.type?.includes('22 chỗ')) {
              const type = this.selectedReturnSeatTypes[seat] || 'single';
              return type === 'double' ? (this.selectedReturnTrip.price * 2) : this.selectedReturnTrip.price;
            }
            return this.selectedReturnTrip.price || 390000;
          })(),
          TrangThaiVe: 'Chờ khởi hành',
          MaQRVe: `QR-${this.ticketCode}-V-${seat}`
        })) : [])
      ]
    };

    try {
      const savedOrdersStr = localStorage.getItem('viago_orders') || '[]';
      const savedOrders = JSON.parse(savedOrdersStr);
      if (Array.isArray(savedOrders)) {
        savedOrders.push(newOrder);
        localStorage.setItem('viago_orders', JSON.stringify(savedOrders));
      }
    } catch (e) {
      console.error('Error saving order to localStorage:', e);
    }

    this.showSuccessScreen = true;
    this.showPayment = false;
    history.pushState({ step: 'success' }, '');
    window.scrollTo(0, 0);
  }

  getNameError(): string {
    if (this.passengerNameTouched && !this.passengerName.trim()) {
      return 'Họ tên không được để trống';
    }
    return '';
  }

  getPhoneError(): string {
    const val = this.passengerPhone.trim();
    if (!val) {
      if (this.passengerPhoneTouched) {
        return 'Số điện thoại không được để trống';
      }
      return '';
    }
    if (!val.startsWith('0')) {
      return 'Số điện thoại phải bắt đầu bằng số 0';
    }
    if (val.startsWith('00')) {
      return 'Số điện thoại không được bắt đầu bằng 00';
    }
    if (/[^0-9]/.test(val)) {
      return 'Số điện thoại chỉ được chứa các chữ số';
    }
    if (val.length === 10) {
      const phonePattern = /^0[1-9][0-9]{8}$/;
      if (!phonePattern.test(val)) {
        return 'Số điện thoại không hợp lệ';
      }
      return '';
    }
    if (val.length > 10) {
      return 'Số điện thoại không được vượt quá 10 chữ số';
    }
    if (this.passengerPhoneTouched && val.length < 10) {
      return 'Số điện thoại phải gồm 10 chữ số';
    }
    return '';
  }

  getEmailError(): string {
    const val = this.passengerEmail.trim();
    if (!val) {
      if (this.passengerEmailTouched) {
        return 'Email không được để trống';
      }
      return '';
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(val)) {
      return 'Địa chỉ email không đúng định dạng';
    }
    return '';
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

  bookRoute(dep: string, dest: string): void {
    const stdDep = dep === 'TP.HCM' ? 'TP. Hồ Chí Minh' : dep;
    const stdDest = dest === 'TP.HCM' ? 'TP. Hồ Chí Minh' : dest;

    this.departure = stdDep;
    this.destination = stdDest;
    this.updateCitiesLists();
    this.cdr.detectChanges();

    const element = document.getElementById('searchPanel');
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  checkPendingOrder() {
    try {
      const stored = localStorage.getItem('viago_pending_order');
      if (stored) {
        const order = JSON.parse(stored);
        const expiresAt = order.expiresAt;
        if (expiresAt) {
          const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          if (timeLeft > 0) {
            this.pendingOrder = order;
            this.pendingOrderTimeLeft = timeLeft;
            this.startPendingOrderTimer(expiresAt);
          } else {
            localStorage.removeItem('viago_pending_order');
            this.pendingOrder = null;
            this.stopPendingOrderTimer();
          }
        } else {
          order.expiresAt = Date.now() + 600000;
          localStorage.setItem('viago_pending_order', JSON.stringify(order));
          this.pendingOrder = order;
          this.pendingOrderTimeLeft = 600;
          this.startPendingOrderTimer(order.expiresAt);
        }
      } else {
        this.pendingOrder = null;
        this.stopPendingOrderTimer();
      }
    } catch (e) {
      this.pendingOrder = null;
      this.stopPendingOrderTimer();
    }
  }

  startPendingOrderTimer(expiresAt: number) {
    this.stopPendingOrderTimer();
    this.pendingOrderTimerInterval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      if (timeLeft > 0) {
        this.pendingOrderTimeLeft = timeLeft;
      } else {
        localStorage.removeItem('viago_pending_order');
        this.pendingOrder = null;
        this.stopPendingOrderTimer();
        this.showNotification('Giao dịch giữ chỗ đã hết hạn.', 'warning');
      }
    }, 1000);
  }

  stopPendingOrderTimer() {
    if (this.pendingOrderTimerInterval) {
      clearInterval(this.pendingOrderTimerInterval);
      this.pendingOrderTimerInterval = null;
    }
  }

  getFormattedPendingTime(): string {
    const minutes = Math.floor(this.pendingOrderTimeLeft / 60);
    const seconds = this.pendingOrderTimeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  continuePendingPayment() {
    if (!this.pendingOrder) return;

    // Restore states
    this.orderCode = this.pendingOrder.orderCode;
    this.ticketCode = this.pendingOrder.ticketCode;
    this.passengerName = this.pendingOrder.passengerName;
    this.passengerPhone = this.pendingOrder.passengerPhone;
    this.passengerEmail = this.pendingOrder.passengerEmail;
    this.tripType = this.pendingOrder.tripType;
    this.searchTripType = this.pendingOrder.tripType;
    this.departure = this.pendingOrder.departure;
    this.searchDeparture = this.pendingOrder.departure;
    this.destination = this.pendingOrder.destination;
    this.searchDestination = this.pendingOrder.destination;
    this.departureDate = this.pendingOrder.departureDate;
    this.searchDepartureDate = this.pendingOrder.departureDate;
    this.returnDate = this.pendingOrder.returnDate;
    this.searchReturnDate = this.pendingOrder.returnDate;
    this.pickupPoint = this.pendingOrder.pickupPoint;
    this.dropoffPoint = this.pendingOrder.dropoffPoint;
    this.returnPickupPoint = this.pendingOrder.returnPickupPoint;
    this.returnDropoffPoint = this.pendingOrder.returnDropoffPoint;
    this.selectedSeats = [...this.pendingOrder.selectedSeats];
    this.selectedReturnSeats = [...this.pendingOrder.selectedReturnSeats];

    const totalSeats = (this.selectedSeats.length || 1) + (this.searchTripType === 'round-trip' ? this.selectedReturnSeats.length : 0);
    this.selectedTrip = {
      depLocation: this.pendingOrder.departure,
      arrLocation: this.pendingOrder.destination,
      depTime: this.pendingOrder.outboundTime,
      price: this.pendingOrder.totalAmount / totalSeats,
      type: 'Giường nằm 34 chỗ'
    };
    if (this.tripType === 'round-trip') {
      this.selectedOutboundTrip = this.selectedTrip;
      this.selectedReturnTrip = {
        depLocation: this.pendingOrder.destination,
        arrLocation: this.pendingOrder.departure,
        depTime: this.pendingOrder.returnTime,
        price: this.pendingOrder.totalAmount / totalSeats,
        type: 'Giường nằm 34 chỗ'
      };
    }

    const expiresAt = this.pendingOrder.expiresAt || (Date.now() + 600000);
    const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    this.stopPendingOrderTimer();
    this.paymentTimeLeft = timeLeft;

    this.showResults = true;
    this.showPayment = true;
    this.showSuccessScreen = false;
    history.pushState({ step: 'payment' }, '');

    this.stopPaymentTimer();
    this.paymentTimerInterval = setInterval(() => {
      if (this.paymentTimeLeft > 0) {
        this.paymentTimeLeft--;
        try {
          const stored = localStorage.getItem('viago_pending_order');
          if (stored) {
            const orderObj = JSON.parse(stored);
            orderObj.expiresAt = Date.now() + (this.paymentTimeLeft * 1000);
            localStorage.setItem('viago_pending_order', JSON.stringify(orderObj));
          }
        } catch (e) {}
      } else {
        this.stopPaymentTimer();
        this.showNotification('Hết thời gian giữ chỗ! Vui lòng thực hiện đặt vé lại.', 'warning');
        setTimeout(() => {
          this.cancelPayment();
        }, 3000);
      }
    }, 1000);

    window.scrollTo(0, 0);
  }

  cancelPendingOrder() {
    try {
      localStorage.removeItem('viago_pending_order');
      this.pendingOrder = null;
      this.stopPendingOrderTimer();
      this.showNotification('Đã hủy vé chờ thanh toán thành công.', 'success');
    } catch (e) {
      console.error(e);
    }
  }
}
