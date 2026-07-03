import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  constructor(private router: Router) {}

  goToRentalServices() {
    this.router.navigate(['/dich-vu'], {
      queryParams: { tab: 'thue-xe' }
    });
  }

  goToSchedule() {
    this.router.navigate(['/lich-trinh']);
  }

  goToBookingSection() {
    this.router.navigate(['/'], {
      queryParams: { scroll: 'booking-form-card' }
    });
  }
}
