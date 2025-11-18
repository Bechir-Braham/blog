import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import type { BlogIndex, BlogPost } from '../services/blog.service';

// Synchronous server-side blog data access
export function getServerBlogIndexSync(): BlogIndex {
  try {
    const fs = require('fs') as typeof import('fs');
    const path = require('path') as typeof import('path');
    
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'assets', 'blog', 'blog-index.json'),
      path.join(process.cwd(), 'static', 'blog-index.json'),
      path.join(process.cwd(), 'src', 'assets', 'blog', 'blog-index.json')
    ];

    for (const blogIndexPath of possiblePaths) {
      if (fs.existsSync(blogIndexPath)) {
        const content = fs.readFileSync(blogIndexPath, 'utf-8');
        const data = JSON.parse(content);
        console.log('Using server-side blog index data (sync):', data.posts.length, 'posts', 'from', blogIndexPath);
        return data;
      }
    }
    
    console.warn('Blog index file not found in any expected location');
    return { posts: [], categories: [], tags: [] };
  } catch (error) {
    console.error('Error reading blog index on server (sync):', error);
    return { posts: [], categories: [], tags: [] };
  }
}

export function getServerBlogPostSync(filename: string): string {
  try {
    const fs = require('fs') as typeof import('fs');
    const path = require('path') as typeof import('path');
    
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'assets', 'blog', filename),
      path.join(process.cwd(), 'static', 'assets', 'blog', filename),
      path.join(process.cwd(), 'src', 'assets', 'blog', filename)
    ];

    for (const postPath of possiblePaths) {
      if (fs.existsSync(postPath)) {
        const content = fs.readFileSync(postPath, 'utf-8');
        console.log('Using server-side blog post data (sync) for:', filename, 'from', postPath);
        return content;
      }
    }
    
    console.warn('Blog post file not found:', filename);
    return '# Error\n\nFailed to load blog post content.';
  } catch (error) {
    console.error('Error reading blog post on server (sync):', error);
    return '# Error\n\nFailed to load blog post content.';
  }
}

export function provideBlogData() {
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformServer(platformId)) {
    return {
      getBlogIndex: async (): Promise<BlogIndex> => {
        return getServerBlogIndexSync();
      },
      
      getBlogPost: async (filename: string): Promise<string> => {
        return getServerBlogPostSync(filename);
      }
    };
  }
  
  // Return null for client-side - will use HTTP requests
  return null;
}

export const BLOG_DATA_PROVIDER = 'BLOG_DATA_PROVIDER';