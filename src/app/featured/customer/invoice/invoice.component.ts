import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type InvoiceTab = 'search' | 'verify';
type ViewState = 'form' | 'loading' | 'result';
type ModalType = 'success' | 'fail' | 'system_error' | null;

interface Invoice {
  lookupCode: string;
  invoiceNumber: string;
  symbol: string;
  issueDate: string;
  companyInfo: {
    name: string;
    address: string;
    taxId: string;
  };
  customerInfo: {
    name: string;
    address: string;
    taxId: string;
  };
  tripInfo: {
    route: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
  };
  totalAmount: number;
  status: 'valid' | 'invalid';
  imageUrl: string;
}


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

  mockInvoices: Invoice[] = [
    {
      lookupCode: 'VIAGO12345',
      invoiceNumber: '0000001',
      symbol: 'AA/2024',
      issueDate: '2024-06-25',
      companyInfo: {
        name: 'Công ty TNHH ViAGO',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        taxId: '0312345678',
      },
      customerInfo: {
        name: 'Nguyễn Văn A',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        taxId: '0109876543',
      },
      tripInfo: {
        route: 'TP.HCM - Đà Lạt',
        departureTime: '2024-07-01 08:00',
        arrivalTime: '2024-07-01 14:00',
        price: 300000,
      },
      totalAmount: 300000,
      status: 'valid',
      imageUrl: 'asset/images/customer/hoadon.png',
    },
    {
      lookupCode: 'VIAGO67890',
      invoiceNumber: '0000002',
      symbol: 'BB/2024',
      issueDate: '2024-06-26',
      companyInfo: {
        name: 'Công ty TNHH ViAGO',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        taxId: '0312345678',
      },
      customerInfo: {
        name: 'Trần Thị B',
        address: '789 Đường QWE, Quận 3, TP.HCM',
        taxId: '0101122334',
      },
      tripInfo: {
        route: 'Hà Nội - Sapa',
        departureTime: '2024-07-05 20:00',
        arrivalTime: '2024-07-06 06:00',
        price: 500000,
      },
      totalAmount: 500000,
      status: 'valid',
      imageUrl: 'asset/images/customer/hoadon.png',
    },
    {
      lookupCode: 'VIAGOINVALID',
      invoiceNumber: '0000003',
      symbol: 'CC/2024',
      issueDate: '2024-06-27',
      companyInfo: {
        name: 'Công ty TNHH ViAGO',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        taxId: '0312345678',
      },
      customerInfo: {
        name: 'Lê Văn C',
        address: '101 Đường RTY, Quận 4, TP.HCM',
        taxId: '0105566778',
      },
      tripInfo: {
        route: 'Đà Nẵng - Huế',
        departureTime: '2024-07-10 10:00',
        arrivalTime: '2024-07-10 12:00',
        price: 150000,
      },
      totalAmount: 150000,
      status: 'invalid',
      imageUrl: 'asset/images/customer/hoadon.png',
    }
  ];

  foundInvoice: Invoice | null = null;
  
  setActiveTab(tab: InvoiceTab) {
    this.activeTab = tab;
    this.resetState();
  }

  resetState() {
    this.viewState = 'form';
    this.modalType = null;
    this.captchaInput = '';
    this.errors = { searchCaptcha: '', verifyFile: '', verifyCaptcha: '' };
    this.foundInvoice = null; // Clear found invoice
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
    this.foundInvoice = null; // Reset found invoice

    setTimeout(() => {
      const invoice = this.mockInvoices.find(inv => inv.lookupCode === this.searchData.invoiceCode);
      if (invoice) {
        this.foundInvoice = invoice;
        this.mockInvoiceImg = invoice.imageUrl; // Update image based on found invoice
        this.viewState = 'result';
      } else {
        // Handle not found case, maybe show an error modal or message
        this.showModal('fail'); // Using fail modal for not found for now
        this.viewState = 'form'; // Go back to form or show a specific not-found view
      }
    }, 1500);
  }

  downloadXml() {
    if (!this.foundInvoice) return;

    const invoice = this.foundInvoice;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <LookupCode>${invoice.lookupCode}</LookupCode>
  <InvoiceNumber>${invoice.invoiceNumber}</InvoiceNumber>
  <Symbol>${invoice.symbol}</Symbol>
  <IssueDate>${invoice.issueDate}</IssueDate>
  <CompanyInfo>
    <Name>${invoice.companyInfo.name}</Name>
    <Address>${invoice.companyInfo.address}</Address>
    <TaxId>${invoice.companyInfo.taxId}</TaxId>
  </CompanyInfo>
  <CustomerInfo>
    <Name>${invoice.customerInfo.name}</Name>
    <Address>${invoice.customerInfo.address}</Address>
    <TaxId>${invoice.customerInfo.taxId}</TaxId>
  </CustomerInfo>
  <TripInfo>
    <Route>${invoice.tripInfo.route}</Route>
    <DepartureTime>${invoice.tripInfo.departureTime}</DepartureTime>
    <ArrivalTime>${invoice.tripInfo.arrivalTime}</ArrivalTime>
    <Price>${invoice.tripInfo.price}</Price>
  </TripInfo>
  <TotalAmount>${invoice.totalAmount}</TotalAmount>
  <Status>${invoice.status}</Status>
</Invoice>`;

    const filename = `HD_${invoice.invoiceNumber}.xml`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  printInvoice() {
    if (this.foundInvoice && this.foundInvoice.imageUrl) {
      const printWindow = window.open(this.foundInvoice.imageUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      window.print(); // Fallback to printing the whole page if no image found
    }
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

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.errors.verifyFile = 'Chỉ chấp nhận tệp định dạng .PDF';
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

    if (!this.verifyData.file) {
      this.errors.verifyFile = 'Vui lòng tải lên tệp hóa đơn PDF.';
      return;
    }

    this.viewState = 'loading';

    setTimeout(() => {
      // Simulate reading data from PDF file name
      // const fileName = this.verifyData.file?.name || '';
      // const lookupCodeFromPdf = fileName.split('_')[0]; // Assuming format like VIAGO12345_invoice.pdf

      // const foundInvoice = this.mockInvoices.find(inv => inv.lookupCode === lookupCodeFromPdf);

      // Always show success for now, as per requirement
      this.showModal('success');
      
      setTimeout(() => {
        this.modalType = null;
        this.viewState = 'result';
      }, 1500);
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