import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { isPlatformServer } from '@angular/common';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: string;
  readTime: number;
  featured: boolean;
  filename: string;
  coverImage?: string;
  content?: string;
}

export interface BlogIndex {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly basePath: string;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    const isGitHubPages = typeof window !== 'undefined' && 
      (window.location.hostname === 'bechir-braham.github.io' || 
       window.location.pathname.startsWith('/blog/'));
    this.basePath = isGitHubPages ? '/blog/assets/blog' : '/assets/blog';
  }

  getBlogIndex(): Observable<BlogIndex> {
    if (isPlatformServer(this.platformId)) {
      return of(this.loadBlogIndexSync());
    }
    return this.http.get<BlogIndex>(`${this.basePath}/blog-index.json`).pipe(
      catchError(() => of({ posts: [], categories: [], tags: [] }))
    );
  }

  getBlogPost(filename: string): Observable<string> {
    if (isPlatformServer(this.platformId)) {
      return of(this.loadBlogPostSync(filename));
    }
    return this.http.get(`${this.basePath}/${filename}`, { responseType: 'text' }).pipe(
      catchError(() => of('# Error\n\nFailed to load blog post.'))
    );
  }

  private loadBlogIndexSync(): BlogIndex {
    try {
      const fs = require('fs');
      const path = require('path');
      const indexPath = path.join(process.cwd(), 'public', 'assets', 'blog', 'blog-index.json');
      const content = fs.readFileSync(indexPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { posts: [], categories: [], tags: [] };
    }
  }

  private loadBlogPostSync(filename: string): string {
    try {
      const fs = require('fs');
      const path = require('path');
      const postPath = path.join(process.cwd(), 'public', 'assets', 'blog', filename);
      return fs.readFileSync(postPath, 'utf-8');
    } catch {
      return '# Error\n\nFailed to load blog post.';
    }
  }

  getPostById(id: string): Observable<BlogPost | null> {
    return this.getBlogIndex().pipe(
      map(index => index.posts.find(post => post.id === id) || null)
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.getBlogIndex().pipe(
      map(index => index.posts.find(post => post.slug === slug) || null)
    );
  }

  getPostWithContent(slug: string): Observable<BlogPost | null> {
    return this.getPostBySlug(slug).pipe(
      switchMap(post => {
        if (!post) return of(null);
        
        return this.getBlogPost(post.filename).pipe(
          map(content => ({ ...post, content }))
        );
      })
    );
  }

  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return this.getBlogIndex().pipe(
      map(index => index.posts.filter(post => 
        category === 'all' || post.category === category
      ))
    );
  }

  getPostsByTag(tag: string): Observable<BlogPost[]> {
    return this.getBlogIndex().pipe(
      map(index => index.posts.filter(post => 
        post.tags.includes(tag)
      ))
    );
  }

  getFeaturedPosts(): Observable<BlogPost[]> {
    return this.getBlogIndex().pipe(
      map(index => index.posts.filter(post => post.featured))
    );
  }

  getRecentPosts(limit: number = 5): Observable<BlogPost[]> {
    return this.getBlogIndex().pipe(
      map(index => {
        return index.posts
          .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
          .slice(0, limit);
      })
    );
  }

  searchPosts(query: string): Observable<BlogPost[]> {
    if (!query.trim()) {
      return this.getBlogIndex().pipe(map(index => index.posts));
    }

    const searchTerm = query.toLowerCase();
    
    return this.getBlogIndex().pipe(
      map(index => index.posts.filter(post => {
        return (
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          post.category.toLowerCase().includes(searchTerm)
        );
      }))
    );
  }

  getRelatedPosts(currentPost: BlogPost, limit: number = 3): Observable<BlogPost[]> {
    return this.getBlogIndex().pipe(
      map(index => {
        // Score posts by relevance
        const scoredPosts = index.posts
          .filter(post => post.id !== currentPost.id)
          .map(post => {
            let score = 0;
            
            // Same category gets higher score
            if (post.category === currentPost.category) {
              score += 3;
            }
            
            // Shared tags get points
            const sharedTags = post.tags.filter(tag => 
              currentPost.tags.includes(tag)
            ).length;
            score += sharedTags * 2;
            
            // Recent posts get slight boost
            const daysDiff = Math.abs(
              new Date(post.publishDate).getTime() - 
              new Date(currentPost.publishDate).getTime()
            ) / (1000 * 60 * 60 * 24);
            
            if (daysDiff < 30) score += 1;
            
            return { post, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.post);
        
        return scoredPosts;
      })
    );
  }

  getArchive(): Observable<{[year: string]: {[month: string]: BlogPost[]}}> {
    return this.getBlogIndex().pipe(
      map(index => {
        const archive: {[year: string]: {[month: string]: BlogPost[]}} = {};
        
        index.posts.forEach(post => {
          const date = new Date(post.publishDate);
          const year = date.getFullYear().toString();
          const month = date.toLocaleString('default', { month: 'long' });
          
          if (!archive[year]) archive[year] = {};
          if (!archive[year][month]) archive[year][month] = [];
          
          archive[year][month].push(post);
        });
        
        return archive;
      })
    );
  }
}