import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReviewMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface ReviewReply {
  operator: string;
  date: string;
  comment: string;
}

interface Review {
  id: number;
  userName: string;
  avatarText: string;
  avatarBg: string;
  membership: string;
  verified: boolean;
  date: string;
  score: number;
  title: string;
  content: string;
  route: string;
  vehicleType: string;
  criteriaRatings: {
    driver: number;
    vehicle: number;
    service: number;
    price: number;
    cleanliness: number;
  };
  tags: string[];
  media?: ReviewMedia[];
  likes: number;
  liked?: boolean;
  comments: number;
  replies?: ReviewReply;
}

interface KeywordCategory {
  title: string;
  options: string[];
}

interface RouteOption {
  name: string;
  count: number;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit {
  allReviews: Review[] = [];
  filteredReviews: Review[] = [];
  paginatedReviews: Review[] = [];

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  // New Vexere-style filter properties
  activeFilterTab: 'all' | 'comment' | 'media' = 'all';
  selectedStar: number | 'all' = 'all';
  selectedVehicle: string = 'all';
  selectedRoute = 'all';

  routeOptions: RouteOption[] = [];
  vehicleOptions = ['all', 'Limousine 9 chỗ', 'Limousine giường nằm 34 chỗ', 'Limousine 22 giường phòng (có WC)'];
  starOptions = ['all', '5', '4', '3', '2', '1'];

  // Counts for filter tabs
  totalAllCount = 0;
  totalCommentCount = 0;
  totalMediaCount = 0;

  translatedReviews: Record<number, boolean> = {};

  activeDomain = 'all'; // 'driver' | 'vehicle' | 'service' | 'price' | 'cleanliness' | 'all'
  isOperatorMode = false;
  newReplyTexts: Record<number, string> = {};

  domainKeywords: Record<string, string[]> = {
    driver: ['tài xế', 'lái xe', 'bác tài', 'thân thiện', 'lịch sự', 'lái an toàn', 'phóng nhanh', 'vượt ẩu'],
    vehicle: ['xe', 'giường', 'chỗ ngồi', 'ghế', 'thoải mái', 'chật', 'rách', 'bẩn', 'xe mới', 'xe cũ', 'điều hòa'],
    service: ['dịch vụ', 'nhân viên', 'phục vụ', 'đúng giờ', 'trễ', 'wifi', 'toilet', 'nước uống', 'khăn lạnh'],
    price: ['giá', 'vé', 'tiền', 'hợp lý', 'đắt', 'rẻ', 'chi phí', 'xứng đáng'],
    cleanliness: ['sạch', 'bẩn', 'hôi', 'vệ sinh', 'thơm', 'dọn dẹp', 'rác'],
  };

  searchText = '';
  sortOption = 'newest';

  averageRating = 0;
  totalReviews = 0;
  starCounts: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  criteriaAverages = {
    driver: 0,
    vehicle: 0,
    service: 0,
    price: 0,
    cleanliness: 0,
  };

  showFullReview: Record<number, boolean> = {};

  ngOnInit() {
    this.generateAllReviews();
    this.updateMetrics();
    this.updatePaginatedReviews();
  }

  generateAllReviews() {
    const users = [
      { name: 'Trần Hoàng Nam', avatar: 'HN', bg: 'bg-indigo-500', membership: 'Bạch kim' },
      { name: 'Lê Thị Thu Thảo', avatar: 'TT', bg: 'bg-green-600', membership: 'Vàng' },
      { name: 'Phạm Minh Quân', avatar: 'MQ', bg: 'bg-yellow-600', membership: 'Bạc' },
      { name: 'Nguyễn Quỳnh Anh', avatar: 'QA', bg: 'bg-pink-500', membership: 'Vàng' },
      { name: 'Lê Hữu Đạt', avatar: 'HD', bg: 'bg-purple-600', membership: 'Bạch kim' },
      { name: 'Đặng Tuấn Kiệt', avatar: 'TK', bg: 'bg-blue-600', membership: 'Bạc' },
      { name: 'Vũ Minh Triết', avatar: 'MT', bg: 'bg-teal-600', membership: 'Vàng' },
      { name: 'Hoàng Lan Anh', avatar: 'LA', bg: 'bg-red-500', membership: 'Bạc' },
      { name: 'Phan Quốc Bảo', avatar: 'QB', bg: 'bg-amber-600', membership: 'Bạch kim' },
      { name: 'Đỗ Thùy Linh', avatar: 'TL', bg: 'bg-rose-500', membership: 'Vàng' },
    ];

    const routes = [
      'Sài Gòn - Nha Trang',
      'Hà Nội - Sapa',
      'Bình Dương - Đà Lạt',
      'Sài Gòn - Đà Lạt',
      'Hà Nội - Quảng Ninh',
      'Đà Nẵng - Huế',
    ];

    const titles = [
      'Xe đúng giờ, phục vụ chuyên nghiệp',
      'Chuyến đi êm ái, xe sạch sẽ',
      'Nhân viên hỗ trợ chu đáo',
      'Giá tốt, dịch vụ xứng đáng',
      'Tuyệt vời! Nhất định sẽ quay lại',
      'Wifi ổn, ghế thoải mái',
      'Không gian xe rộng rãi và mát mẻ',
      'Tài xế lái cẩn thận, an toàn',
    ];

    const tagsPool = [
      'Thân thiện', 'Lịch sự', 'Lái an toàn', 'Đúng giờ', 'Suôn sẻ', 'Thoải mái', 'WiFi tốt', 'Toilet sạch', 'Xe mới/sạch', 'Giá hợp lý',
      'Lái nhanh/nguy hiểm', 'Trễ', 'Chật', 'Rách/bẩn', 'Nhân viên thân thiện', 'Cơm ăn tốt', 'Xe cũ/bẩn', 'Điều hòa tốt', 'Giá quá đắt',
    ];

    const vehicleTypes = ['Limousine 9 chỗ', 'Limousine giường nằm 34 chỗ', 'Limousine 22 giường phòng (có WC)'];
    const reviews: Review[] = [];

    for (let i = 1; i <= 80; i++) {
      const user = users[(i - 1) % users.length];
      const route = routes[(i - 1) % routes.length];
      const score = i <= 48 ? 5 : i <= 64 ? 4 : i <= 74 ? 3 : 2;
      const title = titles[(i - 1) % titles.length];
      const content = this.generateReviewContent(i, score, route);
      const tags = this.generateTags(i, tagsPool);
      const media = this.generateMedia(i);
      const vehicleType = vehicleTypes[(i - 1) % vehicleTypes.length];
      const replyComments = [
        'Cảm ơn bạn đã tin tưởng lựa chọn VIAGO. Rất hân hạnh được phục vụ bạn trên những hành trình tiếp theo!',
        'Chào bạn, VIAGO rất vui khi nhận được đánh giá tích cực từ bạn. Chúc bạn có những hành trình tuyệt vời sắp tới!',
        'VIAGO chân thành cảm ơn những ý kiến đóng góp quý báu của bạn. Chúng tôi sẽ không ngừng hoàn thiện để nâng cao chất lượng dịch vụ.',
        'Cảm ơn bạn đã trải nghiệm dịch vụ của VIAGO. Đội ngũ lái xe và nhân viên rất vui khi nhận được lời khen của bạn!',
        'Chào bạn, sự hài lòng của bạn là động lực lớn nhất của VIAGO. Hy vọng sẽ tiếp tục được đồng hành cùng bạn trên mọi nẻo đường.'
      ];
      const reply = i % 6 === 0 ? { 
        operator: 'VIAGO Team (Nhà xe)', 
        date: this.formatDate(new Date(2026, 5, 20 - Math.floor(i / 4))), 
        comment: replyComments[Math.floor(i / 6) % replyComments.length] 
      } : undefined;
      const criteriaRatings = this.generateCriteria(score);
      const date = this.formatDate(new Date(2026, 5, 20 - Math.floor(i / 2)));

      reviews.push({
        id: i,
        userName: `${user.name}`,
        avatarText: user.avatar,
        avatarBg: user.bg,
        membership: user.membership,
        verified: i % 3 !== 0,
        date,
        score,
        title,
        content,
        route,
        vehicleType,
        criteriaRatings,
        tags,
        media,
        likes: Math.abs((12 + i * 5) % 72),
        comments: Math.abs((i * 3 + 7) % 15),
        replies: reply,
      });
    }

    // Prepend the two real reviews featured on the homepage so they appear at the top
    const featuredReviews: Review[] = [
      {
        id: 1001,
        userName: 'Đỗ Thanh Phương',
        avatarText: 'TP',
        avatarBg: 'bg-pink-500',
        membership: 'Vàng',
        verified: true,
        date: '20/06/2026',
        score: 5,
        title: 'Nhân viên nhiệt tình, xe êm và đúng giờ',
        content: 'Nhân viên phục vụ nhiệt tình, hướng dẫn chỗ ngồi chu đáo, 5 sao cho nhà xe. Xe chạy rất êm, tài xế lái xe cẩn thận và đón đúng giờ. Sẽ tiếp tục ủng hộ.',
        route: 'Sài Gòn - Vũng Tàu',
        vehicleType: 'Limousine giường nằm 34 chỗ',
        criteriaRatings: { driver: 5, vehicle: 5, service: 5, price: 5, cleanliness: 5 },
        tags: ['Thân thiện', 'Lịch sự', 'Đúng giờ', 'Thoải mái', 'Xe mới/sạch'],
        likes: 48,
        comments: 3,
        replies: {
          operator: 'VIAGO Team (Nhà xe)',
          date: '21/06/2026',
          comment: 'Cảm ơn chị Phương đã tin tưởng lựa chọn VIAGO. Rất hân hạnh được phục vụ chị trên những hành trình tiếp theo!'
        }
      },
      {
        id: 1002,
        userName: 'Nguyễn Văn An',
        avatarText: 'VA',
        avatarBg: 'bg-blue-600',
        membership: 'Bạch kim',
        verified: true,
        date: '18/06/2026',
        score: 5,
        title: 'Dịch vụ chuyên nghiệp, wifi mạnh, ghế rất thoải mái',
        content: 'Dịch vụ chuyên nghiệp, ghế ngồi rất thoải mái. Wifi trên xe mạnh, sạc điện thoại tiện lợi. Một trải nghiệm đi đường dài tuyệt vời.',
        route: 'Sài Gòn - Nha Trang',
        vehicleType: 'Limousine 9 chỗ',
        criteriaRatings: { driver: 5, vehicle: 5, service: 5, price: 4, cleanliness: 5 },
        tags: ['WiFi tốt', 'Thoải mái', 'Lịch sự', 'Suôn sẻ', 'Giá hợp lý'],
        likes: 36,
        comments: 2,
        replies: {
          operator: 'VIAGO Team (Nhà xe)',
          date: '19/06/2026',
          comment: 'VIAGO rất vui khi nhận được đánh giá tích cực từ anh. Chúc anh có những hành trình tuyệt vời sắp tới!'
        }
      }
    ];

    this.allReviews = [...featuredReviews, ...reviews];
    this.routeOptions = this.buildRouteOptions(this.allReviews);
    this.totalReviews = this.allReviews.length;

    // Calculate tab counts
    this.totalAllCount = reviews.length;
    this.totalCommentCount = reviews.filter(r => r.content && r.content.trim().length > 0).length;
    this.totalMediaCount = reviews.filter(r => r.media && r.media.length > 0).length;
  }

  buildRouteOptions(reviews: Review[]): RouteOption[] {
    const counts: Record<string, number> = {};
    reviews.forEach(r => {
      counts[r.route] = (counts[r.route] || 0) + 1;
    });
    return Object.keys(counts).sort().map(route => ({ name: route, count: counts[route] }));
  }

  unsplashMediaPool = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1570126618967-557922421f20?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=400'
  ];

