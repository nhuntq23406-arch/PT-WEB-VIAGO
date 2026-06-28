import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ARTICLES, Article } from '../news-data';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css',
})
export class NewsDetailComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];
  bottomArticles: Article[] = [];
  bookmarked = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id') ?? 1);
      this.article = ARTICLES.find((article) => article.id === id) ?? ARTICLES[0];

      this.relatedArticles = ARTICLES
        .filter((article) => article.categoryKey === this.article.categoryKey && article.id !== this.article.id)
        .slice(0, 4);

      if (this.relatedArticles.length < 4) {
        const extra = ARTICLES.filter((article) => article.id !== this.article.id && !this.relatedArticles.includes(article));
        this.relatedArticles = [...this.relatedArticles, ...extra].slice(0, 4);
      }

      this.bottomArticles = ARTICLES.filter((article) => article.id !== this.article.id).slice(0, 3);
      this.bookmarked = false;
    });
  }

  copyLink() {
    const url = `${window.location.origin}/tin-tuc/chi-tiet/${this.article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      window.alert(`Đã sao chép liên kết bài viết: ${this.article.title}`);
    }).catch(() => {
      window.alert('Đã sao chép liên kết bài viết!');
    });
  }
}
