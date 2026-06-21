import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARTICLES, Article } from './news-data';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  activeCategory = 'all';

  categories = [
    { key: 'all', name: 'Tất cả' },
    { key: 'thong-bao', name: 'Thông báo' },
    { key: 'su-kien', name: 'Sự kiện' },
    { key: 'khuyen-mai', name: 'Khuyến mãi' },
    { key: 'tin-nha-xe', name: 'Tin nhà xe' },
    { key: 'cam-nang', name: 'Cẩm nang di chuyển' },
    { key: 'tuyen-dung', name: 'Tuyển dụng' }
  ];

  articles: Article[] = ARTICLES;

  featuredArticle!: Article;
  latestArticles: Article[] = [];
  midArticles: Article[] = [];
  allArticles: Article[] = [];
  paginatedArticles: Article[] = [];
  
  currentPage = 1;
  pageSize = 4;
  totalPages = 1;
  pagesArray: number[] = [];

  ngOnInit() {
    this.filterNews();
  }

  setCategory(categoryKey: string) {
    this.activeCategory = categoryKey;
    this.currentPage = 1; // Reset to page 1
    this.filterNews();
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedArticles();
    }
  }

  filterNews() {
    let filtered = this.articles;
    if (this.activeCategory !== 'all') {
      filtered = this.articles.filter(a => a.categoryKey === this.activeCategory);
    }

    // Set Featured Article
    const featured = filtered.find(a => a.isFeatured) || filtered[0];
    if (featured) {
      this.featuredArticle = featured;
    }

    // Set Latest Articles (Up to 3 items)
    this.latestArticles = filtered.slice(0, 3);

    // Set Mid Articles (Item 3 and 4 in list)
    this.midArticles = filtered.slice(0, 2);

    // Set All Articles (All filtered items)
    this.allArticles = filtered;
    
    // Pagination Setup
    this.totalPages = Math.ceil(this.allArticles.length / this.pageSize);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedArticles();
  }

  updatePaginatedArticles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedArticles = this.allArticles.slice(startIndex, startIndex + this.pageSize);
  }

  getCategoryName(key: string): string {
    const cat = this.categories.find(c => c.key === key);
    return cat ? cat.name : '';
  }
}

