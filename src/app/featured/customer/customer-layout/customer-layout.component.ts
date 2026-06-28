import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {
  isServicesOpen = false;
  isAboutOpen = false;

  constructor(public router: Router) {}

  isAboutRouteActive(): boolean {
    const activeRoutes = ['/ve-chung-toi', '/chinh-sach', '/dieu-khoan', '/faq', '/lien-he', '/tuyen-dung'];
    return activeRoutes.some(route => this.router.url.includes(route));
  }

  isServicesRouteActive(): boolean {
    return this.router.url.includes('/dich-vu');
  }

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
}