  generateReviewContent(index: number, score: number, route: string) {
    const templates5 = [
      `Chuyến đi từ ${route} vô cùng hoàn hảo! Xe sạch sẽ tinh tươm, không mùi khó chịu. Lái xe nhiệt tình, chu đáo hỗ trợ mang vác hành lý cho gia đình mình. Rất hài lòng về chất lượng.`,
      `Tôi đi chuyến lúc tối muộn, tài xế chạy cực kỳ êm và an toàn, giúp tôi ngủ rất ngon suốt chặng đường. Xe trang bị đầy đủ tiện nghi, nước uống, chăn ấm sạch sẽ. Xứng đáng 5 sao!`,
      `Nhân viên tổng đài và nhân viên phụ xe hỗ trợ cực kỳ nhiệt tình. Xe chạy rất đúng giờ, không bắt khách dọc đường. Mình sẽ luôn chọn VIAGO cho tuyến ${route} này.`,
      `Trải nghiệm tuyệt vời! Ghế nằm massage siêu thoải mái, hệ thống điều hòa mát mẻ dễ chịu, wifi căng đét giúp mình giải trí suốt cả chuyến đi dài.`
    ];

    const templates4 = [
      `Dịch vụ xe nhìn chung rất ổn định, xe sạch và rộng rãi. Tài xế lái xe cẩn thận. Tuy nhiên xuất phát trễ khoảng 10 phút, hy vọng nhà xe khắc phục điểm nhỏ này.`,
      `Chất lượng xe VIP tương xứng với giá tiền. Điểm trừ duy nhất là trạm dừng nghỉ hơi đông đúc. Còn lại mọi thứ từ thái độ phục vụ đến tiện ích đều rất tuyệt vời.`,
      `Tuyến xe này chạy khá êm, nhân viên lịch sự. Ghế ngồi thoải mái nhưng cổng sạc USB hơi lỏng một chút. Tổng quan chuyến đi vẫn rất hài lòng.`
    ];

    const templates3 = [
      `Xe đi tạm ổn nhưng điều hòa hơi lạnh quá mức, tôi phải xin thêm chăn đắp. Wifi lúc kết nối được lúc không, chập chờn suốt dọc đường đi.`,
      `Thời gian di chuyển hơi lâu hơn dự kiến do trời mưa và kẹt xe lúc vào thành phố. Tài xế lái an toàn nhưng thái độ phục vụ của phụ xe chưa được thân thiện lắm.`,
      `Ghế ngồi tương đối thoải mái nhưng xe có mùi máy lạnh hơi nồng ban đầu. Dịch vụ dừng nghỉ trung chuyển chưa thực sự nhanh chóng.`
    ];

    const templates2 = [
      `Xe chạy trễ giờ hẹn của tôi gần 30 phút làm lỡ công việc. Không gian vệ sinh trên xe chưa thực sự sạch sẽ, có mùi thuốc lá thoang thoảng.`,
      `Thái độ của nhân viên phụ xe khá cộc cằn khi xếp hành lý. Xe đi xóc và ồn ào khiến tôi không thể chợp mắt được. Cần nâng cấp dịch vụ gấp.`
    ];

    let content = '';
    if (score >= 5) {
      content = templates5[index % templates5.length];
    } else if (score >= 4) {
      content = templates4[index % templates4.length];
    } else if (score >= 3) {
      content = templates3[index % templates3.length];
    } else {
      content = templates2[index % templates2.length];
    }

    return content;
  }

