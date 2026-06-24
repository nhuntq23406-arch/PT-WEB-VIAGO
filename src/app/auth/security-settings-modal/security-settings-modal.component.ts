import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthConfig, ActivityLog } from '../auth.service';

@Component({
  selector: 'app-security-settings-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './security-settings-modal.component.html',
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; backdrop-filter: blur(0px); }
      to { opacity: 1; backdrop-filter: blur(4px); }
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.96) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-backdrop {
      animation: fadeIn 0.2s ease-out forwards;
    }
    .modal-card {
      animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class SecuritySettingsModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  configForm!: FormGroup;
  logs: ActivityLog[] = [];
  activeTab: 'logs' | 'config' = 'logs';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentConfig = this.authService.config();
    this.configForm = this.fb.group({
      maxFailedAttempts: [currentConfig.maxFailedAttempts, [Validators.required, Validators.min(1), Validators.max(20)]],
      lockoutDurationMinutes: [currentConfig.lockoutDurationMinutes, [Validators.required, Validators.min(1), Validators.max(1440)]],
      sessionTimeoutMinutes: [currentConfig.sessionTimeoutMinutes, [Validators.required, Validators.min(1), Validators.max(180)]]
    });

    this.logs = this.authService.getActivityLogs();
  }

  switchTab(tab: 'logs' | 'config'): void {
    this.activeTab = tab;
    if (tab === 'logs') {
      this.logs = this.authService.getActivityLogs();
    }
  }

  saveConfig(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    const newConfig: AuthConfig = this.configForm.value;
    this.authService.updateConfig(newConfig);
    this.authService.logActivity(
      this.authService.currentUser()?.phoneNumber || 'SYSTEM',
      'PASSWORD_RESET',
      `Thay đổi cấu hình bảo mật: Nhập sai tối đa: ${newConfig.maxFailedAttempts}, Khóa: ${newConfig.lockoutDurationMinutes}m, Hết hạn phiên: ${newConfig.sessionTimeoutMinutes}m.`
    );
    this.close.emit();
  }

  clearLogs(): void {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử hoạt động không?')) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('viago_activity_log', JSON.stringify([]));
        this.authService.activityLogs.set([]);
        this.logs = [];
      }
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN');
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'LOGIN_FAILED': return 'bg-rose-50 text-rose-700 border border-rose-100';
      case 'LOCKOUT': return 'bg-amber-50 text-amber-700 border border-amber-100 font-semibold';
      case 'PASSWORD_RESET': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'REGISTER': return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'LOGOUT': return 'bg-slate-50 text-slate-600 border border-slate-150';
      default: return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  }

  getActionLabel(action: string): string {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'Đăng nhập thành công';
      case 'LOGIN_FAILED': return 'Đăng nhập thất bại';
      case 'LOCKOUT': return 'Tài khoản bị khóa';
      case 'PASSWORD_RESET': return 'Đổi mật khẩu / Cấu hình';
      case 'REGISTER': return 'Đăng ký tài khoản';
      case 'LOGOUT': return 'Đăng xuất';
      default: return action;
    }
  }
}
