import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  userName: string;
  avatarText: string;
  avatarBg: string;
  date: string;
  score: number;
  content: string;
  route: string;
  likes: number;
  liked?: boolean;
  images?: string[];
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  allReviews: Review[] = [];
  filteredReviews: Review[] = [];
  paginatedReviews: Review[] = [];
  
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  activeFilter = 'all';

  ngOnInit() {
    this.generateAllReviews();
    this.updatePaginatedReviews();
  }

  generateAllReviews() {
    const users = [
      { name: 'Trần Hoàng Nam', avatar: 'HN', bg: 'bg-indigo-500' },
      { name: 'Lê Thị Thu Thảo', avatar: 'TT', bg: 'bg-green-600' },
      { name: 'Phạm Minh Quân', avatar: 'MQ', bg: 'bg-yellow-600' },
      { name: 'Nguyễn Quỳnh Anh', avatar: 'QA', bg: 'bg-pink-500' },
      { name: 'Lê Hữu Đạt', avatar: 'HD', bg: 'bg-purple-600' },
      { name: 'Đặng Tuấn Kiệt', avatar: 'TK', bg: 'bg-blue-600' },
      { name: 'Vũ Minh Triết', avatar: 'MT', bg: 'bg-teal-600' },
      { name: 'Hoàng Lan Anh', avatar: 'LA', bg: 'bg-red-500' },
      { name: 'Phan Quốc Bảo', avatar: 'QB', bg: 'bg-amber-600' },
      { name: 'Đỗ Thùy Linh', avatar: 'TL', bg: 'bg-rose-500' }
    ];

    const routes = [
      'Sài Gòn - Nha Trang',
      'Hà Nội - Sapa',
      'Bình Dương - Đà Lạt',
      'Sài Gòn - Đà Lạt',
      'Hà Nội - Quảng Ninh',
      'Đà Nẵng - Huế'
    ];

    const positiveComments = [
      'Xe chạy rất đúng giờ, tài xế lái đầm và an toàn. Nhân viên chăm sóc khách hàng gọi điện thông báo trước giờ xuất bến rất chu đáo. Giao diện xe sang trọng đúng nghĩa chuyên cơ mặt đất.',
      'Không gian bên trong xe sạch sẽ, thơm mùi tinh dầu tự nhiên rất dễ chịu. Hệ thống massage hoạt động tốt, wifi căng đét giúp mình làm việc trên xe thoải mái. Highly recommend nha mọi người!',
      'Rất hài lòng với dịch vụ Limousine của VIAGO. Xe giường phòng nằm riêng tư, chăn gối sạch sẽ thơm tho. Nhân viên tại phòng chờ VIP Hàng Xanh phục vụ nước uống rất chuyên nghiệp.',
      'Xe limousine đời mới, sạch sẽ vô cùng. Nhà xe phục vụ tận tình, chu đáo từ khi đặt vé cho đến suốt hành trình đi. Chắc chắn sẽ quay lại ủng hộ VIAGO.',
      'Tài xế lái xe cẩn thận, không phóng nhanh vượt ẩu. Tiện nghi trên xe cực kỳ hiện đại với màn hình giải trí riêng biệt và cổng sạc USB tiện dụng cho điện thoại.',
      'Dịch vụ rất tốt, xe chạy êm ái, ghế nằm thoải mái và có ổ cắm sạc điện thoại đầy đủ. Chắc chắn sẽ tiếp tục ủng hộ hãng xe trong các chuyến đi tới.',
      'Chất lượng dịch vụ tuyệt vời, nhân viên trung chuyển đón tận nơi đúng giờ. Lái xe thân thiện lịch sự, xử lý tình huống giao thông êm ái.',
      'Trải nghiệm tuyệt vời, không gian phòng chờ sạch đẹp có điều hòa mát lạnh. Rất đáng tiền cho một chuyến đi đường dài dễ chịu!'
    ];

    const neutralComments = [
      'Xe chạy tốt, ghế nằm êm nhưng wifi thỉnh thoảng hơi chập chờn một chút lúc đi qua đèo. Tổng thể vẫn rất hài lòng và xứng đáng đánh giá cao.',
      'Nhân viên phục vụ nhiệt tình nhưng xe xuất phát hơi trễ 10 phút do đợi khách trung chuyển cuối cùng. Tài xế chạy an toàn, phục vụ chu đáo.',
      'Tiện nghi đầy đủ, nước uống khăn lạnh miễn phí. Điểm trừ duy nhất là cổng sạc USB ở phòng mình sạc hơi chậm hơn bình thường.'
    ];

    const negativeComments = [
      'Xe đi hơi xóc ở đoạn đường đèo đang thi công. Nhân viên cần hướng dẫn khách vị trí cất hành lý rõ ràng hơn một chút.'
    ];

    const reviewsList: Review[] = [];

    for (let i = 1; i <= 120; i++) {
      const user = users[(i - 1) % users.length];
      const route = routes[(i - 1) % routes.length];
      
      // Determine score:
      // 102 reviews with 5.0 (5 Sao) -> index 1 to 102
      // 15 reviews with 4.5/4.8 (4 Sao) -> index 103 to 117
      // 2 reviews with 3.5 (3 Sao) -> index 118 to 119
      // 1 review with 2.0 (2 Sao) -> index 120
      let score = 5.0;
      let commentsPool = positiveComments;
      
      if (i > 119) {
        score = 2.0;
        commentsPool = negativeComments;
      } else if (i > 117) {
        score = 3.5;
        commentsPool = neutralComments;
      } else if (i > 102) {
        score = 4.5;
        commentsPool = neutralComments;
      }

      // Determine comment (content):
      // Exactly 95 reviews have comments.
      // Condition: i <= 80 (80 reviews) OR (106 <= i <= 120) (15 reviews). Total: 95 reviews.
      let content = '';
      if (i <= 80 || (i >= 106 && i <= 120)) {
        const commentIndex = (i - 1) % commentsPool.length;
        content = commentsPool[commentIndex];
      }

      // Determine images:
      // Exactly 32 reviews have images (i <= 32)
      let images: string[] = [];
      if (i <= 32) {
        const localReviewImages = [
          '/asset/images/customer/xe.jpg',
          '/asset/images/customer/ben_xe.jpg',
          '/asset/images/customer/da_nang.jpg',
          '/asset/images/customer/nha_trang.jpg',
          '/asset/images/customer/quang_truong_lam_vien_da_lat.jpg',
          '/asset/images/customer/summer.jpg'
        ];
        images = [localReviewImages[(i - 1) % localReviewImages.length]];
      }

      // Date generation
      const dateObj = new Date(2026, 5, 20); // 20 June 2026
      dateObj.setDate(dateObj.getDate() - Math.floor(i / 3));
      const d = String(dateObj.getDate()).padStart(2, '0');
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const y = dateObj.getFullYear();

      reviewsList.push({
        id: i,
        userName: i > 10 ? `${user.name} #${i}` : user.name,
        avatarText: user.avatar,
        avatarBg: user.bg,
        date: `${d}/${m}/${y}`,
        score: score,
        content: content,
        route: route,
        likes: Math.abs((15 + i * 7) % 60),
        images: images
      });
    }

    this.allReviews = reviewsList;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.updatePaginatedReviews();
  }

  updateFilteredReviews() {
    if (this.activeFilter === 'all') {
      this.filteredReviews = this.allReviews;
    } else if (this.activeFilter === 'comment') {
      this.filteredReviews = this.allReviews.filter(r => r.content.trim() !== '');
    } else if (this.activeFilter === 'image') {
      this.filteredReviews = this.allReviews.filter(r => r.images && r.images.length > 0);
    } else if (this.activeFilter === '5star') {
      this.filteredReviews = this.allReviews.filter(r => r.score >= 5.0);
    } else if (this.activeFilter === '4star') {
      this.filteredReviews = this.allReviews.filter(r => r.score >= 4.0 && r.score < 5.0);
    } else if (this.activeFilter === '3star') {
      this.filteredReviews = this.allReviews.filter(r => r.score >= 3.0 && r.score < 4.0);
    } else if (this.activeFilter === '2star') {
      this.filteredReviews = this.allReviews.filter(r => r.score >= 2.0 && r.score < 3.0);
    } else if (this.activeFilter === '1star') {
      this.filteredReviews = this.allReviews.filter(r => r.score >= 1.0 && r.score < 2.0);
    }

    this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  updatePaginatedReviews() {
    this.updateFilteredReviews();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
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
    } else {
      if (current <= 4) {
        visible.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        visible.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        visible.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return visible;
  }

  likeReview(review: Review) {
    if (!review.liked) {
      review.likes++;
      review.liked = true;
    } else {
      review.likes--;
      review.liked = false;
    }
  }
}