  generateTags(index: number, pool: string[]) {
    const baseTags = [pool[index % pool.length], pool[(index + 2) % pool.length]];
    if (index % 5 === 0) {
      baseTags.push('Đúng giờ');
    }
    if (index % 6 === 0) {
      baseTags.push('WiFi tốt');
    }
    return Array.from(new Set(baseTags));
  }

  generateMedia(index: number): ReviewMedia[] {
    const list: ReviewMedia[] = [];
    if (index % 5 === 0) {
      list.push({ type: 'image', url: this.unsplashMediaPool[index % this.unsplashMediaPool.length] });
      list.push({ type: 'image', url: this.unsplashMediaPool[(index + 3) % this.unsplashMediaPool.length] });
    } else if (index % 3 === 0) {
      list.push({ type: 'image', url: this.unsplashMediaPool[(index + 1) % this.unsplashMediaPool.length] });
    } else if (index % 4 === 0) {
      list.push({ type: 'image', url: this.unsplashMediaPool[(index + 2) % this.unsplashMediaPool.length] });
    }
    return list;
  }

  generateCriteria(score: number) {
    return {
      driver: Math.min(5, Math.max(3, score + (Math.random() > 0.5 ? 0 : -1))),
      vehicle: Math.min(5, Math.max(3, score + (Math.random() > 0.4 ? 0 : -1))),
      service: Math.min(5, Math.max(3, score + (Math.random() > 0.6 ? 1 : 0))),
      price: Math.min(5, Math.max(2, score + (Math.random() > 0.7 ? -1 : 0))),
      cleanliness: Math.min(5, Math.max(3, score + (Math.random() > 0.5 ? 0 : -1))),
    };
  }

