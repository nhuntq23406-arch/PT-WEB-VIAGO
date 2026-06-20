import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
export class HomeComponent implements OnInit {
  @ViewChild('destinationDropdown') destinationDropdown!: SearchableDropdownComponent;

  tripType: 'one-way' | 'round-trip' = 'one-way';
  departure = '';
  destination = '';
  departureDate = '';
  returnDate = '';
  ticketCount = 1;

  // Dropdown states for navbar
  isServicesOpen = false;
  isAboutOpen = false;

  toggleServices(event: Event) {
    event.stopPropagation();
    this.isServicesOpen = !this.isServicesOpen;
    this.isAboutOpen = false;
  }

  toggleAbout(event: Event) {
    event.stopPropagation();
    this.isAboutOpen = !this.isAboutOpen;
    this.isServicesOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isServicesOpen = false;
    this.isAboutOpen = false;
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
}
