import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ARTICLES, Article } from '../news-data';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];
  bottomArticles: Article[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      const id = idStr ? parseInt(idStr, 10) : 1;
      
      const foundArticle = ARTICLES.find(a => a.id === id);
      if (foundArticle) {
        this.article = foundArticle;
      } else {
        this.article = ARTICLES[0]; // fallback
      }

      // Filter related articles from same category, excluding current article
      this.relatedArticles = ARTICLES
        .filter(a => a.categoryKey === this.article.categoryKey && a.id !== this.article.id)
        .slice(0, 3);
        
      if (this.relatedArticles.length < 3) {
        // pad with other articles if not enough in same category
        const extra = ARTICLES.filter(a => a.id !== this.article.id && !this.relatedArticles.includes(a));
        this.relatedArticles = [...this.relatedArticles, ...extra].slice(0, 3);
      }

      // Bottom articles (3 items)
      this.bottomArticles = ARTICLES
        .filter(a => a.id !== this.article.id)
        .slice(0, 3);
    });
  }
}
