import { Component, OnInit, OnDestroy, ViewChild, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchableDropdownComponent } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('destinationDropdown') destinationDropdown!: SearchableDropdownComponent;

  private router = inject(Router);
  private routerSubscription!: Subscription;

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
    'TP.HCM': ['Bến xe Miền Đông Mới', 'Bến xe Miền Tây', 'Văn phòng Quận 1', 'Văn phòng Quận 5', 'Văn phòng Quận 10', 'Ngã tư Thủ Đức', 'Ngã tư An Sương', 'Suối Tiên'],
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
    const spots = this.detailedSpots[city] || [
      `Bến xe ${city}`,
      `Văn phòng ${city}`,
      `Trạm dừng ${city}`,
      `Nội thành ${city}`,
      `Trung tâm ${city}`
    ];
    return spots[index % spots.length];
  }

  allCities = [
    'TP.HCM',
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
    { cities: ['TP.HCM', 'Cần Thơ'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '170 km', duration: '3.5 tiếng', tripsPerDay: 12, price: 180000 },
    { cities: ['TP.HCM', 'Vũng Tàu'], types: ['Limousine 9 chỗ', 'Giường nằm 34 chỗ'], distance: '100 km', duration: '2 tiếng', tripsPerDay: 20, price: 160000 },
    { cities: ['Đà Lạt', 'Buôn Ma Thuột'], types: ['Giường nằm 34 chỗ'], distance: '210 km', duration: '5 tiếng', tripsPerDay: 8, price: 220000 },
    { cities: ['Đà Lạt', 'Nha Trang'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '140 km', duration: '3 tiếng', tripsPerDay: 15, price: 170000 },
    { cities: ['Cần Thơ', 'Rạch Giá'], types: ['Giường nằm 34 chỗ', 'Limousine 9 chỗ'], distance: '115 km', duration: '2.5 tiếng', tripsPerDay: 10, price: 150000 },
    { cities: ['TP.HCM', 'Phan Thiết'], types: ['Giường nằm 34 chỗ'], distance: '200 km', duration: '4 tiếng', tripsPerDay: 18, price: 200000 },
    { cities: ['TP.HCM', 'Đà Lạt'], types: ['Cabin 22 chỗ', 'Limousine 9 chỗ'], distance: '310 km', duration: '7 tiếng', tripsPerDay: 25, price: 250000 },
    { cities: ['TP.HCM', 'Nha Trang'], types: ['Limousine 9 chỗ', 'Giường nằm 34 chỗ'], distance: '435 km', duration: '8.5 tiếng', tripsPerDay: 22, price: 300000 },
    { cities: ['Nha Trang', 'Đà Nẵng'], types: ['Limousine 9 chỗ', 'Cabin 22 chỗ'], distance: '530 km', duration: '11 tiếng', tripsPerDay: 14, price: 350000 }
  ];

  departureCities: string[] = [];
  destinationCities: string[] = [];

  ngOnInit() {
    this.checkPendingOrder();
    this.departureCities = [...this.allCities];
    this.destinationCities = [...this.allCities];
    this.startHeroTimer();
    history.replaceState(null, '');

    // Set todayDate to YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.todayDate = `${yyyy}-${mm}-${dd}`;

    // Reset customer view state when user clicks "TRANG CHỦ" or Logo (navigates to "/" or "/?...")
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      if (url === '/' || url.startsWith('/?')) {
        this.resetAllStates();
      }
    });
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

  onDepartureDateChange() {
    if (this.returnDate && this.departureDate && this.returnDate < this.departureDate) {
      this.returnDate = this.departureDate;
    }
  }

  onReturnDateChange() {
    if (this.returnDate && this.departureDate && this.returnDate < this.departureDate) {
      this.returnDate = this.departureDate;
    }
  }

  updateCitiesLists() {
    // 1. Filter destination cities based on selected departure
    if (this.departure) {
      const connected = this.routesData
        .filter(r => r.cities.includes(this.departure))
        .map(r => r.cities.find(c => c !== this.departure) || '');
      this.destinationCities = connected.filter(c => c !== '');
    } else {
      this.destinationCities = [...this.allCities];
    }

    // 2. Filter departure cities based on selected destination
    if (this.destination) {
      const connected = this.routesData
        .filter(r => r.cities.includes(this.destination))
        .map(r => r.cities.find(c => c !== this.destination) || '');
      this.departureCities = connected.filter(c => c !== '');
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
    this.departure = dep;
    this.updateCitiesLists();
    this.destination = dest;
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

  getFilteredTrips() {
    let result = [...this.trips];

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
        this.showNotification('Đã chọn chuyến đi. Vui lòng chọn chuyến về.', 'success');
        this.switchActiveTab('return');
        return;
      } else {
        this.selectedReturnTrip = trip;
        this.selectedReturnSeats = [];
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
    const index = seats.indexOf(seatId);
    if (index > -1) {
      seats.splice(index, 1);
      this.showToast = false;
    } else {
      if (seats.length >= 5) {
        this.showNotification('Đã chọn đủ số ghế.', 'warning');
        return;
      }
      seats.push(seatId);
    }
  }

  isSeatSoldOut(seatId: string, isReturn: boolean = false): boolean {
    const trip = isReturn ? this.selectedReturnTrip : (this.selectedOutboundTrip || this.selectedTrip);
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
        if (seat.endsWith('A')) outboundSubtotal += 600000;
        else outboundSubtotal += (outboundTrip.price || 390000);
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
        if (seat.endsWith('A')) returnSubtotal += 600000;
        else returnSubtotal += (this.selectedReturnTrip.price || 390000);
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
    const spots = this.detailedSpots[this.searchDeparture] || [
      `Văn phòng ${this.searchDeparture}`,
      `Bến xe trung tâm ${this.searchDeparture}`,
      `Đón tận nơi nội thành ${this.searchDeparture}`
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
    const spots = this.detailedSpots[this.searchDestination] || [
      `Văn phòng ${this.searchDestination}`,
      `Bến xe trung tâm ${this.searchDestination}`,
      `Trả tận nơi nội thành ${this.searchDestination}`
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
    const spots = this.detailedSpots[this.searchDestination] || [
      `Văn phòng ${this.searchDestination}`,
      `Bến xe trung tâm ${this.searchDestination}`,
      `Đón tận nơi nội thành ${this.searchDestination}`
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
    const spots = this.detailedSpots[this.searchDeparture] || [
      `Văn phòng ${this.searchDeparture}`,
      `Bến xe trung tâm ${this.searchDeparture}`,
      `Trả tận nơi nội thành ${this.searchDeparture}`
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
          GiaVe: this.selectedOutboundTrip?.price || this.selectedTrip?.price || 390000,
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
          GiaVe: this.selectedReturnTrip.price || 390000,
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
