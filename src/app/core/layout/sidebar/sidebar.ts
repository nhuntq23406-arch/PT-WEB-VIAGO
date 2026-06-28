import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
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

  // Change password modal state
  showPasswordModal = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

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

  openPasswordModal(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showPasswordModal = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin mật khẩu!');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu mới không khớp!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    this.showPasswordModal = false;
  }
}
