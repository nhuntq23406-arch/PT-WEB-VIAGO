import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-bo-cuc',
  imports: [],
  templateUrl: './bo-cuc.html',
  styleUrl: './bo-cuc.css',
})
export class BoCuc {
  protected readonly activeTab = signal('overview');

  protected readonly colorTokens = [
    { name: 'Primary', value: '#002664', note: 'Tiêu đề, tab active, phân trang active' },
    { name: 'Primary Soft', value: '#1E3A8A', note: 'Link, icon, nhấn phụ' },
    { name: 'Success', value: '#10B981', note: 'Nút thêm mới, toast thành công' },
    { name: 'Success BG', value: '#ECFDF5', note: 'Nền banner thêm mới' },
    { name: 'Secondary', value: '#FF6A00', note: 'Nhấn thương hiệu, cảnh báo phụ' },
    { name: 'Secondary Hover', value: '#FF8126', note: 'Hover cho CTA cam' },
    { name: 'Background', value: '#F8FAFC', note: 'Nền trang admin' },
    { name: 'Border', value: '#E2E8F0', note: 'Viền card, input, table' },
    { name: 'Text Strong', value: '#0F172A', note: 'Tiêu đề trong nội dung' },
    { name: 'Text Muted', value: '#64748B', note: 'Mô tả, label phụ' },
  ];

  protected readonly sampleRows = [
    { code: 'AD-001', name: 'Nguyễn Văn An', group: 'Điều phối', status: 'Đang hoạt động', tone: 'success' },
    { code: 'AD-002', name: 'Trần Minh Khoa', group: 'Báo cáo', status: 'Chờ xử lý', tone: 'warning' },
    { code: 'AD-003', name: 'Lê Thu Hà', group: 'Nội dung', status: 'Tạm khóa', tone: 'danger' },
  ];
}
