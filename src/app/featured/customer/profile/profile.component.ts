import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, User } from '../../../auth/auth.service';
import { ToastService } from '../../../shared/toast.service';
import { RecaptchaVerifier } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import { VoucherService, Voucher } from '../../../core/services/voucher.service';
import { VoucherCardComponent } from '../../../shared/components/voucher-card/voucher-card.component';
import { LunarDatePickerComponent } from '../../../shared/components/lunar-date-picker/lunar-date-picker.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, VoucherCardComponent, LunarDatePickerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class Profile implements OnInit, OnDestroy {
  activeTab = 'personal';
  isEditing = false;
  profileForm!: FormGroup;
  avatarPreview: string | null = null;
  profileCompleteness = 0;

  // Security Modal Flags & Step Data
  showChangePasswordModal = false;
  changePasswordStep: 1 | 2 | 3 = 1; // 1: Form, 2: OTP, 3: Success

  // Form controls / values for Step 1
  currentPasswordVal = '';
  newPasswordVal = '';
  confirmPasswordVal = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Validation / Warning states
  currentPasswordError = '';
  newPasswordError = '';
  confirmPasswordError = '';
  samePasswordAlert = false; // Mật khẩu mới trùng mật khẩu hiện tại

  // Getters for password inline errors
  get newPasswordInlineError(): string {
    if (!this.newPasswordVal) return '';
    if (this.newPasswordVal.length < 8) {
      return 'Mật khẩu mới phải chứa ít nhất 8 ký tự.';
    }
    if (this.currentPasswordVal && this.newPasswordVal === this.currentPasswordVal) {
      return 'Mật khẩu mới không được trùng với mật khẩu hiện tại.';
    }
    return '';
  }

  get confirmPasswordInlineError(): string {
    if (!this.confirmPasswordVal) return '';
    if (this.newPasswordVal && this.newPasswordVal !== this.confirmPasswordVal) {
      return 'Mật khẩu xác nhận không khớp.';
    }
    return '';
  }

  // OTP details for Step 2
  otpString = '';
  otpTimer = 150; // 2:30 (150 seconds)
  otpIntervalId: any = null;
  otpErrorMessage = '';
  isOtpFocused = false;

  // Device management modals & list
  showLogoutAllModal = false;
  showDeviceLogoutConfirm = false;
  targetLogoutDeviceId = '';

  devicesList = [
    { id: 'chrome', name: 'Chrome - Windows', status: 'Hiện tại', time: 'TP.HCM, Việt Nam • 10:45 AM', isCurrent: true },
    { id: 'iphone', name: 'iPhone 14', status: '', time: 'TP.HCM, Việt Nam • Hôm qua, 20:15 PM', isCurrent: false },
    { id: 'safari', name: 'Safari - MacOS', status: '', time: 'TP.HCM, Việt Nam • Hôm kia, 09:30 AM', isCurrent: false }
  ];

  // 2FA state
  is2FAEnabled = false;
  show2FAPopup1 = false;
  show2FAPopup2 = false;
  show2FAEmailErrorPopup = false; // Popup alert if user has no email
  twoFactorMethod: 'phone' | 'email' = 'phone';
  generatedOtp = '';
  twoFactorOtpVal = '';
  twoFactorOtpError = '';
  twoFactorTimer = 180; // 3 minutes
  twoFactorIntervalId: any = null;
  is2FAOtpFocused = false;
  show2FASuccessToast = false;

  // Carousel slider for membership cards
  activeCardIndex = 1; // 0: Bronze, 1: Silver, 2: Gold (default 1 for 0981939379)

  // Vouchers list for user wallet loaded from VoucherService
  get vouchersList(): Voucher[] {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.voucherService.getWalletVouchers(user.id);
  }

  get activeVouchers(): Voucher[] {
    return this.vouchersList;
  }

  get expiredVouchers(): any[] {
    return [
      { id: 'v_exp1', code: 'APPONLY70', title: 'Ưu đãi đặt qua App Mobile', description: 'Ưu đãi dành riêng khi đặt qua ứng dụng VIAGO Mobile', value: 70000, type: 'fixed', expiryDate: '15/06/2026', discount: 'GIẢM 70K', status: 'expired', expiry: '15/06/2026' }
    ];
  }

  // Account Lock States
  showLockAccountModal = false;
  isLockingProcess = false; // step flag: if true, show centered red lock success status
  lockConfirmPassword = '';
  lockPasswordError = '';
  isLockPasswordCorrect = false;

  // Ticket History Filters & Pagination
  searchQuery = '';
  statusFilter = 'Tất cả';
  dateFilter = '';
  currentPage = 1;
  pageSize = 5;

  ticketsList: any[] = [];

  generateTicketsForUser(user: any): any[] {
    const ticketCount = user.tickets || 0;
    const generated: any[] = [];
    const statuses = ['ĐÃ HOÀN THÀNH', 'CHỜ KHỞI HÀNH', 'CHỜ THANH TOÁN', 'ĐÃ ĐÁNH GIÁ', 'ĐÃ HỦY'];
    const routes = [
      { depLoc: 'TP.HCM', arrLoc: 'ĐÀ LẠT', duration: '6h 00p (310 km)', depTime: '08:00', arrTime: '14:00', type: 'Limousine', price: 280000, priceLabel: '280.000đ' },
      { depLoc: 'TP.HCM', arrLoc: 'NHA TRANG', duration: '8h 00p (430 km)', depTime: '22:00', arrTime: '06:00', type: 'Giường nằm', price: 320000, priceLabel: '320.000đ' },
      { depLoc: 'TP.HCM', arrLoc: 'CẦN THƠ', duration: '3h 30p (170 km)', depTime: '07:00', arrTime: '10:30', type: 'Ghế ngồi', price: 180000, priceLabel: '180.000đ' },
      { depLoc: 'TP.HCM', arrLoc: 'VŨNG TÀU', duration: '2h 00p (100 km)', depTime: '14:00', arrTime: '16:00', type: 'Ghế ngồi', price: 120000, priceLabel: '120.000đ' },
      { depLoc: 'ĐÀ LẠT', arrLoc: 'NHA TRANG', duration: '3h 00p (135 km)', depTime: '09:00', arrTime: '12:00', type: 'Limousine', price: 160000, priceLabel: '160.000đ' }
    ];

    let seed = 0;
    if (user.id) {
      for (let i = 0; i < user.id.length; i++) {
        seed += user.id.charCodeAt(i);
      }
    }

    for (let i = 0; i < ticketCount; i++) {
      const routeIdx = (seed + i) % routes.length;
      const statusIdx = (seed + i * 2) % statuses.length;
      const route = routes[routeIdx];
      const status = statuses[statusIdx];
      
      const ticketIdNum = 97589000 + ((seed * 17 + i * 3) % 1000);
      const ticketId = `VE${ticketIdNum}`;

      const month = String(1 + ((seed + i) % 6)).padStart(2, '0');
      const day = String(1 + ((seed + i * 7) % 28)).padStart(2, '0');
      const dateStr = `2026-${month}-${day}`;
      const dateLabelStr = `${day}/${month}/2026`;

      const seatNum = (i % 2 === 0 ? 'A' : 'B') + String(1 + (i % 15)).padStart(2, '0');

      generated.push({
        id: ticketId,
        status: status,
        date: dateStr,
        dateLabel: dateLabelStr,
        depTime: route.depTime,
        depLoc: route.depLoc,
        arrTime: route.arrTime,
        arrLoc: route.arrLoc,
        duration: route.duration,
        seat: seatNum,
        type: route.type,
        price: route.price,
        priceLabel: route.priceLabel
      });
    }

    return generated.sort((a, b) => b.date.localeCompare(a.date));
  }

  // Firebase recaptcha verifier
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private cdr: ChangeDetectorRef,
    public voucherService: VoucherService
  ) {}

  ngOnInit(): void {
    // Redirect to home if user is not logged in
    if (!this.authService.currentUser()) {
      this.router.navigate(['/']);
      return;
    }

    // Read tab from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });

    this.initForm();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.stopOtpTimer();
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {}
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: [''], // Optional
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      gender: [''],
      birthday: [''],
      occupation: ['']
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.calculateCompleteness();
    });
  }

  loadUserData(): void {
    // Load user vouchers wallet
    const user = this.authService.currentUser();
    if (user) {
      let occ = user.occupation || '';
      const standardOccs = ['Học sinh / Sinh viên', 'Nhân viên văn phòng', 'Kinh doanh tự do'];
      if (occ && !standardOccs.includes(occ)) {
        occ = 'Khác';
      }
      this.profileForm.patchValue({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        occupation: occ
      });
      this.avatarPreview = user.avatar || '/asset/images/customer/user.png';
      this.calculateCompleteness();

      // Update ticketsList dynamically based on this user's ticket count!
      this.ticketsList = this.generateTicketsForUser(user);

      // Set activeCardIndex to match the user's current rank index!
      const currentRankIdx = this.rankIndex;
      this.activeCardIndex = currentRankIdx === -1 ? 0 : currentRankIdx;
    }
  }

  calculateCompleteness(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.profileCompleteness = 0;
      return;
    }

    const defaultAvatar = '/asset/images/customer/user.png';
    let score = 20; // SĐT is always pre-filled (20%)
    const nameVal = this.isEditing ? this.profileForm.get('name')?.value : user.name;
    const emailVal = this.isEditing ? this.profileForm.get('email')?.value : user.email;
    const genderVal = this.isEditing ? this.profileForm.get('gender')?.value : user.gender;
    const birthdayVal = this.isEditing ? this.profileForm.get('birthday')?.value : user.birthday;
    const occupationVal = this.isEditing ? this.profileForm.get('occupation')?.value : user.occupation;
    const avatarVal = this.avatarPreview || user.avatar || defaultAvatar;

    if (nameVal && nameVal.trim() !== '') {
      score += 20;
    }
    if (emailVal && emailVal.trim() !== '' && this.profileForm.get('email')?.valid) {
      score += 15;
    }
    if (avatarVal && avatarVal !== defaultAvatar) {
      score += 10;
    }
    if (genderVal && genderVal.trim() !== '') {
      score += 10;
    }
    if (birthdayVal && birthdayVal.trim() !== '') {
      score += 15;
    }
    if (occupationVal && occupationVal.trim() !== '') {
      score += 10;
    }

    this.profileCompleteness = score;
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.isEditing = false;
    this.loadUserData();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.cdr.detectChanges(); // Force DOM rendering of the form
    this.loadUserData();
    this.cdr.detectChanges(); // Propagate patched values to DOM elements
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserData();
  }

  async saveEdit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    const { name, email, gender, birthday, occupation } = this.profileForm.value;
    const result = await this.authService.updateProfile(user.phoneNumber, name, {
      email,
      gender,
      birthday,
      occupation,
      avatar: this.avatarPreview || '/asset/images/customer/user.png'
    });

    if (result.success) {
      this.isEditing = false;
      this.toastService.showSuccess('Cập nhật thông tin cá nhân thành công.');
      this.loadUserData();
    } else {
      this.toastService.showError(result.message);
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showError('Dung lượng ảnh tối đa là 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.calculateCompleteness();
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  logout(): void {
    // Sidebar / header direct logout - no popup confirmation
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // --- SECURITY TAB & POPUP ACTIONS ---

  openChangePassword(): void {
    this.showChangePasswordModal = true;
    this.changePasswordStep = 1;
    this.currentPasswordVal = '';
    this.newPasswordVal = '';
    this.confirmPasswordVal = '';
    
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.samePasswordAlert = false;

    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    
    this.initRecaptcha();
  }

  closeChangePassword(): void {
    // Reset values first to prevent browser from showing password saving early
    this.currentPasswordVal = '';
    this.newPasswordVal = '';
    this.confirmPasswordVal = '';
    this.cdr.detectChanges();

    this.showChangePasswordModal = false;
    this.stopOtpTimer();
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {}
      this.recaptchaVerifier = null;
    }
  }

  private initRecaptcha(): void {
    if (typeof window === 'undefined') return;
    const auth = this.authService.auth;
    if (!auth) return;

    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {}
      this.recaptchaVerifier = null;
    }

    setTimeout(() => {
      try {
        const container = document.getElementById('profile-recaptcha-container');
        if (container) {
          container.innerHTML = '';
          const el = document.createElement('div');
          el.id = 'profile-recaptcha-verifier';
          container.appendChild(el);
        }
        this.recaptchaVerifier = new RecaptchaVerifier(auth, 'profile-recaptcha-verifier', {
          size: 'invisible',
          callback: () => {
            console.log('[VIAGO PROFILE] Recaptcha verified.');
          }
        });
      } catch (e) {
        console.error('[VIAGO PROFILE] Error creating RecaptchaVerifier:', e);
      }
    }, 100);
  }

  async onPasswordSubmit(): Promise<void> {
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.samePasswordAlert = false;

    if (!this.currentPasswordVal) {
      this.currentPasswordError = 'Vui lòng nhập mật khẩu hiện tại.';
    }

    const inlineNew = this.newPasswordInlineError;
    if (inlineNew) {
      this.newPasswordError = inlineNew;
    } else if (!this.newPasswordVal) {
      this.newPasswordError = 'Vui lòng nhập mật khẩu mới.';
    }

    const inlineConfirm = this.confirmPasswordInlineError;
    if (inlineConfirm) {
      this.confirmPasswordError = inlineConfirm;
    } else if (!this.confirmPasswordVal) {
      this.confirmPasswordError = 'Vui lòng xác nhận mật khẩu mới.';
    }

    if (this.currentPasswordError || this.newPasswordError || this.confirmPasswordError) {
      return;
    }

    if (this.currentPasswordVal === this.newPasswordVal) {
      this.samePasswordAlert = true;
      this.newPasswordError = 'Mật khẩu mới không được trùng với mật khẩu hiện tại.';
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    const hashedCurrent = await this.authService.hashPassword(this.currentPasswordVal);
    if (user.passwordHash !== hashedCurrent && user.password !== this.currentPasswordVal) {
      this.currentPasswordError = 'Mật khẩu hiện tại không chính xác.';
      return;
    }

    // Success Step 1 -> Send OTP and transition to Step 2
    const result = await this.authService.sendOTP(user.phoneNumber, this.recaptchaVerifier, 'forgot');
    if (result.success) {
      this.changePasswordStep = 2;
      this.otpString = '';
      this.otpErrorMessage = '';
      this.generatedOtp = result.otp || '';
      this.startOtpTimer();
    } else {
      this.currentPasswordError = result.message;
    }
  }

  async resendChangePasswordOtp(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    this.otpErrorMessage = '';
    const result = await this.authService.sendOTP(user.phoneNumber, this.recaptchaVerifier, 'forgot');
    if (result.success) {
      this.otpString = '';
      this.generatedOtp = result.otp || '';
      this.startOtpTimer();
      this.toastService.showSuccess('Mã xác thực mới đã được gửi.');
    } else {
      this.otpErrorMessage = result.message;
    }
  }

  onOtpInput(event: any): void {
    const val = event.target.value;
    if (val && /^[0-9]*$/.test(val)) {
      this.otpString = val;
    } else {
      event.target.value = this.otpString;
    }
    // When 6 digits are fully entered, verify
    if (this.otpString.length === 6) {
      this.verifyChangePasswordOtp();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      if (pastedText && /^[0-9]{1,6}$/.test(pastedText)) {
        this.otpString = pastedText.substring(0, 6);
        this.cdr.detectChanges();
        if (this.otpString.length === 6) {
          this.verifyChangePasswordOtp();
        }
      }
    }
  }

  async verifyChangePasswordOtp(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    this.otpErrorMessage = '';
    const verifyResult = await this.authService.verifyOTP(user.phoneNumber, this.otpString);
    if (verifyResult.success) {
      // Update the password in database
      const resetResult = await this.authService.resetPassword(user.phoneNumber, this.newPasswordVal);
      if (resetResult.success) {
        // Show success centered status modal (Step 3)
        this.changePasswordStep = 3;
        this.stopOtpTimer();
        
        // Auto-close modal after 2 seconds
        setTimeout(() => {
          this.closeChangePassword();
        }, 2000);
      } else {
        this.otpErrorMessage = resetResult.message;
      }
    } else {
      this.otpErrorMessage = verifyResult.message;
    }
  }

  goBackToPasswordForm(): void {
    this.changePasswordStep = 1;
    this.stopOtpTimer();
    this.otpString = '';
    this.otpErrorMessage = '';
  }

  // --- TIMER UTILITIES ---

  startOtpTimer(): void {
    this.stopOtpTimer();
    this.otpTimer = 150; // 2:30
    this.otpIntervalId = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.stopOtpTimer();
        this.otpErrorMessage = 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã.';
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  stopOtpTimer(): void {
    if (this.otpIntervalId) {
      clearInterval(this.otpIntervalId);
      this.otpIntervalId = null;
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // --- DEVICE LOGOUT ACTIONS ---

  confirmLogoutAllOtherDevices(): void {
    this.showLogoutAllModal = true;
  }

  logoutAllOtherDevices(): void {
    this.showLogoutAllModal = false;
    // Mock remove other devices: filter list to keep only current device
    this.devicesList = this.devicesList.filter(d => d.isCurrent);
    this.toastService.showSuccess('Đã đăng xuất khỏi tất cả các thiết bị khác thành công.');
  }

  removeDevice(deviceId: string): void {
    // Only device logouts show confirmation modal (Image 3)
    this.targetLogoutDeviceId = deviceId;
    this.showDeviceLogoutConfirm = true;
  }

  confirmDeviceLogout(): void {
    this.showDeviceLogoutConfirm = false;
    if (this.targetLogoutDeviceId) {
      if (this.targetLogoutDeviceId === 'chrome') {
        // Logout current device -> logout instantly and redirect to /
        this.authService.logout();
        this.router.navigate(['/']);
      } else {
        // Logout other devices -> remove from list
        this.devicesList = this.devicesList.filter(d => d.id !== this.targetLogoutDeviceId);
        this.toastService.showSuccess('Đã đăng xuất thiết bị thành công.');
      }
      this.targetLogoutDeviceId = '';
    }
  }

  // --- LOCK ACCOUNT LOGIC ---

  openLockAccount(): void {
    this.showLockAccountModal = true;
    this.isLockingProcess = false;
    this.lockConfirmPassword = '';
    this.lockPasswordError = '';
    this.isLockPasswordCorrect = false;
  }

  closeLockAccount(): void {
    this.showLockAccountModal = false;
    this.isLockingProcess = false;
    this.lockConfirmPassword = '';
    this.lockPasswordError = '';
    this.isLockPasswordCorrect = false;
  }

  async checkLockPassword(): Promise<void> {
    if (!this.lockConfirmPassword) {
      this.lockPasswordError = '';
      this.isLockPasswordCorrect = false;
      return;
    }
    const user = this.authService.currentUser();
    if (!user) {
      this.isLockPasswordCorrect = false;
      return;
    }
    
    const hashed = await this.authService.hashPassword(this.lockConfirmPassword);
    if (user.passwordHash === hashed || user.password === this.lockConfirmPassword) {
      this.lockPasswordError = '';
      this.isLockPasswordCorrect = true;
    } else {
      this.lockPasswordError = 'Mật khẩu hiện tại không chính xác.';
      this.isLockPasswordCorrect = false;
    }
    this.cdr.detectChanges();
  }

  async confirmLockAccount(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    const hashed = await this.authService.hashPassword(this.lockConfirmPassword);
    if (user.passwordHash !== hashed && user.password !== this.lockConfirmPassword) {
      this.lockPasswordError = 'Mật khẩu hiện tại không chính xác.';
      return;
    }

    // Step 1: Change modal to Red Lock status
    this.isLockingProcess = true;
    this.cdr.detectChanges();

    // Step 2: Delete token, local storage and log out after 2 seconds
    const softResult = await this.authService.softDeleteAccount(user.phoneNumber);
    if (softResult.success) {
      setTimeout(() => {
        this.showLockAccountModal = false;
        this.isLockingProcess = false;
        this.router.navigate(['/']);
      }, 2000);
    } else {
      this.isLockingProcess = false;
      this.lockPasswordError = softResult.message;
    }
  }

  // --- TICKET HISTORY ACTIONS ---

  get userTickets() {
    const user = this.authService.currentUser();
    if (user && user.phoneNumber === '0976262546') {
      return [];
    }
    return this.ticketsList;
  }

  get filteredTickets() {
    const tickets = this.userTickets;
    const filtered = tickets.filter(t => {
      const matchSearch = !this.searchQuery || 
        t.id.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        t.depLoc.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        t.arrLoc.toLowerCase().includes(this.searchQuery.toLowerCase());
        
      const matchStatus = this.statusFilter === 'Tất cả' || t.status === this.statusFilter;
      const matchDate = !this.dateFilter || t.date === this.dateFilter;
      
      return matchSearch && matchStatus && matchDate;
    });

    const totalP = Math.ceil(filtered.length / this.pageSize) || 1;
    if (this.currentPage > totalP) {
      this.currentPage = totalP;
    }

    return filtered;
  }

  // Pagination support
  get totalPages(): number {
    return Math.ceil(this.filteredTickets.length / this.pageSize) || 1;
  }

  get paginatedTickets() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredTickets.slice(startIndex, startIndex + this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  normalizeCityName(city: string): string {
    const clean = city.trim().toUpperCase();
    if (clean === 'TP.HCM' || clean.includes('HỒ CHÍ MINH') || clean.includes('HCM')) {
      return 'TP. Hồ Chí Minh';
    }
    if (clean === 'ĐÀ LẠT') return 'Đà Lạt';
    if (clean === 'NHA TRANG') return 'Nha Trang';
    if (clean === 'CẦN THƠ') return 'Cần Thơ';
    if (clean === 'VŨNG TÀU') return 'Vũng Tàu';
    if (clean === 'ĐÀ NẴNG') return 'Đà Nẵng';
    if (clean === 'RẠCH GIÁ') return 'Rạch Giá';
    if (clean === 'BUÔN MA THUỘT') return 'Buôn Ma Thuột';
    return city;
  }

  rebookTicket(ticketId: string): void {
    const ticket = this.ticketsList.find(t => t.id === ticketId);
    if (ticket) {
      const departure = this.normalizeCityName(ticket.depLoc);
      const destination = this.normalizeCityName(ticket.arrLoc);
      this.router.navigate(['/'], {
        queryParams: { departure, destination }
      });
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'Tất cả';
    this.dateFilter = '';
    this.currentPage = 1;
  }

  viewTicketDetail(ticketId: string): void {
    this.toastService.showSuccess(`Đang tải chi tiết mã vé #${ticketId}...`);
  }

  // --- 2FA ACTIONS ---

  get userProfile() {
    const user = this.authService.currentUser();
    return {
      phone: user?.phoneNumber || '',
      email: user?.email || ''
    };
  }

  getMaskedPhone(): string {
    const phone = this.userProfile.phone.trim();
    if (phone.length >= 7) {
      return phone.substring(0, 4) + '***' + phone.substring(phone.length - 3);
    }
    return phone;
  }

  getMaskedEmail(): string {
    const email = this.userProfile.email.trim();
    const parts = email.split('@');
    if (parts.length === 2) {
      const name = parts[0];
      const domain = parts[1];
      if (name.length > 3) {
        return name.substring(0, 3) + '***@' + domain;
      }
      return name + '***@' + domain;
    }
    return email;
  }

  onToggle2FAClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.is2FAEnabled) {
      this.is2FAEnabled = false;
      this.toastService.showSuccess('Xác thực 2 lớp (2FA) đã được tắt.');
    } else {
      const email = this.userProfile.email;
      if (!email || email === 'Chưa thiết lập' || email.trim() === '') {
        this.show2FAEmailErrorPopup = true;
      } else {
        this.open2FAPopup1();
      }
    }
  }

  open2FAPopup1(): void {
    this.show2FAPopup1 = true;
    this.twoFactorMethod = 'phone';
  }

  close2FAPopup1(): void {
    this.show2FAPopup1 = false;
  }

  async submit2FAMethod(): Promise<void> {
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('[VIAGO 2FA] Generated OTP code:', this.generatedOtp);
    this.twoFactorOtpVal = '';
    this.twoFactorOtpError = '';

    // Pure mock mode: no actual EmailJS or SMS call
    this.show2FAPopup1 = false;
    this.show2FAPopup2 = true;
    this.start2FAOtpTimer();
  }

  close2FAPopup2(): void {
    this.show2FAPopup2 = false;
    this.stop2FAOtpTimer();
  }

  goBackTo2FAPopup1(): void {
    this.show2FAPopup2 = false;
    this.stop2FAOtpTimer();
    this.show2FAPopup1 = true;
  }

  on2FAOtpInput(event: any): void {
    const val = event.target.value;
    if (val && /^[0-9]*$/.test(val)) {
      this.twoFactorOtpVal = val;
    } else {
      event.target.value = this.twoFactorOtpVal;
    }
    if (this.twoFactorOtpVal.length === 6) {
      this.verify2FA();
    }
  }

  on2FAOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      if (pastedText && /^[0-9]{1,6}$/.test(pastedText)) {
        this.twoFactorOtpVal = pastedText.substring(0, 6);
        this.cdr.detectChanges();
        if (this.twoFactorOtpVal.length === 6) {
          this.verify2FA();
        }
      }
    }
  }

  verify2FA(): void {
    this.twoFactorOtpError = '';
    if (this.twoFactorOtpVal.length < 6) {
      this.twoFactorOtpError = 'Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số.';
      return;
    }

    if (this.twoFactorOtpVal === this.generatedOtp) {
      this.show2FAPopup2 = false;
      this.stop2FAOtpTimer();
      
      this.show2FASuccessToast = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.show2FASuccessToast = false;
        this.is2FAEnabled = true;
        this.cdr.detectChanges();
      }, 1500);
    } else {
      this.twoFactorOtpError = 'Mã xác thực không chính xác. Vui lòng nhập lại.';
    }
  }

  async resend2FAOtp(): Promise<void> {
    this.twoFactorOtpError = '';
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('[VIAGO 2FA] Resending OTP code:', this.generatedOtp);
    this.twoFactorOtpVal = '';

    // Pure mock mode: reset timer directly
    this.start2FAOtpTimer();
  }

  start2FAOtpTimer(): void {
    this.stop2FAOtpTimer();
    this.twoFactorTimer = 180; // 3:00 (180 seconds)
    this.twoFactorIntervalId = setInterval(() => {
      if (this.twoFactorTimer > 0) {
        this.twoFactorTimer--;
      } else {
        this.stop2FAOtpTimer();
        this.twoFactorOtpError = 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã.';
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  stop2FAOtpTimer(): void {
    if (this.twoFactorIntervalId) {
      clearInterval(this.twoFactorIntervalId);
      this.twoFactorIntervalId = null;
    }
  }

  getFormatted2FATime(): string {
    const minutes = Math.floor(this.twoFactorTimer / 60);
    const seconds = this.twoFactorTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // --- MEMBERSHIP PRIVILEGES ACTIONS ---

  prevCard(): void {
    if (this.activeCardIndex > 0) {
      this.activeCardIndex--;
    } else {
      this.activeCardIndex = 2; // wrap
    }
  }

  nextCard(): void {
    if (this.activeCardIndex < 2) {
      this.activeCardIndex++;
    } else {
      this.activeCardIndex = 0; // wrap
    }
  }

  get rankIndex(): number {
    const rank = this.authService.currentUser()?.rank;
    if (rank === 'Bạc') return 0;
    if (rank === 'Vàng') return 1;
    if (rank === 'Kim cương') return 2;
    return -1; // Khách vãng lai
  }

  getCardClass(cardIndex: number): string {
    const activeIdx = this.activeCardIndex;
    
    // Base classes: absolute positioning, size, flex layout, center alignment, smooth transition
    let baseClass = 'absolute transition-all duration-500 w-64 h-40 md:w-72 md:h-44 rounded-2xl p-5 flex flex-col justify-between cursor-pointer ';
    
    if (cardIndex === activeIdx) {
      return baseClass + 'z-20 scale-105 opacity-100 shadow-[0_15px_35px_rgba(0,35,111,0.15)] border-2 border-orange-500 ring-4 ring-orange-500/10 translate-x-0';
    } else if (cardIndex === activeIdx - 1 || (activeIdx === 0 && cardIndex === 2)) {
      // Left card (stacked offset)
      return baseClass + 'z-10 scale-90 opacity-45 grayscale -translate-x-16 md:-translate-x-20';
    } else {
      // Right card (stacked offset)
      return baseClass + 'z-10 scale-90 opacity-45 grayscale translate-x-16 md:translate-x-20';
    }
  }

  isCardLocked(cardIndex: number): boolean {
    return cardIndex > this.rankIndex;
  }

  get membershipProgress() {
    const user = this.authService.currentUser();
    if (!user) {
      return {
        currentTickets: 0,
        targetTickets: 4,
        ticketPercent: 0,
        ticketPinPercent: 0,
        currentSpent: 0,
        targetSpent: 1000000,
        spentPercent: 0,
        spentPinPercent: 0,
        nextRankName: 'Bạc'
      };
    }

    const currentTickets = user.tickets || 0;
    const currentSpent = user.spent || 0;
    
    let targetTickets = 4;
    let targetSpent = 1000000;
    let nextRankName = 'Bạc';
    
    if (user.rank === 'Bạc') {
      targetTickets = 15;
      targetSpent = 5000000;
      nextRankName = 'Vàng';
    } else if (user.rank === 'Vàng') {
      targetTickets = 30;
      targetSpent = 15000000;
      nextRankName = 'Kim cương';
    } else if (user.rank === 'Kim cương') {
      targetTickets = 30;
      targetSpent = 15000000;
      nextRankName = '';
    }

    const ticketPercent = Math.min(100, Math.round((currentTickets / targetTickets) * 100));
    const spentPercent = Math.min(100, Math.round((currentSpent / targetSpent) * 100));
    const ticketPinPercent = ticketPercent === 100 ? 96 : Math.max(0, ticketPercent - 3);
    const spentPinPercent = spentPercent === 100 ? 96 : Math.max(0, spentPercent - 3);

    return {
      currentTickets,
      targetTickets,
      ticketPercent,
      ticketPinPercent,
      currentSpent,
      targetSpent,
      spentPercent,
      spentPinPercent,
      nextRankName
    };
  }

  get rankVouchers(): any[] {
    const rank = this.authService.currentUser()?.rank || 'Không có';
    const SYSTEM_VOUCHERS = [
      {
        code: 'WELCOME50',
        title: 'Chào mừng khách mới - Welcome Gift',
        description: 'Giảm cho lần đặt vé đầu tiên trên ứng dụng VIAGO.',
        discount: 'Giảm 50.000đ',
        rank: ['Không có'],
        validity: '01/01/2026 - 31/12/2026',
        status: 'active',
        expiryDate: '31/12/2026'
      },
      {
        code: 'EARLYBIRD15',
        title: 'Đặt sớm - Early Bird 15%',
        description: 'Đặt trước ít nhất 7 ngày so với ngày khởi hành.',
        discount: 'Giảm 15% (Tối đa 45k)',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/06/2026 - 30/06/2026',
        status: 'active',
        expiryDate: '30/06/2026'
      },
      {
        code: 'BDAY20',
        title: 'Mừng sinh nhật - Birthday Surprise',
        description: 'Ưu đãi trong tháng sinh nhật, không giới hạn tuyến.',
        discount: 'Giảm 20% (Tối đa 50k)',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/01/2026 - 31/12/2026',
        status: 'active',
        expiryDate: '31/12/2026'
      },
      {
        code: 'SUMMER30',
        title: 'Hè rực rỡ - Summer Special',
        description: 'Áp dụng cho các tuyến du lịch: Đà Lạt, Nha Trang, Vũng Tàu...',
        discount: 'Giảm 30.000đ',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '15/05/2026 - 31/08/2026',
        status: 'active',
        expiryDate: '31/08/2026'
      },
      {
        code: 'GOLDVIP20',
        title: 'Đặc quyền Gold - VIP Exclusive',
        description: 'Ưu đãi dành riêng cho hội viên Vàng đặt tuyến Limousine VIP.',
        discount: 'Giảm 20% (Tối đa 80k)',
        rank: ['Vàng'],
        validity: '01/06/2026 - 31/12/2026',
        status: 'active',
        expiryDate: '31/12/2026'
      },
      {
        code: 'FREEHUY',
        title: 'Miễn phí hoàn hủy - Free Cancel',
        description: 'Hoàn tiền 100% không mất phí khi hủy trước 24 giờ.',
        discount: 'Hoàn tiền 100%',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/04/2026 - 30/06/2026',
        status: 'expired',
        expiryDate: '30/06/2026'
      },
      {
        code: 'TETNHAMTY25',
        title: 'Tết Nguyên Đán 2027 - Tet Special',
        description: 'Đặt sớm các chuyến xe Tết có quà tặng kèm.',
        discount: 'Giảm 25% (Tối đa 100k)',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/01/2027 - 15/02/2027',
        status: 'upcoming',
        expiryDate: '15/02/2027'
      },
      {
        code: 'GROUPTRIP',
        title: 'Đi nhóm - Group Booking Deal',
        description: 'Đặt từ 4 vé trở lên trên cùng một chuyến.',
        discount: 'Giảm 40.000đ',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/07/2026 - 31/10/2026',
        status: 'upcoming',
        expiryDate: '31/10/2026'
      },
      {
        code: 'MIDWEEK10',
        title: 'Ngày giữa tuần - Midweek Boost',
        description: 'Kích cầu đi lại các chuyến xuất phát từ Thứ 2 đến Thứ 5.',
        discount: 'Giảm 10% (Tối đa 25k)',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/06/2026 - 31/07/2026',
        status: 'paused',
        expiryDate: '31/07/2026'
      },
      {
        code: 'APPONLY70',
        title: 'Chỉ trên App - App Exclusive',
        description: 'Ưu đãi dành riêng khi đặt qua ứng dụng VIAGO Mobile.',
        discount: 'Giảm 70.000đ',
        rank: ['Bạc', 'Vàng', 'Kim cương'],
        validity: '01/05/2026 - 15/06/2026',
        status: 'expired',
        expiryDate: '15/06/2026'
      },
      {
        code: 'SILVER10',
        title: 'Ưu đãi Silver - Silver Reward',
        description: 'Nhận giảm giá 10% trên toàn bộ các tuyến xe thường.',
        discount: 'Giảm 10%',
        rank: ['Bạc'],
        validity: '01/01/2026 - 31/12/2026',
        status: 'active',
        expiryDate: '31/12/2026'
      },
      {
        code: 'DIAMOND150',
        title: 'Đặc quyền Kim Cương - Elite King',
        description: 'Mã tối thượng tri ân riêng cho khách siêu VIP có chi tiêu trên 15M.',
        discount: 'Giảm 25% (Tối đa 150k)',
        rank: ['Kim cương'],
        validity: '01/06/2026 - 31/12/2026',
        status: 'active',
        expiryDate: '31/12/2026'
      }
    ];
    return SYSTEM_VOUCHERS.filter(v => v.rank.includes(rank));
  }

  activeVoucherTab = 'active'; // 'active' or 'expired'

  scrollVouchers(direction: 'left' | 'right'): void {
    const container = document.getElementById('voucher-scroll-container');
    if (container) {
      const scrollAmount = 320;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }

  scrollVouchersExpired(direction: 'left' | 'right'): void {
    const container = document.getElementById('voucher-scroll-container-expired');
    if (container) {
      const scrollAmount = 320;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }

  get tierBenefits(): { title: string, desc: string }[] {
    const rank = this.authService.currentUser()?.rank;
    if (rank === 'Bạc') {
      return [
        { title: 'Nhận mã giảm giá độc quyền', desc: 'Cơ hội nhận các mã giảm giá đến 10% được hệ thống tự động gửi tặng vào Ví voucher của bạn trong các dịp lễ lớn hoặc chương trình tri ân bất ngờ.' },
        { title: 'Ưu tiên check-in tại quầy vé', desc: 'Được hỗ trợ làm thủ tục nhanh tại quầy vé của VIAGO trong các khung giờ thông thường, giúp tiết kiệm thời gian chờ đợi.' },
        { title: 'Quà tặng sinh nhật hội viên', desc: 'Tự động nhận mã giảm giá 20% (tối đa 50.000đ) thả thẳng vào Ví voucher ngay trong tuần sinh nhật dựa trên thông tin ngày sinh đã đăng ký.' },
        { title: 'Hỗ trợ chăm sóc khách hàng 24/7', desc: 'Tổng đài chăm sóc khách hàng phục vụ 24/7, tiếp nhận và xử lý các yêu cầu đổi trả vé theo quy trình tiêu chuẩn một cách nhanh chóng.' }
      ];
    }
    if (rank === 'Vàng') {
      return [
        { title: 'Nhận mã giảm giá độc quyền', desc: 'Cơ hội nhận mã giảm giá 20% thương hạng chuyên áp dụng cho các dòng xe Limousine VIP, tự động cấp vào ví vào các chiến dịch đặc biệt.' },
        { title: 'Ưu tiên check-in tại quầy vé', desc: 'Được phục vụ tại hàng chờ VIP riêng biệt tại các văn phòng VIAGO trên toàn quốc và miễn phí 100% phí chọn trước chỗ ngồi phía trước.' },
        { title: 'Quà tặng sinh nhật đặc biệt', desc: 'Tự động nhận mã giảm giá lớn (tối đa 100.000đ) thả thẳng vào Ví voucher kèm thông báo chúc mừng riêng biệt từ VIAGO trong tuần sinh nhật.' },
        { title: 'Hỗ trợ chăm sóc khách hàng 24/7', desc: 'Tổng đài ưu tiên kết nối nhánh VIP với thời gian phản hồi dưới 30 giây, hỗ trợ xử lý đổi trả vé miễn phí trước giờ khởi hành 12 tiếng.' }
      ];
    }
    if (rank === 'Kim cương') {
      return [
        { title: 'Mã giảm giá tối thượng', desc: 'Ưu tiên nhận các siêu mã giảm giá lên đến 30% toàn hệ thống, tự động thả thẳng vào Ví voucher của bạn trong các sự kiện đặc biệt của hãng.' },
        { title: 'Đặc quyền di chuyển thượng lưu', desc: 'Đặc quyền sử dụng Phòng chờ thương gia (miễn phí nước uống/đồ ăn nhẹ) và xe trung chuyển đón trả tận nhà trong bán kính 5km.' },
        { title: 'Đặc quyền sinh nhật VVIP', desc: 'Nhận combo voucher sinh nhật trị giá 200.000đ tự động cộng vào ví và một hộp quà vật lý cao cấp được VIAGO gửi chuyển phát nhanh đến tận nhà.' },
        { title: 'Hỗ trợ chăm sóc khách hàng 24/7', desc: 'Kết nối trực tiếp với Trợ lý cá nhân qua Đường dây nóng VIP, hỗ trợ hoàn hủy vé hoàn toàn miễn phí ngay cả sát giờ xe chạy (trước 2 tiếng).' }
      ];
    }
    return [];
  }
}
