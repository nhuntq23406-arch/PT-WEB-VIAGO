import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class TopbarComponent {
  today: string = this.getVietnameseDate();

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleClick(event: Event): void {
    event.preventDefault();
    this.toggleSidebar.emit();
  }

  private getVietnameseDate(): string {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  }
}
