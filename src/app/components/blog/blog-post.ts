import { Component, OnInit, AfterViewChecked, ElementRef } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BlogService, BlogPost } from "../../services/blog.service";
import { MarkdownService } from "../../services/markdown.service";

@Component({
  selector: "app-blog-post",
  imports: [RouterLink, CommonModule],
  templateUrl: "./blog-post.html",
  styleUrl: "./blog-post.css",
})
export class BlogPostComponent implements OnInit, AfterViewChecked {
  post: BlogPost | null = null;
  content: string = "";
  isLoading = true;
  error: string | null = null;
  private contentRendered = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private markdownService: MarkdownService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadBlogPost(slug);
    } else {
      this.error = "Blog post not found";
      this.isLoading = false;
    }
  }

  ngAfterViewChecked(): void {
    if (this.content && !this.isLoading && !this.contentRendered) {
      this.renderMermaidDiagrams();
      this.contentRendered = true;
    }
  }

  private async renderMermaidDiagrams(): Promise<void> {
    try {
      await this.markdownService.renderMermaidDiagrams(this.elementRef.nativeElement);
    } catch (error) {
      console.error('Failed to render Mermaid diagrams:', error);
    }
  }

  private loadBlogPost(slug: string): void {
    this.isLoading = true;
    this.error = null;

    this.blogService.getBlogIndex().subscribe({
      next: (index) => {
        const post = index.posts.find(p => p.slug === slug);
        if (post) {
          this.post = post;
          this.loadPostContent(post.filename);
        } else {
          this.error = "Blog post not found";
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error("Failed to load blog post:", error);
        this.error = "Failed to load blog post. Please try again later.";
        this.isLoading = false;
      }
    });
  }

  private async loadPostContent(filename: string): Promise<void> {
    this.blogService.getBlogPost(filename).subscribe({
      next: async (markdown) => {
        try {
          this.content = await this.markdownService.renderMarkdown(markdown);
          this.isLoading = false;
          this.contentRendered = false; // Reset flag to trigger Mermaid rendering
        } catch (error) {
          console.error("Failed to render markdown:", error);
          this.error = "Failed to render post content. Please try again later.";
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error("Failed to load post content:", error);
        this.error = "Failed to load post content. Please try again later.";
        this.isLoading = false;
      }
    });
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