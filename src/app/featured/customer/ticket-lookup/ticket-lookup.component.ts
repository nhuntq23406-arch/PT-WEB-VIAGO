import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-lookup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-lookup.component.html',
  styleUrls: ['./ticket-lookup.component.css'],
})
export class TicketLookupComponent {
  showPayment = false;

  // sample booking data shown on the payment panel
  booking = {
    route: 'Quy Nhơn - Bến xe Miền Đông Mới',
    passenger: 'Nguyễn Văn A',
    phone: '0987654321',
    date: '20/06/2026',
    time: '09:00',
    seat: '12A',
    price: 390000,
  };

  openPayment() {
    this.showPayment = true;
    // in a real app you might navigate or fetch a payment session here
  }

  cancelPayment() {
    this.showPayment = false;
  }
}
