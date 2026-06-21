import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
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
}
