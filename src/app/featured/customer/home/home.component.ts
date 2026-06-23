import { Component, OnInit, OnDestroy, ViewChild, signal } from '@angular/core';
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

  detailedSpots: { [key: string]: string[] } = {
    'TP. Hồ Chí Minh': ['Bến xe Miền Đông', 'Văn phòng Quận 5', 'Bến xe Miền Tây', 'Bến xe An Sương', 'Ngã Tư Ga'],
    'Đà Lạt': ['Bến xe Liên Tỉnh Đà Lạt', 'Văn phòng Đà Lạt', 'Chợ Đà Lạt', 'Hồ Tuyền Lâm', 'Đầu đèo Prenn'],
    'Nha Trang': ['Bến xe phía Nam Nha Trang', 'Văn phòng Nha Trang', 'Cảng Cầu Đá', 'Ngã 3 Nhà Máy Sợi', 'Bãi Dài Nha Trang'],
    'Cần Thơ': ['Bến xe Trung tâm Cần Thơ', 'Văn phòng Cần Thơ', 'Đại học Cần Thơ', 'Cầu Hưng Lợi', 'Cái Răng'],
    'Vũng Tàu': ['Bến xe Vũng Tàu', 'Văn phòng Vũng Tàu', 'Bến đá Vũng Tàu', 'Bãi Sau', 'Bãi Trước'],
    'Đà Nẵng': ['Bến xe Trung tâm Đà Nẵng', 'Văn phòng Đà Nẵng', 'Cầu Rồng', 'Ngũ Hành Sơn', 'Liên Chiểu'],
    'Rạch Giá': ['Bến xe Rạch Giá', 'Văn phòng Rạch Giá', 'Cổng chào Rạch Giá', 'Cầu Cái Sắn', 'Rạch Sỏi'],
    'Buôn Ma Thuột': ['Bến xe phía Nam BMT', 'Văn phòng BMT', 'Ngã sáu BMT', 'Đại học Tây Nguyên', 'Bến xe phía Bắc BMT'],
    'Bình Định': ['Bến xe Quy Nhơn', 'Văn phòng Quy Nhơn', 'Bến xe Bồng Sơn', 'Ngã ba Phú Tài', 'Tuy Phước'],
    'Quy Nhơn': ['Bến xe Quy Nhơn', 'Văn phòng Quy Nhơn', 'Ngã ba Phú Tài', 'Ghềnh Ráng', 'Nhơn Hội']
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

  ngOnInit() {
    this.departureCities = [...this.allCities];
    this.destinationCities = [...this.allCities];
    this.startHeroTimer();
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
    if (this.departure === 'TP.HCM') {
      // If Departure is TP.HCM, Destination is limited to: Đà Lạt, Nha Trang, Cần Thơ, Vũng Tàu
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
    this.showResults = true;
  }

  generateTrips() {
    // Format departure date to display
    let dateStr = '';
    if (this.searchDepartureDate) {
      const parts = this.searchDepartureDate.split('-');
      if (parts.length === 3) {
        dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    this.trips = [
      {
        depTime: '19:30',
        duration: '9 giờ 40 phút',
        arrTime: '05:10',
        type: 'Limousine',
        availableSeats: 15,
        price: 390000,
        depLocation: this.getDetailedSpot(this.searchDeparture, 0),
        arrLocation: this.getDetailedSpot(this.searchDestination, 0),
        floor: 'lower',
        seatGroup: 'front',
        date: dateStr
      },
      {
        depTime: '20:00',
        duration: '9 giờ 30 phút',
        arrTime: '05:30',
        type: 'Limousine',
        availableSeats: 23,
        price: 390000,
        depLocation: this.getDetailedSpot(this.searchDeparture, 1),
        arrLocation: this.getDetailedSpot(this.searchDestination, 1),
        floor: 'upper',
        seatGroup: 'middle',
        date: dateStr
      },
      {
        depTime: '17:15',
        duration: '11 giờ 57 phút',
        arrTime: '05:12',
        type: 'Limousine VIP',
        availableSeats: 5,
        price: 390000,
        depLocation: this.getDetailedSpot(this.searchDeparture, 2),
        arrLocation: this.getDetailedSpot(this.searchDestination, 2),
        floor: 'lower',
        seatGroup: 'front',
        date: dateStr
      },
      {
        depTime: '16:00',
        duration: '13 giờ 10 phút',
        arrTime: '05:10',
        type: 'Limousine',
        availableSeats: 23,
        price: 390000,
        depLocation: this.getDetailedSpot(this.searchDeparture, 3),
        arrLocation: this.getDetailedSpot(this.searchDestination, 3),
        floor: 'upper',
        seatGroup: 'back',
        date: dateStr
      },
      {
        depTime: '19:05',
        duration: '11 giờ 15 phút',
        arrTime: '06:20',
        type: 'Limousine',
        availableSeats: 9,
        price: 390000,
        depLocation: this.getDetailedSpot(this.searchDeparture, 4),
        arrLocation: this.getDetailedSpot(this.searchDestination, 4),
        floor: 'lower',
        seatGroup: 'middle',
        date: dateStr
      }
    ];
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
    alert(`Bạn đã chọn chuyến đi lúc ${trip.depTime} (${trip.depLocation} → ${trip.arrLocation}) với giá ${trip.price.toLocaleString()}đ.`);
  }

  goBackHome() {
    this.showResults = false;
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
