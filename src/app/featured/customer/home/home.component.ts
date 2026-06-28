import { Component, OnInit, OnDestroy, ViewChild, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchableDropdownComponent } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('destinationDropdown') destinationDropdown!: SearchableDropdownComponent;

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
  selectedTrip: any = null;
  selectedSeats: string[] = [];
  passengerName = '';
  passengerPhone = '';
  passengerEmail = '';
  acceptedTerms = false;
  pickupPoint = '';
  dropoffPoint = '';
  promoCode = '';
  appliedPromo: any = null;
  showSeatLimitToast = false;
  toastMessage = '';
  toastType: 'success' | 'warning' | '' = '';
  showToast = false;
  toastTimeout: any = null;
  showPickupDropdown = false;
  showDropoffDropdown = false;
  searchPickupText = '';
  searchDropoffText = '';
  showPayment = false;
  showSuccessScreen = false;
  orderCode = '';
  ticketCode = '';
  showTicketModal = false;
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

    // Generate mock trips
    this.generateTrips();

    // Show results
    history.pushState({ step: 'results' }, '');
    this.showResults = true;
    this.selectedTrip = null;
    window.scrollTo(0, 0);
  }

  generateTrips() {
    let dateStr = '';
    if (this.searchDepartureDate) {
      const parts = this.searchDepartureDate.split('-');
      if (parts.length === 3) {
        dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    const dep = this.searchDeparture;
    const dest = this.searchDestination;

    // Find matching route
    const route = this.routesData.find(r => 
      (r.cities[0] === dep && r.cities[1] === dest) ||
      (r.cities[1] === dep && r.cities[0] === dest)
    );

    const priceVal = route ? route.price : 200000;
    const durationVal = route ? route.duration : '4 giờ';
    const distanceVal = route ? route.distance : '150 km';
    const vehicleTypes = route ? route.types : ['Limousine 20 chỗ'];

    // Helper to generate trips
    const timeSlots = ['08:00', '13:30', '19:30', '22:15'];
    this.trips = timeSlots.map((time, idx) => {
      const typeStr = vehicleTypes[idx % vehicleTypes.length];
      
      // Calculate arrival time based on duration
      // e.g. durationVal can be: "3.5 tiếng", "2 tiếng", "8.5 tiếng"
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

      // Determine seats and utilities
      let availableSeats = 15;
      let soldOutSeatsList: string[] = [];
      if (typeStr.includes('9 chỗ')) {
        availableSeats = 4;
        soldOutSeatsList = ['1A', '2A', '5A', '6A', '9A'];
      } else if (typeStr.includes('22 chỗ')) {
        availableSeats = 12;
        soldOutSeatsList = ['1A', '2A', '5A', '6A', '10A', '1B', '2B', '5B', '6B', '10B'];
      } else {
        // 34 chỗ
        availableSeats = 20;
        soldOutSeatsList = ['1A', '2A', '3A', '4A', '5A', '10A', '11A', '12A', '1B', '2B', '3B', '4B', '5B', '10B'];
      }

      // Pick points
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

  getFilteredTrips() {
    let result = [...this.trips];

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
    history.pushState({ step: 'booking' }, '');
    this.selectedTrip = trip;
    this.selectedSeats = [];
    this.passengerName = '';
    this.passengerPhone = '';
    this.passengerEmail = '';
    this.passengerNameTouched = false;
    this.passengerPhoneTouched = false;
    this.passengerEmailTouched = false;
    this.acceptedTerms = false;
    this.pickupPoint = '';
    this.dropoffPoint = '';
    this.promoCode = '';
    this.appliedPromo = null;
    this.showSeatLimitToast = false;
    this.showToast = false;
    this.toastMessage = '';
    this.toastType = '';
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
    this.searchPickupText = '';
    this.searchDropoffText = '';
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
      this.showNotification('Vui lòng chọn ít nhất một ghế.', 'warning');
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
      this.showNotification('Vui lòng chọn điểm đón.', 'warning');
      return;
    }
    if (!this.dropoffPoint) {
      this.showNotification('Vui lòng chọn điểm trả.', 'warning');
      return;
    }

    history.pushState({ step: 'payment' }, '');
    this.showPayment = true;
    this.startPaymentTimer();
    window.scrollTo(0, 0);
  }

  toggleSeat(seatId: string) {
    if (this.isSeatSoldOut(seatId)) {
      return;
    }

    const index = this.selectedSeats.indexOf(seatId);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
      this.showToast = false;
    } else {
      if (this.selectedSeats.length >= 5) {
        this.showNotification('Đã chọn đủ số ghế.', 'warning');
        return;
      }
      this.selectedSeats.push(seatId);
    }
  }

  isSeatSoldOut(seatId: string): boolean {
    if (!this.selectedTrip || !this.selectedTrip.soldOutSeats) {
      return false;
    }
    return this.selectedTrip.soldOutSeats.includes(seatId);
  }

  isSeatSelected(seatId: string): boolean {
    return this.selectedSeats.includes(seatId);
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

  getBookingSubtotal(): number {
    if (!this.selectedTrip) return 0;
    if (this.selectedTrip.type.includes('22 chỗ')) {
      let subtotal = 0;
      for (const seat of this.selectedSeats) {
        if (seat.endsWith('A')) {
          subtotal += 600000;
        } else if (seat.endsWith('B')) {
          subtotal += 390000;
        } else {
          subtotal += 390000;
        }
      }
      return subtotal;
    }
    return this.selectedSeats.length * (this.selectedTrip.price || 390000);
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
  }

  toggleDropoffDropdown() {
    this.showDropoffDropdown = !this.showDropoffDropdown;
    this.showPickupDropdown = false;
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

  goBackHome() {
    history.back();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.showPickupDropdown = false;
    this.showDropoffDropdown = false;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
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
    window.scrollTo(0, 0);
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
    history.pushState(null, '');
    window.scrollTo(0, 0);
  }

  viewTicketDetails() {
    this.showTicketModal = true;
  }

  confirmPayment() {
    this.stopPaymentTimer();
    this.orderCode = 'VIG' + Math.floor(100000 + Math.random() * 900000);
    this.ticketCode = 'VE' + Math.floor(100000 + Math.random() * 900000);
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
    if (!val) return '';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(val)) {
      if (this.passengerEmailTouched || val.includes('@')) {
        return 'Địa chỉ email không đúng định dạng';
      }
    }
    return '';
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
