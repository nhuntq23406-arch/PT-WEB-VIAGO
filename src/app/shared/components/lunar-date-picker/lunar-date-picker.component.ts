import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef, ElementRef, ViewChild, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { convertSolar2Lunar } from '../../../core/utils/lunar-calendar';

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLunarLeap: boolean;
}

@Component({
  selector: 'app-lunar-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lunar-date-picker.component.html',
  styleUrls: ['./lunar-date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LunarDatePickerComponent),
      multi: true
    }
  ]
})
export class LunarDatePickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() variant: 'default' | 'search' = 'default';

  popoverPosition: 'top' | 'bottom' = 'bottom';

  @ViewChild('inputDay') inputDay!: ElementRef<HTMLInputElement>;
  @ViewChild('inputMonth') inputMonth!: ElementRef<HTMLInputElement>;
  @ViewChild('inputYear') inputYear!: ElementRef<HTMLInputElement>;

  // Input segments values
  dayVal = '';
  monthVal = '';
  yearVal = '';

  // Calendar popover state
  showCalendar = false;
  currentCalMonth = new Date().getMonth() + 1;
  currentCalYear = new Date().getFullYear();
  calendarDays: CalendarDay[] = [];
  weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  yearsList: number[] = [];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize years from 1920 to 2070
    const startYear = 1920;
    const endYear = 2070;
    for (let y = startYear; y <= endYear; y++) {
      this.yearsList.push(y);
    }
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.onDocumentClickCapture, true);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScrollCapture, true);
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.onDocumentClickCapture, true);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScrollCapture, true);
    }
  }

  private onDocumentClickCapture = (event: MouseEvent) => {
    if (this.showCalendar && !this.elementRef.nativeElement.contains(event.target)) {
      this.showCalendar = false;
      this.cdr.markForCheck();
    }
  };

  private onScrollCapture = () => {
    if (this.showCalendar) {
      this.adjustPopoverPosition();
    }
  };

  adjustPopoverPosition(): void {
    if (!this.showCalendar) return;
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 340 && spaceAbove > spaceBelow) {
      this.popoverPosition = 'top';
    } else {
      this.popoverPosition = 'bottom';
    }
    this.cdr.markForCheck();
  }

  // --- CONTROL VALUE ACCESSOR IMPLEMENTATION ---

  writeValue(value: any): void {
    if (value) {
      // Standard ISO or YYYY-MM-DD string
      const dateStr = String(value).trim();
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        this.yearVal = parts[0];
        this.monthVal = parts[1].padStart(2, '0');
        this.dayVal = parts[2].padStart(2, '0');
      } else {
        const partsSlash = dateStr.split('/');
        if (partsSlash.length === 3) {
          // If in dd/mm/yyyy format
          if (partsSlash[2].length === 4) {
            this.dayVal = partsSlash[0].padStart(2, '0');
            this.monthVal = partsSlash[1].padStart(2, '0');
            this.yearVal = partsSlash[2];
          } else {
            this.yearVal = partsSlash[0];
            this.monthVal = partsSlash[1].padStart(2, '0');
            this.dayVal = partsSlash[2].padStart(2, '0');
          }
        }
      }
      this.syncCalDateFromValue();
    } else {
      this.dayVal = '';
      this.monthVal = '';
      this.yearVal = '';
      this.currentCalMonth = new Date().getMonth() + 1;
      this.currentCalYear = new Date().getFullYear();
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // --- INPUT KEY EVENTS & AUTO-FOCUS SEGMENTS ---

  onDayInput(event: Event): void {
    const val = this.dayVal.replace(/\D/g, '');
    this.dayVal = val;
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num < 1 || num > 31) {
        this.dayVal = '31';
      }
      this.inputMonth.nativeElement.focus();
      this.inputMonth.nativeElement.select();
    }
    this.propagateValue();
  }

  onMonthInput(event: Event): void {
    const val = this.monthVal.replace(/\D/g, '');
    this.monthVal = val;
    if (val.length === 2) {
      const num = parseInt(val, 10);
      if (num < 1 || num > 12) {
        this.monthVal = '12';
      }
      this.inputYear.nativeElement.focus();
      this.inputYear.nativeElement.select();
    }
    this.propagateValue();
  }

  onYearInput(event: Event): void {
    const val = this.yearVal.replace(/\D/g, '');
    this.yearVal = val;
    if (val.length === 4) {
      const num = parseInt(val, 10);
      if (num < 1920) this.yearVal = '1920';
      if (num > 2070) this.yearVal = '2070';
      this.inputYear.nativeElement.blur();
    }
    this.propagateValue();
  }

  onDayKeyDown(event: KeyboardEvent): void {
    // If empty and user pressed backspace, do nothing
  }

  onMonthKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.monthVal.length === 0) {
      this.inputDay.nativeElement.focus();
      event.preventDefault();
    }
  }

  onYearKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.yearVal.length === 0) {
      this.inputMonth.nativeElement.focus();
      event.preventDefault();
    }
  }

  onInputBlur(): void {
    this.onTouched();
    // Validate segments and pad values
    setTimeout(() => {
      this.formatAndPropagate();
    }, 200);
  }

  private formatAndPropagate(): void {
    if (this.dayVal) this.dayVal = this.dayVal.padStart(2, '0');
    if (this.monthVal) this.monthVal = this.monthVal.padStart(2, '0');
    if (this.yearVal && this.yearVal.length < 4) this.yearVal = this.yearVal.padStart(4, '20');

    this.propagateValue();
    this.syncCalDateFromValue();
  }

  private propagateValue(): void {
    if (this.dayVal && this.monthVal && this.yearVal && this.yearVal.length === 4) {
      const formatted = `${this.yearVal}-${this.monthVal.padStart(2, '0')}-${this.dayVal.padStart(2, '0')}`;
      this.onChange(formatted);
    } else {
      this.onChange('');
    }
  }

  private syncCalDateFromValue(): void {
    if (this.yearVal && this.monthVal) {
      const m = parseInt(this.monthVal, 10);
      const y = parseInt(this.yearVal, 10);
      if (m >= 1 && m <= 12 && y >= 1920 && y <= 2070) {
        this.currentCalMonth = m;
        this.currentCalYear = y;
      }
    }
  }

  // --- CALENDAR GENERATION & INTERACTIVE EVENTS ---

  openCalendar(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    if (!this.showCalendar) {
      this.showCalendar = true;
      this.syncCalDateFromValue();
      this.generateCalendar();
      this.adjustPopoverPosition();
    }
  }

  toggleCalendar(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.syncCalDateFromValue();
      this.generateCalendar();
      this.adjustPopoverPosition();
    }
  }

  closeCalendar(): void {
    this.showCalendar = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.showCalendar) {
      this.adjustPopoverPosition();
    }
  }

  generateCalendar(): void {
    const year = this.currentCalYear;
    const month = this.currentCalMonth;

    // First day of current month (1-indexed day of week: Monday=1, Sunday=0 or 7)
    const firstDate = new Date(year, month - 1, 1);
    let startDayOfWeek = firstDate.getDay(); // Sunday=0, Monday=1, etc.
    if (startDayOfWeek === 0) startDayOfWeek = 7; // Convert Sunday to 7

    // Number of days in current month
    const totalDays = new Date(year, month, 0).getDate();

    // Number of days in previous month
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const days: CalendarDay[] = [];

    // 1. Previous month trailing days to align grid on Monday
    const prevDaysCount = startDayOfWeek - 1; // e.g. Monday = 0 trailing days
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    for (let i = prevDaysCount - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push(this.createCalendarDay(d, prevMonth, prevYear, false));
    }

    // 2. Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push(this.createCalendarDay(d, month, year, true));
    }

    // 3. Next month leading days to fill up the grid (total 42 cells)
    const nextDaysCount = 42 - days.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    for (let d = 1; d <= nextDaysCount; d++) {
      days.push(this.createCalendarDay(d, nextMonth, nextYear, false));
    }

    this.calendarDays = days;
  }

  private createCalendarDay(d: number, m: number, y: number, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    const isToday = today.getDate() === d && (today.getMonth() + 1) === m && today.getFullYear() === y;
    
    // Check if matches currently typed date
    let isSelected = false;
    if (this.dayVal && this.monthVal && this.yearVal) {
      isSelected = parseInt(this.dayVal, 10) === d && parseInt(this.monthVal, 10) === m && parseInt(this.yearVal, 10) === y;
    }

    // Solar to Lunar calculation
    const lunar = convertSolar2Lunar(d, m, y);

    return {
      day: d,
      month: m,
      year: y,
      isCurrentMonth,
      isToday,
      isSelected,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      lunarYear: lunar.year,
      isLunarLeap: lunar.leap
    };
  }

  selectDay(day: CalendarDay): void {
    this.dayVal = String(day.day).padStart(2, '0');
    this.monthVal = String(day.month).padStart(2, '0');
    this.yearVal = String(day.year);
    this.propagateValue();
    this.closeCalendar();
  }

  prevMonth(event: Event): void {
    event.stopPropagation();
    if (this.currentCalMonth === 1) {
      this.currentCalMonth = 12;
      this.currentCalYear--;
    } else {
      this.currentCalMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(event: Event): void {
    event.stopPropagation();
    if (this.currentCalMonth === 12) {
      this.currentCalMonth = 1;
      this.currentCalYear++;
    } else {
      this.currentCalMonth++;
    }
    this.generateCalendar();
  }

  onMonthSelectChange(): void {
    this.generateCalendar();
  }

  onYearSelectChange(): void {
    this.generateCalendar();
  }

  // Format lunar label for rendering
  getLunarLabel(day: CalendarDay): string {
    if (day.lunarDay === 1) {
      // Show day and month (e.g. 1/5)
      return `1/${day.lunarMonth}${day.isLunarLeap ? 'n' : ''}`;
    }
    // Show just the day number (e.g. 15)
    return String(day.lunarDay);
  }
}
