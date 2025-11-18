import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { provideBlogData, getServerBlogIndexSync, getServerBlogPostSync } from '../providers/blog-data.provider';

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
  private readonly basePath = '/assets/blog';
  private platformId = inject(PLATFORM_ID);
  private serverDataProvider = provideBlogData();

  constructor(private http: HttpClient) {}

  getBlogIndex(): Observable<BlogIndex> {
    // Use server-side data during SSR with synchronous approach
    if (isPlatformServer(this.platformId)) {
      try {
        const data = getServerBlogIndexSync();
        return of(data);
      } catch (error) {
        console.error('Server-side blog index failed:', error);
        return of({ posts: [], categories: [], tags: [] });
      }
    }
    
    // Use HTTP requests on client-side
    return this.http.get<BlogIndex>(`${this.basePath}/blog-index.json`).pipe(
      catchError(error => {
        console.error('Failed to load blog index:', error);
        return of({ posts: [], categories: [], tags: [] });
      })
    );
  }

  getBlogPost(filename: string): Observable<string> {
    // Use server-side data during SSR with synchronous approach
    if (isPlatformServer(this.platformId)) {
      try {
        const content = getServerBlogPostSync(filename);
        return of(content);
      } catch (error) {
        console.error('Server-side blog post failed:', error);
        return of('# Error\n\nFailed to load blog post content.');
      }
    }
    
    // Use HTTP requests on client-side
    return this.http.get(`${this.basePath}/${filename}`, { 
      responseType: 'text' 
    }).pipe(
      catchError(error => {
        console.error('Failed to load blog post:', error);
        return of('# Error\n\nFailed to load blog post content.');
      })
    );
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