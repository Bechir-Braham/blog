import { Component, OnInit, AfterViewChecked, ElementRef, Inject, PLATFORM_ID, OnDestroy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { BlogService, BlogPost } from "../../services/blog.service";
import { MarkdownService } from "../../services/markdown.service";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: "app-blog-post",
  imports: [RouterLink, CommonModule],
  templateUrl: "./blog-post.html",
  styleUrl: "./blog-post.css",
})
export class BlogPostComponent implements OnInit, AfterViewChecked, OnDestroy {
  post: BlogPost | null = null;
  content: string = "";
  isLoading = true;
  error: string | null = null;
  private contentRendered = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private markdownService: MarkdownService,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked(): void {
    // Only render Mermaid diagrams on the browser, not during SSR
    if (isPlatformBrowser(this.platformId) && this.content && !this.isLoading && !this.contentRendered) {
      // Add a small delay to ensure the content is fully rendered in the DOM
      setTimeout(() => {
        this.renderMermaidDiagrams();
      }, 100);
      this.contentRendered = true;
    }
  }

  private async renderMermaidDiagrams(): Promise<void> {
    // Only render on browser to avoid SSR issues
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      console.log('Blog post component: Starting Mermaid rendering...');
      await this.markdownService.renderMermaidDiagrams(this.elementRef.nativeElement);
      console.log('Blog post component: Mermaid rendering completed');
    } catch (error) {
      console.error('Blog post component: Failed to render Mermaid diagrams:', error);
    }
  }

  private loadBlogPost(slug: string): void {
    this.isLoading = true;
    this.error = null;

    this.blogService.getBlogIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (index) => {
          const post = index.posts.find((p: BlogPost) => p.slug === slug);
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

  private loadPostContent(filename: string): void {
    this.blogService.getBlogPost(filename)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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