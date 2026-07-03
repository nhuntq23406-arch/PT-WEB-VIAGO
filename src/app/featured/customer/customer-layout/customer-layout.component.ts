import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ChatBotComponent } from '../ChatBot/chatbot';
import { AuthService } from '../../../auth/auth.service';
import { AuthModalComponent } from '../../../auth/auth-modal/auth-modal.component';
import { SecuritySettingsModalComponent } from '../../../auth/security-settings-modal/security-settings-modal.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AuthModalComponent,
    SecuritySettingsModalComponent, ChatBotComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {
  isServicesOpen = false;
  isAboutOpen = false;
  
  // Auth popup & settings state
  showAuthModal = false;
  showSecurityModal = false;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  isAboutRouteActive(): boolean {
    const activeRoutes = ['/ve-chung-toi', '/gioi-thieu', '/chinh-sach', '/dieu-khoan', '/faq', '/lien-he', '/tuyen-dung'];
    return activeRoutes.some(route => this.router.url.includes(route));
  }

  isServicesRouteActive(): boolean {
    return this.router.url.includes('/dich-vu');
  }

  toggleServices(event: Event) {
    event.stopPropagation();
    this.isServicesOpen = !this.isServicesOpen;
    this.isAboutOpen = false;
    this.isDropdownOpen = false;
  }

  toggleAbout(event: Event) {
    event.stopPropagation();
    this.isAboutOpen = !this.isAboutOpen;
    this.isServicesOpen = false;
    this.isDropdownOpen = false;
  }

  // Auth actions
  openAuthModal(): void {
    this.showAuthModal = true;
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
  }

  openSecurityModal(): void {
    this.showSecurityModal = true;
    this.isDropdownOpen = false;
  }

  closeSecurityModal(): void {
    this.showSecurityModal = false;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isServicesOpen = false;
    this.isAboutOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isServicesOpen = false;
    this.isAboutOpen = false;
    this.isDropdownOpen = false;
  }

  onHomeClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/'], { queryParams: { reset: Date.now() } });
  }
}
