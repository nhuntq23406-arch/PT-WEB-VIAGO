import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type InvoiceTab = 'search' | 'verify';
type ViewState = 'form' | 'loading' | 'result';
type ModalType = 'success' | 'fail' | 'system_error' | null;

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  // Tabs & Views
  activeTab: InvoiceTab = 'search';
  viewState: ViewState = 'form';
  modalType: ModalType = null;

  // Form Data - Search
  searchData = {
    invoiceCode: '',
    captcha: ''
  };
  
  // Form Data - Verify
  verifyData = {
    file: null as File | null,
    captcha: ''
  };

  // Mock Captcha
  currentCaptcha: string = '46097';
  captchaInput: string = '';
  
  // Validation Errors
  errors = {
    searchCaptcha: '',
    verifyFile: '',
    verifyCaptcha: ''
  };

  // Mock Invoice Data
  mockInvoiceImg = 'asset/images/customer/hoadon.png';
  
  setActiveTab(tab: InvoiceTab) {
    this.activeTab = tab;
    this.resetState();
  }

  resetState() {
    this.viewState = 'form';
    this.modalType = null;
    this.captchaInput = '';
    this.errors = { searchCaptcha: '', verifyFile: '', verifyCaptcha: '' };
    this.refreshCaptcha();
  }

  refreshCaptcha() {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.currentCaptcha = result;
  }

  // --- Search Tab Logic ---
  canSearch(): boolean {
    return this.searchData.invoiceCode.trim().length > 0 && this.captchaInput.trim().length > 0;
  }

  onSearchInvoice() {
    this.errors.searchCaptcha = '';
    
    if (this.captchaInput !== this.currentCaptcha) {
      this.errors.searchCaptcha = 'Mã xác thực không chính xác. Vui lòng thử lại.';
      return;
    }

    this.viewState = 'loading';
    setTimeout(() => {
      this.viewState = 'result';
    }, 1500);
  }

  // --- Verify Tab Logic ---
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.validateFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.validateFile(file);
  }

  validateFile(file: File) {
    this.errors.verifyFile = '';
    this.verifyData.file = null;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      this.errors.verifyFile = 'Chỉ chấp nhận tệp định dạng .XML';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errors.verifyFile = 'Dung lượng tệp vượt quá 5MB';
      return;
    }

    this.verifyData.file = file;
  }

  canVerify(): boolean {
    return this.verifyData.file !== null && this.captchaInput.trim().length > 0;
  }

  onVerifyInvoice() {
    this.errors.verifyCaptcha = '';

    if (this.captchaInput !== this.currentCaptcha) {
      this.errors.verifyCaptcha = 'Mã xác thực không chính xác. Vui lòng thử lại.';
      return;
    }

    this.showModal('success');
    
    setTimeout(() => {
      this.modalType = null;
      this.viewState = 'result';
    }, 1500);
  }

  showModal(type: ModalType) {
    this.modalType = type;
  }

  closeModal() {
    this.modalType = null;
  }

  backToForm() {
    this.resetState();
  }
}