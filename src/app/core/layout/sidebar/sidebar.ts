import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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
  showEmployeeMenu = false;
  showContentMenu = false;
  showUserMenu = false;
  showProfileModal = false;

  constructor(private router: Router) {}

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

  toggleEmployeeMenu(event: Event) {
    event.preventDefault();
    this.showEmployeeMenu = !this.showEmployeeMenu;
  }

  toggleContentMenu(event: Event) {
    event.preventDefault();
    this.showContentMenu = !this.showContentMenu;
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  openProfileModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showUserMenu = false;
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  logout(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showUserMenu = false;
    this.router.navigate(['/admin/login']);
  }
}
