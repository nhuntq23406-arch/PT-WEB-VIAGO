import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voucher, VoucherService } from '../../../core/services/voucher.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voucher-card.component.html'
})
export class VoucherCardComponent {
  @Input() voucher!: Voucher;
  @Input() context: 'home' | 'wallet' | 'checkout' = 'home';
  @Input() isSelected = false;

  @Output() onSelect = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private voucherService: VoucherService,
    private toastService: ToastService,
    private router: Router
  ) {}

  get user() {
    return this.authService.currentUser();
  }

  get isClaimed(): boolean {
    const currentUser = this.user;
    if (!currentUser) return false;
    return this.voucherService.isVoucherClaimed(currentUser.id, this.voucher.code);
  }

  onActionClick(event: Event): void {
    event.stopPropagation();
    
    if (this.context === 'home') {
      const currentUser = this.user;
      if (!currentUser) {
        // Guest user: Copy to clipboard
        if (this.voucher.code === 'WELCOME50') {
          this.toastService.showError('Voucher này chỉ dành cho khách hàng đăng ký lần đầu. Hãy đăng ký tài khoản ngay để nhận ưu đãi!');
          return;
        }
        this.copyToClipboard(this.voucher.code);
      } else {
        // Member user: Save to wallet
        if (this.voucher.code === 'WELCOME50') {
          const isFirstTime = currentUser.rank === 'Không có' && (currentUser.tickets || 0) === 0 && (currentUser.spent || 0) === 0;
          if (!isFirstTime) {
            this.toastService.showError('Mã này chỉ áp dụng cho chuyến đi đầu tiên của tài khoản mới.');
            return;
          }
        }
        const success = this.voucherService.claimVoucher(currentUser.id, this.voucher);
        if (success) {
          this.toastService.showSuccess(`Đã lưu mã ${this.voucher.code} vào ví của bạn!`);
        } else {
          this.toastService.showError('Mã này đã được lưu trước đó.');
        }
      }
    } else if (this.context === 'wallet') {
      // Wallet: "Dùng ngay" -> Redirect to booking section on Home page
      this.router.navigate(['/'], { queryParams: { applyVoucher: this.voucher.code } }).then(() => {
        // Scroll to checkout simulation
        setTimeout(() => {
          const el = document.getElementById('checkout-simulation-card');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      });
    } else if (this.context === 'checkout') {
      this.onSelect.emit();
    }
  }

  private copyToClipboard(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.showSuccess('Đã sao chép mã thành công!');
      }, () => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.toastService.showSuccess('Đã sao chép mã thành công!');
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
    document.body.removeChild(textArea);
  }
}
