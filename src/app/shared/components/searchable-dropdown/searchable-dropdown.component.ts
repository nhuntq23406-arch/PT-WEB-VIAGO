import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-dropdown.component.html',
  styleUrl: './searchable-dropdown.component.css'
})
export class SearchableDropdownComponent implements OnInit, OnChanges {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() items: string[] = [];
  @Input() id: string = '';
  @Input() value: string = '';
  @Input() iconPath: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  isOpen = false;
  searchText = '';
  filteredItems: string[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.searchText = this.value;
    this.filterList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.searchText = this.value;
    }
    if (changes['items'] || changes['value']) {
      this.filterList();
    }
  }

  // Detect click outside component
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  onFocus() {
    this.isOpen = true;
    this.filterList();
  }

  onInput() {
    this.isOpen = true;
    if (!this.searchText) {
      this.value = '';
      this.valueChange.emit('');
    }
    this.filterList();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (!this.searchText) {
        this.value = '';
        this.valueChange.emit('');
        this.closeDropdown();
      } else if (this.filteredItems.length > 0) {
        // Check if there is an exact match
        const exactMatch = this.filteredItems.find(
          item => this.normalizeStr(item) === this.normalizeStr(this.searchText)
        );
        if (exactMatch) {
          this.selectItem(exactMatch);
        } else {
          this.selectItem(this.filteredItems[0]);
        }
      } else {
        this.closeDropdown();
      }
      this.inputEl.nativeElement.blur();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.closeDropdown();
      this.inputEl.nativeElement.blur();
    }
  }

  selectItem(item: string) {
    this.value = item;
    this.searchText = item;
    this.valueChange.emit(item);
    this.closeDropdown();
    this.inputEl.nativeElement.blur();
  }

  clearValue(event: MouseEvent) {
    event.stopPropagation();
    this.searchText = '';
    this.value = '';
    this.valueChange.emit('');
    this.filterList();
    if (this.isOpen) {
      this.inputEl.nativeElement.focus();
    }
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.isOpen = true;
      this.inputEl.nativeElement.focus();
    }
  }

  openDropdown() {
    this.isOpen = true;
    setTimeout(() => {
      if (this.inputEl) {
        this.inputEl.nativeElement.focus();
      }
    }, 0);
  }

  closeDropdown() {
    this.isOpen = false;
    // If input is completely empty, clear the selected value
    if (!this.searchText) {
      this.value = '';
      this.valueChange.emit('');
      return;
    }
    // If the input text is not empty and doesn't match any item, reset to previous value
    if (this.searchText !== this.value) {
      const match = this.items.find(
        item => this.normalizeStr(item) === this.normalizeStr(this.searchText)
      );
      if (match) {
        this.selectItem(match);
      } else {
        this.searchText = this.value;
      }
    }
  }

  filterList() {
    if (!this.searchText || this.searchText === this.value) {
      this.filteredItems = [...this.items];
      return;
    }

    const normSearchText = this.normalizeStr(this.searchText);
    this.filteredItems = this.items.filter(item =>
      this.normalizeStr(item).includes(normSearchText)
    );
  }

  // Clean Vietnamese accents and normalize for search
  private normalizeStr(str: string): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  }
}
