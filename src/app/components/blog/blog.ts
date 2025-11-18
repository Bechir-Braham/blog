import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BlogService, BlogPost } from "../../services/blog.service";

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
  categories: { id: string; name: string }[] = [{ id: "all", name: "All Posts" }];
  isLoading = true;
  error: string | null = null;

  constructor(private blogService: BlogService, private router: Router) {}

  async ngOnInit() {
    await this.loadBlogData();
  }

  private async loadBlogData() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const index = await this.blogService.getBlogIndex().toPromise();
      this.allPosts = index?.posts || [];
      this.filteredPosts = [...this.allPosts];
      
      const uniqueCategories = [...new Set(index?.categories || [])];
      this.categories = [
        { id: "all", name: "All Posts" },
        ...uniqueCategories.map(cat => ({ id: cat, name: cat }))
      ];
      
      this.isLoading = false;
    } catch (error) {
      console.error("Failed to load blog data:", error);
      this.error = "Failed to load blog posts. Please try again later.";
      this.isLoading = false;
    }
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  filterPosts() {
    this.applyFilters();
  }

  private applyFilters() {
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

  clearFilters() {
    this.searchQuery = "";
    this.selectedCategory = "all";
    this.filteredPosts = [...this.allPosts];
  }

  showPost(slug: string) {
    this.router.navigate(['/blog', slug]);
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString("en-US", { 
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
