import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;

  showReportMenu = false;
  showBookingMenu = false;
  showDispatchMenu = false;
  showCustomerMenu = false;
  showEmployeeMenu = false;
  showContentMenu = false;
  showUserMenu = false;
  showProfileModal = false;
  avatarUrl = '/asset/img/admin/user_avartar.png';
  tempAvatarUrl = '';

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
    this.tempAvatarUrl = this.avatarUrl; // initialize temp preview
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  saveProfile() {
    this.avatarUrl = this.tempAvatarUrl; // apply temp preview to official avatar on save
    alert('Lưu thông tin cá nhân thành công!');
    this.closeProfileModal();
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Constraint: only allow image files
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ chọn tệp hình ảnh!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.tempAvatarUrl = e.target.result as string; // update temp preview
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
