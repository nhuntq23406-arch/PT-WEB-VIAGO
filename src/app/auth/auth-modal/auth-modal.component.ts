import { Component, EventEmitter, Output, ViewChildren, QueryList, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';
import { LunarDatePickerComponent } from '../../shared/components/lunar-date-picker/lunar-date-picker.component';

type AuthStep = 'login' | 'forgot' | 'forgot-otp' | 'forgot-reset' | 'register-phone' | 'register-otp' | 'register-password' | 'register-profile' | 'success-status';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LunarDatePickerComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  currentStep: AuthStep = 'login';
  successTitle = '';
  successSub = '';
  
  // Forms
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  resetForm!: FormGroup;
  
  // Registration Forms
  registerPhoneForm!: FormGroup;
  registerPasswordForm!: FormGroup;
  profileForm!: FormGroup;

  // Firebase invisible recaptcha
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // State
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';
  
  // Simulated SMS Toast Notification State (Only in LocalStorage mock mode)
  smsNotification: { phoneNumber: string; otp: string } | null = null;
  smsNotificationTimeoutId: any = null;

  // OTP State
  otpString = '';
  generatedOtp = '';
  isOtpFocused = false;
  otpTimer = 180;
  otpIntervalId: any = null;
  resetPhoneNumber = '';

  // Registration State
  registerPhoneNumber = '';
  registerPassword = '';
  profileCompleteness = 0; // Start with 0%
  avatarPreview: string | ArrayBuffer | null = null;
  selectedAvatarFile = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  ngOnDestroy(): void {
    this.stopOtpTimer();
    if (this.smsNotificationTimeoutId) {
      clearTimeout(this.smsNotificationTimeoutId);
    }
    this.destroyRecaptcha();
  }

  private initForms(): void {
    // Vietnamese Phone Validation:
    // Starts with 03, 05, 07, 08, 09
    // Exactly 10 digits
    const phonePattern = /^(03|05|07|08|09)[0-9]{8}$/;
    // Standard email validator
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Login Form
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(phonePattern)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Forgot Password Form
    this.forgotForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(phonePattern)]]
    });

    // Reset Password Form
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Step 1 Register Phone Form
    this.registerPhoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(phonePattern)]]
    });

    // Step 3 Register Password Form
    this.registerPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Step 4 Profile Completion Form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.pattern(emailPattern)]], // Optional but validated if filled
      gender: [''],
      birthday: [''],
      occupation: ['']
    });

    // Track profile form updates to recalculate progress bar dynamically
    this.profileForm.valueChanges.subscribe(() => {
      this.calculateProfileCompleteness();
    });
  }

  // --- CUSTOM VALIDATORS ---

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // --- ACTIONS ---

  setStep(step: AuthStep): void {
    this.currentStep = step;
    this.errorMessage = '';
    this.successMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    
    // Clear forms when switching
    if (step === 'login') {
      this.loginForm.reset();
    } else if (step === 'forgot') {
      this.forgotForm.reset();
    } else if (step === 'forgot-reset') {
      this.resetForm.reset();
    } else if (step === 'register-phone') {
      this.registerPhoneForm.reset();
    } else if (step === 'forgot-otp' || step === 'register-otp') {
      this.otpString = '';
      this.startOtpTimer();
      setTimeout(() => {
        if (this.otpInputs && this.otpInputs.length > 0) {
          const inputEl = this.otpInputs.toArray()[0].nativeElement as HTMLInputElement;
          inputEl.value = '';
          inputEl.focus();
        }
      }, 150);
    } else if (step === 'register-password') {
      this.registerPasswordForm.reset();
    } else if (step === 'register-profile') {
      this.profileForm.reset({
        name: '',
        email: '',
        gender: '',
        birthday: '',
        occupation: ''
      });
      this.avatarPreview = null;
      this.selectedAvatarFile = '';
      this.profileCompleteness = 20;
    }

    this.cdr.detectChanges();
  }

  showSuccessStatus(title: string, sub: string, delayMs: number = 1800): void {
    this.successTitle = title;
    this.successSub = sub;
    this.currentStep = 'success-status';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.close.emit();
    }, delayMs);
  }

  handleClose(): void {
    if (this.currentStep === 'success-status') {
      return;
    }
    if (this.currentStep === 'register-profile') {
      this.skipProfile();
    } else {
      this.close.emit();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Submit Login
  async onLoginSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { phoneNumber, password } = this.loginForm.value;

    const result = await this.authService.login(phoneNumber, password);
    if (result.success) {
      this.close.emit();
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // --- REGISTRATION FLOW WIZARD ---

  // Step 1: Submit Phone Number for Registration
  async onRegisterPhoneSubmit(): Promise<void> {
    if (this.registerPhoneForm.invalid) {
      this.registerPhoneForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { phoneNumber } = this.registerPhoneForm.value;
    this.registerPhoneNumber = phoneNumber;

    if (this.authService.isFirebaseMode) {
      this.initRecaptcha();
    }

    const result = await this.authService.sendOTP(phoneNumber, this.recaptchaVerifier, 'register');
    if (result.success) {
      this.generatedOtp = result.otp || '';
      if (!this.authService.isFirebaseMode && result.otp) {
        this.showSmsNotification(phoneNumber, result.otp);
      }
      this.setStep('register-otp');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
      this.destroyRecaptcha();
    }
  }

  // Step 2: Verify Registration OTP
  async onRegisterOtpSubmit(): Promise<void> {
    const otpCode = this.otpString;
    if (otpCode.length < 6) {
      this.errorMessage = 'Vui lòng nhập đầy đủ 6 chữ số mã xác thực.';
      return;
    }

    this.errorMessage = '';
    const result = await this.authService.verifyOTP(this.registerPhoneNumber, otpCode);
    if (result.success) {
      this.stopOtpTimer();
      this.setStep('register-password');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Step 3: Setup Password
  async onRegisterPasswordSubmit(): Promise<void> {
    if (this.registerPasswordForm.invalid) {
      this.registerPasswordForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { password } = this.registerPasswordForm.value;
    
    if (this.authService.isFirebaseMode) {
      const linkResult = await this.authService.linkEmailAndPassword(this.registerPhoneNumber, password);
      if (!linkResult.success) {
        setTimeout(() => {
          this.errorMessage = linkResult.message;
          this.cdr.detectChanges();
        }, 0);
        return;
      }
    }
    
    // Hash password locally
    this.registerPassword = await this.authService.hashPassword(password);
    this.setStep('register-profile');
  }

  // Step 4: Profile Image Selection (Simulated file read)
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa là 5MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
        this.selectedAvatarFile = file.name;
        this.calculateProfileCompleteness();
      };
      reader.readAsDataURL(file);
    }
  }

  // Step 4: Calculate completeness of user profile
  private calculateProfileCompleteness(): void {
    let score = 20; // SĐT is always pre-filled (20%)

    const nameVal = this.profileForm.get('name')?.value;
    const emailVal = this.profileForm.get('email')?.value;
    const genderVal = this.profileForm.get('gender')?.value;
    const birthdayVal = this.profileForm.get('birthday')?.value;
    const occupationVal = this.profileForm.get('occupation')?.value;
    const avatarVal = this.avatarPreview;

    if (nameVal && nameVal.trim() !== '') {
      score += 20;
    }
    if (emailVal && emailVal.trim() !== '' && this.profileForm.get('email')?.valid) {
      score += 15;
    }
    if (avatarVal && avatarVal !== '/asset/images/customer/user.png') {
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
    this.cdr.detectChanges();
  }

  // Step 4: Submit Profile Setup
  async onProfileSubmit(): Promise<void> {
    if (this.profileForm.get('name')?.invalid) {
      this.profileForm.get('name')?.markAsTouched();
      return;
    }

    this.errorMessage = '';
    const { name, email, gender, birthday, occupation } = this.profileForm.value;
    
    const result = await this.authService.registerProfile(name, this.registerPhoneNumber, this.registerPassword, {
      email,
      gender,
      birthday,
      occupation,
      avatar: (this.avatarPreview as string) || '/asset/images/customer/user.png'
    });

    if (result.success) {
      this.toastService.showSuccess('Cập nhật hồ sơ thành công!');
      this.close.emit();
      this.router.navigate(['/']);
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Step 4: Skip Profile Setup (ĐỂ SAU)
  async skipProfile(): Promise<void> {
    this.errorMessage = '';
    
    // Save with default customer details
    const result = await this.authService.registerProfile(
      '', 
      this.registerPhoneNumber, 
      this.registerPassword, 
      {}
    );

    if (result.success) {
      this.showSuccessStatus('Đăng ký tài khoản thành công', 'Đang tự động đăng nhập...');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // --- PASSWORD RECOVERY FLOW (FORGOT PASSWORD) ---

  // Submit Forgot Password (Request OTP SMS)
  async onForgotSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { phoneNumber } = this.forgotForm.value;
    this.resetPhoneNumber = phoneNumber;

    if (this.authService.isFirebaseMode) {
      this.initRecaptcha();
    }

    const result = await this.authService.sendOTP(phoneNumber, this.recaptchaVerifier, 'forgot');
    if (result.success) {
      this.generatedOtp = result.otp || '';
      if (!this.authService.isFirebaseMode && result.otp) {
        this.showSmsNotification(phoneNumber, result.otp);
      }
      this.setStep('forgot-otp');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
      this.destroyRecaptcha();
    }
  }

  // Verify OTP for Forgot Password
  async onForgotOtpSubmit(): Promise<void> {
    const otpCode = this.otpString;
    if (otpCode.length < 6) {
      this.errorMessage = 'Vui lòng nhập đầy đủ 6 chữ số mã xác thực.';
      return;
    }

    this.errorMessage = '';
    const result = await this.authService.verifyOTP(this.resetPhoneNumber, otpCode);
    if (result.success) {
      this.stopOtpTimer();
      this.setStep('forgot-reset');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Resend OTP for Forgot Password
  async resendForgotOtp(): Promise<void> {
    this.errorMessage = '';
    
    if (this.authService.isFirebaseMode) {
      this.initRecaptcha();
    }

    const result = await this.authService.sendOTP(this.resetPhoneNumber, this.recaptchaVerifier, 'forgot');
    if (result.success) {
      this.generatedOtp = result.otp || '';
      if (!this.authService.isFirebaseMode && result.otp) {
        this.showSmsNotification(this.resetPhoneNumber, result.otp);
      }
      this.otpString = '';
      this.otpTimer = 180;
      this.startOtpTimer();
      setTimeout(() => {
        if (this.otpInputs && this.otpInputs.length > 0) {
          const inputEl = this.otpInputs.toArray()[0].nativeElement as HTMLInputElement;
          inputEl.value = '';
          inputEl.focus();
        }
      }, 50);
      this.toastService.showSuccess('Mã xác thực mới đã được gửi.');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Resend OTP for Registration
  async resendRegisterOtp(): Promise<void> {
    this.errorMessage = '';
    
    if (this.authService.isFirebaseMode) {
      this.initRecaptcha();
    }

    const result = await this.authService.sendOTP(this.registerPhoneNumber, this.recaptchaVerifier, 'register');
    if (result.success) {
      this.generatedOtp = result.otp || '';
      if (!this.authService.isFirebaseMode && result.otp) {
        this.showSmsNotification(this.registerPhoneNumber, result.otp);
      }
      this.otpString = '';
      this.otpTimer = 180;
      this.startOtpTimer();
      setTimeout(() => {
        if (this.otpInputs && this.otpInputs.length > 0) {
          const inputEl = this.otpInputs.toArray()[0].nativeElement as HTMLInputElement;
          inputEl.value = '';
          inputEl.focus();
        }
      }, 50);
      this.toastService.showSuccess('Mã xác thực mới đã được gửi.');
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Submit Password Reset (With AUTO LOGIN)
  async onResetSubmit(): Promise<void> {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { password } = this.resetForm.value;

    const result = await this.authService.resetPassword(this.resetPhoneNumber, password);
    
    if (result.success) {
      this.showSuccessStatus('Đặt lại mật khẩu thành công', 'Đang tự động đăng nhập...');
      this.destroyRecaptcha();
      
      // Auto login in the background!
      setTimeout(async () => {
        await this.authService.login(this.resetPhoneNumber, password);
      }, 500);
    } else {
      setTimeout(() => {
        this.errorMessage = result.message;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // --- RECAPTCHA UTILITIES ---

  private initRecaptcha(): void {
    if (typeof window === 'undefined') return;
    if (this.recaptchaVerifier) {
      return;
    }

    try {
      const auth = getAuth();
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    } catch (e) {
      console.error('[VIAGO AUTH] Lỗi tạo RecaptchaVerifier:', e);
    }
  }

  private destroyRecaptcha(): void {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {}
      this.recaptchaVerifier = null;
    }
  }

  // --- SMS TOAST MOCK UTILITIES ---

  private showSmsNotification(phoneNumber: string, otp: string): void {
    if (this.smsNotificationTimeoutId) {
      clearTimeout(this.smsNotificationTimeoutId);
    }
    this.smsNotification = { phoneNumber, otp };
    this.smsNotificationTimeoutId = setTimeout(() => {
      this.smsNotification = null;
    }, 12000);
  }

  closeSmsNotification(): void {
    this.smsNotification = null;
    if (this.smsNotificationTimeoutId) {
      clearTimeout(this.smsNotificationTimeoutId);
    }
  }

  // --- OTP INTERACTION ---

  onOtpInput(event: any): void {
    let val = event.target.value;
    // Filter only digits
    val = val.replace(/[^0-9]/g, '');
    if (val.length > 6) {
      val = val.substring(0, 6);
    }
    this.otpString = val;
    event.target.value = val;
    this.cdr.detectChanges();
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (!pastedData) return;

    // Filter only digits
    let digits = pastedData.replace(/[^0-9]/g, '');
    if (digits.length > 6) {
      digits = digits.substring(0, 6);
    }
    this.otpString = digits;
    
    // Update hidden input DOM value
    if (this.otpInputs && this.otpInputs.length > 0) {
      const inputEl = this.otpInputs.toArray()[0].nativeElement as HTMLInputElement;
      inputEl.value = digits;
    }
    this.cdr.detectChanges();
  }

  // --- TIMER UTILITIES ---

  private startOtpTimer(): void {
    this.stopOtpTimer();
    this.otpTimer = 180;
    this.otpIntervalId = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.stopOtpTimer();
        setTimeout(() => {
          this.errorMessage = 'Mã OTP đã hết hạn. Vui lòng nhấn Gửi lại mã.';
        }, 0);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  private stopOtpTimer(): void {
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
}