  formatDate(date: Date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  updateMetrics() {
    if (!this.allReviews.length) {
      return;
    }

    const total = this.allReviews.length;
    const sumScore = this.allReviews.reduce((sum, review) => sum + review.score, 0);
    this.averageRating = 4.8;

    this.starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const criteriaSum = { driver: 0, vehicle: 0, service: 0, price: 0, cleanliness: 0 };

    this.allReviews.forEach(review => {
      this.starCounts[review.score] = (this.starCounts[review.score] || 0) + 1;
      criteriaSum.driver += review.criteriaRatings.driver;
      criteriaSum.vehicle += review.criteriaRatings.vehicle;
      criteriaSum.service += review.criteriaRatings.service;
      criteriaSum.price += review.criteriaRatings.price;
      criteriaSum.cleanliness += review.criteriaRatings.cleanliness;
    });

    this.criteriaAverages = {
      driver: parseFloat((criteriaSum.driver / total).toFixed(1)),
      vehicle: parseFloat((criteriaSum.vehicle / total).toFixed(1)),
      service: parseFloat((criteriaSum.service / total).toFixed(1)),
      price: parseFloat((criteriaSum.price / total).toFixed(1)),
      cleanliness: parseFloat((criteriaSum.cleanliness / total).toFixed(1)),
    };
  }

  getStarPercentage(star: number) {
    const count = this.starCounts[star] || 0;
    return this.totalReviews ? `${Math.round((count / this.totalReviews) * 100)}%` : '0%';
  }

  updateFilteredReviews() {
    const lowerSearch = this.searchText.trim().toLowerCase();

    this.filteredReviews = this.allReviews.filter(review => {
      // Route filter
      if (this.selectedRoute !== 'all' && review.route !== this.selectedRoute) {
        return false;
      }

      // Star filter
      if (this.selectedStar !== 'all' && review.score !== this.selectedStar) {
        return false;
      }

      // Vehicle filter
      if (this.selectedVehicle !== 'all' && review.vehicleType !== this.selectedVehicle) {
        return false;
      }

      // Tab filter (All, Has Comment, Has Media)
      if (this.activeFilterTab === 'comment' && (!review.content || review.content.trim().length === 0)) {
        return false;
      }
      if (this.activeFilterTab === 'media' && (!review.media || review.media.length === 0)) {
        return false;
      }

      // Sidebar domain filter
      if (this.activeDomain !== 'all') {
        const keywords = this.domainKeywords[this.activeDomain];
        const contentLower = `${review.title} ${review.content} ${review.tags.join(' ')}`.toLowerCase();
        const matchesKeyword = keywords.some(kw => contentLower.includes(kw));
        if (!matchesKeyword) {
          return false;
        }
      }

      // Search keyword filter
      if (lowerSearch) {
        const haystack = `${review.userName} ${review.title} ${review.content} ${review.route} ${review.tags.join(' ')} ${review.replies?.comment || ''}`.toLowerCase();
        return haystack.includes(lowerSearch);
      }

      return true;
    });

    this.applySort();
    this.totalPages = Math.max(1, Math.ceil(this.filteredReviews.length / this.pageSize));
  }

  applySort() {
    this.filteredReviews.sort((a, b) => {
      if (this.sortOption === 'newest') {
        return this.parseDate(b.date) - this.parseDate(a.date);
      }
      if (this.sortOption === 'helpful') {
        return b.likes - a.likes;
      }
      if (this.sortOption === 'high') {
        return b.score - a.score;
      }
      if (this.sortOption === 'low') {
        return a.score - b.score;
      }
      return 0;
    });
  }

  parseDate(value: string) {
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  updatePaginatedReviews() {
    this.updateFilteredReviews();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }
  resetFilters() {
    this.selectedRoute = 'all';
    this.selectedStar = 'all';
    this.selectedVehicle = 'all';
    this.activeFilterTab = 'all';
    this.searchText = '';
    this.sortOption = 'newest';
    this.activeDomain = 'all';
    this.currentPage = 1;
    this.updatePaginatedReviews();
  }

  setFilterTab(tab: 'all' | 'comment' | 'media') {
    this.activeFilterTab = tab;
    this.currentPage = 1;
    this.updatePaginatedReviews();
  }

  toggleTranslation(reviewId: number) {
    this.translatedReviews[reviewId] = !this.translatedReviews[reviewId];
  }

  getTranslationText(review: Review): string {
    if (review.userName === 'Jiyeon Shin' || review.content.includes('Thank you')) {
      return 'Cảm ơn bạn. Mẹ tôi đã có một thời gian tuyệt vời cùng xe VIAGO.';
    }
    return `[Bản dịch tiếng Anh]: "The trip on route ${review.route} was overall very nice and comfortable. Highly recommended!"`;
  }

  setDomain(domain: string) {
    this.activeDomain = domain;
    this.currentPage = 1;
    this.updatePaginatedReviews();
  }

  submitReply(reviewId: number) {
    const text = this.newReplyTexts[reviewId]?.trim();
    if (!text) return;

    const review = this.allReviews.find(r => r.id === reviewId);
    if (review) {
      review.replies = {
        operator: 'VIAGO Team (Nhà xe)',
        date: this.formatDate(new Date()),
        comment: text
      };
      this.newReplyTexts[reviewId] = '';
      this.updatePaginatedReviews();
    }
  }

  setPage(page: number | string) {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
      this.currentPage = pageNum;
      this.updatePaginatedReviews();
    }
  }

  getVisiblePages(): (number | string)[] {
    const visible: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        visible.push(i);
      }
    } else if (current <= 4) {
      visible.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      visible.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      visible.push(1, '...', current - 1, current, current + 1, '...', total);
    }

    return visible;
  }

  toggleFullReview(reviewId: number) {
    this.showFullReview[reviewId] = !this.showFullReview[reviewId];
  }

  getReviewSnippet(review: Review) {
    if (this.showFullReview[review.id] || review.content.length <= 220) {
      return review.content;
    }
    return `${review.content.slice(0, 220)}...`;
  }

  showMoreLabel(review: Review) {
    return this.showFullReview[review.id] ? 'Thu gọn' : 'Xem thêm';
  }

  toggleBookmark(review: Review) {
    review.liked = !review.liked;
  }

  likeReview(review: Review) {
    if (!review.liked) {
      review.likes += 1;
      review.liked = true;
    } else {
      review.likes -= 1;
      review.liked = false;
    }
  }


}
