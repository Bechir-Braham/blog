import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  dateIso: string;
  primaryCategory: string;
  categories: string[];
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-blog',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class BlogComponent {
  searchQuery = '';
  selectedCategory = 'all';
  
  categories: Category[] = [
    { id: 'all', name: 'All Posts' },
    { id: 'tutorial', name: 'Tutorials' },
    { id: 'web-dev', name: 'Web Development' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'career', name: 'Career' },
    { id: 'tools', name: 'Tools' }
  ];

  allPosts: BlogPost[] = [
    {
      id: 1,
      slug: 'terminal-interface',
      title: 'Building a Terminal Interface with HTML/CSS/JS',
      description: 'Learn how to create an interactive terminal-style interface for your personal website using vanilla HTML, CSS, and JavaScript. This tutorial covers creating the visual design, implementing command processing, and adding keyboard navigation.',
      date: 'November 8, 2025',
      dateIso: '2025-11-08',
      primaryCategory: 'Tutorial',
      categories: ['tutorial', 'javascript'],
      tags: ['HTML', 'CSS', 'JavaScript', 'Terminal', 'UI/UX']
    },
    {
      id: 2,
      slug: 'web-dev-practices',
      title: 'Modern Web Development Best Practices',
      description: 'A comprehensive guide to modern web development practices including code organization, performance optimization, accessibility, and security considerations. Based on real-world experience from enterprise projects.',
      date: 'October 25, 2025',
      dateIso: '2025-10-25',
      primaryCategory: 'Web Development',
      categories: ['web-dev', 'career'],
      tags: ['Best Practices', 'Performance', 'Accessibility', 'Security']
    },
    {
      id: 3,
      slug: 'async-javascript',
      title: 'Understanding Async Programming in JavaScript',
      description: 'Deep dive into asynchronous programming patterns in JavaScript. Covers callbacks, promises, async/await, and common pitfalls. Includes practical examples and performance considerations.',
      date: 'September 15, 2025',
      dateIso: '2025-09-15',
      primaryCategory: 'JavaScript',
      categories: ['javascript', 'tutorial'],
      tags: ['JavaScript', 'Async', 'Promises', 'Performance']
    },
    {
      id: 4,
      slug: 'dev-tools-2025',
      title: 'Essential Developer Tools for 2025',
      description: 'My curated list of essential development tools that boost productivity and streamline workflows. Includes code editors, terminal tools, debugging utilities, and automation scripts.',
      date: 'August 30, 2025',
      dateIso: '2025-08-30',
      primaryCategory: 'Tools',
      categories: ['tools', 'career'],
      tags: ['Tools', 'Productivity', 'VSCode', 'Terminal']
    },
    {
      id: 5,
      slug: 'css-grid-guide',
      title: 'Building Responsive Layouts with CSS Grid',
      description: 'Master CSS Grid with practical examples and real-world use cases. Learn how to create complex, responsive layouts with clean, maintainable code.',
      date: 'July 20, 2025',
      dateIso: '2025-07-20',
      primaryCategory: 'CSS',
      categories: ['web-dev', 'tutorial'],
      tags: ['CSS', 'Grid', 'Responsive', 'Layout']
    },
    {
      id: 6,
      slug: 'career-journey',
      title: 'My Journey from Junior to Senior Developer',
      description: 'Reflections on my career progression, lessons learned, mistakes made, and advice for developers at any stage. Includes tips on skill development, networking, and finding the right opportunities.',
      date: 'June 10, 2025',
      dateIso: '2025-06-10',
      primaryCategory: 'Career',
      categories: ['career'],
      tags: ['Career', 'Growth', 'Advice', 'Personal']
    }
  ];

  filteredPosts: BlogPost[] = [...this.allPosts];

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterPosts();
  }

  filterPosts(): void {
    let posts = [...this.allPosts];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      posts = posts.filter(post => post.categories.includes(this.selectedCategory));
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredPosts = posts;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.filteredPosts = [...this.allPosts];
  }

  showPost(slug: string): void {
    // In a real implementation, this would navigate to the individual post
    console.log(`Showing post: ${slug}`);
    
    // Create notification for demo purposes
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-info text-black p-4 rounded shadow-lg z-50';
    notification.innerHTML = `
      <strong>Post Preview</strong><br>
      <small>Individual blog post view would open here</small>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}
