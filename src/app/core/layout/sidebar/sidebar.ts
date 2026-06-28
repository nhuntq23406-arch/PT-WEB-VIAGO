import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  showReportMenu = false;
  showBookingMenu = false;
  showDispatchMenu = false;
  showCustomerMenu = false;

  toggleReportMenu(event: Event) {
    event.preventDefault();
    this.showReportMenu = !this.showReportMenu;
  }

  toggleBookingMenu(event: Event) {
    event.preventDefault();
    this.showBookingMenu = !this.showBookingMenu;
  }

  toggleDispatchMenu(event: Event) {
    event.preventDefault();
    this.showDispatchMenu = !this.showDispatchMenu;
  }

  toggleCustomerMenu(event: Event) {
    event.preventDefault();
    this.showCustomerMenu = !this.showCustomerMenu;
  }
}
