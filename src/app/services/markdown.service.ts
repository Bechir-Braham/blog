import { Injectable } from '@angular/core';
import { marked } from 'marked';
import hljs from 'highlight.js';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  
  constructor() {
    this.configureMarked();
  }

  private configureMarked(): void {
    // Configure marked with basic options
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    // Add syntax highlighting extension
    marked.use({
      renderer: {
        code(token) {
          const code = token.text;
          const lang = token.lang || 'plaintext';
          
          if (lang && hljs.getLanguage(lang)) {
            try {
              const highlightedCode = hljs.highlight(code, { language: lang }).value;
              return `<pre class="code-block"><code class="hljs language-${lang}">${highlightedCode}</code></pre>`;
            } catch (err) {
              console.warn('Syntax highlighting failed:', err);
            }
          }
          
          const highlightedCode = hljs.highlightAuto(code).value;
          return `<pre class="code-block"><code class="hljs">${highlightedCode}</code></pre>`;
        }
      }
    });
  }

  async renderMarkdown(content: string): Promise<string> {
    try {
      return await marked(content);
    } catch (error) {
      console.error('Markdown rendering failed:', error);
      return `<p class="error">Error rendering markdown content</p>`;
    }
  }

  extractExcerpt(content: string, maxLength: number = 200): string {
    // Remove markdown syntax and extract plain text
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Remove links
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // Remove images
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();

    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  generateTableOfContents(content: string): Array<{level: number, title: string, id: string}> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: Array<{level: number, title: string, id: string}> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      toc.push({ level, title, id });
    }

    return toc;
  }
}