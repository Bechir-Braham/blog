import { Component, OnInit, AfterViewChecked, ElementRef, PLATFORM_ID, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule, isPlatformBrowser } from "@angular/common";
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
  content = "";
  isLoading = true;
  error: string | null = null;
  private contentRendered = false;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private markdownService: MarkdownService,
    private elementRef: ElementRef
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = "Blog post not found";
      this.isLoading = false;
      return;
    }
    await this.loadBlogPost(slug);
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && this.content && !this.isLoading && !this.contentRendered) {
      setTimeout(() => this.renderMermaidDiagrams(), 100);
      this.contentRendered = true;
    }
  }

  private async renderMermaidDiagrams() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      await this.markdownService.renderMermaidDiagrams(this.elementRef.nativeElement);
    } catch (error) {
      console.error('Failed to render Mermaid diagrams:', error);
    }
  }

  private async loadBlogPost(slug: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const index = await this.blogService.getBlogIndex().toPromise();
      const post = index?.posts.find(p => p.slug === slug);
      
      if (!post) {
        this.error = "Blog post not found";
        this.isLoading = false;
        return;
      }

      this.post = post;
      const markdown = await this.blogService.getBlogPost(post.filename).toPromise();
      this.content = await this.markdownService.renderMarkdown(markdown || '');
      this.isLoading = false;
      this.contentRendered = false;
    } catch (error) {
      console.error("Failed to load blog post:", error);
      this.error = "Failed to load blog post. Please try again later.";
      this.isLoading = false;
    }
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
