import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BlogService, BlogPost } from "../../services/blog.service";

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: "app-blog",
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: "./blog.html",
  styleUrl: "./blog.css",
})
export class BlogComponent implements OnInit {
  searchQuery = "";
  selectedCategory = "all";
  
  allPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  categories: Category[] = [
    { id: "all", name: "All Posts" }
  ];
  
  isLoading = true;
  error: string | null = null;

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.loadBlogData();
  }

  private loadBlogData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.blogService.getBlogIndex().subscribe({
      next: (index) => {
        this.allPosts = index.posts;
        this.filteredPosts = [...this.allPosts];
        
        const uniqueCategories = [...new Set(index.categories)];
        this.categories = [
          { id: "all", name: "All Posts" },
          ...uniqueCategories.map((cat: string) => ({ id: cat, name: cat }))
        ];
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Failed to load blog data:", error);
        this.error = "Failed to load blog posts. Please try again later.";
        this.isLoading = false;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  filterPosts(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let posts = [...this.allPosts];
    
    if (this.selectedCategory !== "all") {
      posts = posts.filter(post => post.category === this.selectedCategory);
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    this.filteredPosts = posts;
  }

  clearFilters(): void {
    this.searchQuery = "";
    this.selectedCategory = "all";
    this.filteredPosts = [...this.allPosts];
  }

  showPost(slug: string): void {
    this.router.navigate(['/blog', slug]);
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    } catch {
      return dateString;
    }
  }

  getReadingTimeText(minutes: number): string {
    return `${minutes} min read`;
  }
}
