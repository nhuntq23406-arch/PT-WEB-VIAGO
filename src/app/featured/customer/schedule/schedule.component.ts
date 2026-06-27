import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Route {
  id: number;
  from: string;
  to: string;
  distance: string;
  duration: string;
  price: number;
  image: string;
  tags?: string[];
  vehicleTypes: string[];
  tripsPerDay?: number;
  isFeatured?: boolean;
  featuredTag?: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent implements OnInit {
  searchTerm: string = '';
  
  featuredRoutes: Route[] = [
    {
      id: 1,
      from: 'TP.HCM',
      to: 'Đà Lạt',
      distance: '310 km',
      duration: '7 tiếng',
      price: 250000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSmGIrRFRFx_kzLYR064A6J5uisqCpA-LY9T0llmwr2B4rvU5DlclwbSiWwGu75f66_dQz5mfVcvMorSjHt-G62lnri4AUjn4LaS9r7ZDCD03KnNSHug-ln3R_uvkqMxoYk-Rd1roCpCSn8fEy9a42MpqHsjJ3D7RaT-fUEkWdUOWU6_CqXTjId1UAzlGdhzl0-yLN71kJSZpXGLl36NcW8yeBxkV3W9NXqmryIbg4g2fTO9qH_UGTh_vCMkxFcQ_9POhgNyTkf-w',
      tags: ['🔥 Đặt nhiều nhất'],
      vehicleTypes: ['Cabin', 'Giường nằm', 'Limousine'],
      isFeatured: true
    },
    {
      id: 2,
      from: 'TP.HCM',
      to: 'Nha Trang',
      distance: '435 km',
      duration: '8.5 tiếng',
      price: 300000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYW1nZ_9EJ3Ur2ppLf1Q-hjThgEtCajmtHZfMbTxniyvusm5ETmABShyi3lWM7y6snE_w1HlZGhVErqqnhP1Wy0V9dKvJPHEgFQj81-Ovt08dVZ_BlthUcJxmZe8JJYNLHYnzc14Nwkl2HrVpy1ack2ffCxn91NHf-FK_1unVEDqzYfXFW9jN29GPlMW7hGh47HGj0iz0LxaVfLFg-1Lt4-vIeQYwFFl_Fa-W4zpUn1nVMpkmy7xiGBNp13xgL7z-T1mty25iFwgs',
      tags: ['☀️ Phổ biến mùa hè'],
      vehicleTypes: ['Limousine', 'Giường nằm'],
      isFeatured: true
    },
    {
      id: 3,
      from: 'Nha Trang',
      to: 'Đà Nẵng',
      distance: '530 km',
      duration: '11 tiếng',
      price: 350000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQE2FCeFBgPBF37jZ9xjHeSSmEIicpYboxFK0w_u9h9j4tYMt-2Usi0e_FB3g5dQe6w3RLJl-nu7miS1aFgVKIIrh7_d1rHgp4HEZVFwMs31bijE-0a5ERBNpl6sm22ATcuj1QgRRK6hQQ_4W5NSXt_lTV5ZL0Jsb7Ir9ZaE2eCYUAJvW3LnI_bTOATJPQl8HMO-swJYwqZy_EcOWh8vUwa30qVymtZctul4-EwdNKJ1zbMedft6E_dWbg8I915KSgU8BT2Tcdl_8',
      tags: ['⭐ Tuyến mới'],
      vehicleTypes: ['Limousine 34'],
      isFeatured: true
    }
  ];

allRoutes: Route[] = [
  {
    id: 1,
    from: 'TP.HCM',
    to: 'Cần Thơ',
    distance: '170km',
    duration: '3.5 tiếng',
    price: 180000,
    image: 'asset/images/customer/can_tho.jpg',
    vehicleTypes: ['Limousine', 'Cabin'],
    tripsPerDay: 12
  },
  {
    id: 2,
    from: 'TP.HCM',
    to: 'Vũng Tàu',
    distance: '100km',
    duration: '2 tiếng',
    price: 160000,
    image: 'asset/images/customer/vung_tau.jpg',
    vehicleTypes: ['Limousine', 'Giường nằm'],
    tripsPerDay: 20
  },
  {
    id: 3,
    from: 'Đà Lạt',
    to: 'Buôn Ma Thuột',
    distance: '210km',
    duration: '5 tiếng',
    price: 220000,
    image: 'asset/images/customer/buon_me_thuot.jpg',
    vehicleTypes: ['Giường nằm', 'Cabin'],
    tripsPerDay: 8
  },
  {
    id: 4,
    from: 'Đà Lạt',
    to: 'Nha Trang',
    distance: '140km',
    duration: '3 tiếng',
    price: 170000,
    image: 'asset/images/customer/nha_trang.jpg',
    vehicleTypes: ['Limousine', 'Cabin'],
    tripsPerDay: 15
  },
  {
    id: 5,
    from: 'Cần Thơ',
    to: 'Rạch Giá',
    distance: '115km',
    duration: '2.5 tiếng',
    price: 150000,
    image: 'asset/images/customer/rach_gia.jpg',
    vehicleTypes: ['Giường nằm', 'Limousine'],
    tripsPerDay: 10
  },
  {
    id: 6,
    from: 'TP.HCM',
    to: 'Phan Thiết',
    distance: '200km',
    duration: '4 tiếng',
    price: 200000,
    image: 'asset/images/customer/phan_thiet.jpg',
    vehicleTypes: ['Giường nằm', 'Cabin'],
    tripsPerDay: 18
  },
  {
    id: 7,
    from: 'TP.HCM',
    to: 'Đà Lạt',
    distance: '310km',
    duration: '7 tiếng',
    price: 250000,
    image: 'asset/images/customer/da_lat.jpg',
    vehicleTypes: ['Cabin', 'Limousine'],
    tripsPerDay: 25
  },
  {
    id: 8,
    from: 'TP.HCM',
    to: 'Nha Trang',
    distance: '435km',
    duration: '8.5 tiếng',
    price: 300000,
    image: 'asset/images/customer/nha_trang.jpg',
    vehicleTypes: ['Limousine', 'Giường nằm'],
    tripsPerDay: 22
  },
  {
    id: 9,
    from: 'Nha Trang',
    to: 'Đà Nẵng',
    distance: '530km',
    duration: '11 tiếng',
    price: 350000,
    image: 'asset/images/customer/da_nang.jpg',
    vehicleTypes: ['Limousine', 'Cabin'],
    tripsPerDay: 14
  }
];

  filteredRoutes: Route[] = [];

  ngOnInit() {
    this.filteredRoutes = [...this.allRoutes];
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredRoutes = [...this.allRoutes];
      return;
    }
    
    this.filteredRoutes = this.allRoutes.filter(route => 
      route.from.toLowerCase().includes(term) || 
      route.to.toLowerCase().includes(term)
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
