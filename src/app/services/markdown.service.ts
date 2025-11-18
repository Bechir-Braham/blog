import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { isPlatformBrowser } from '@angular/common';
import mermaid from 'mermaid';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private mermaidCounter = 0;
  private mermaidInitialized = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.configureMarked();
    // Only initialize Mermaid in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMermaid();
    }
  }

  private initializeMermaid(): void {
    if (!isPlatformBrowser(this.platformId) || this.mermaidInitialized) {
      return;
    }

    // Dynamic import to avoid SSR issues
    import('mermaid').then((mermaidModule) => {
      mermaidModule.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#00ff00',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#74c0fc',
          lineColor: '#74c0fc',
          secondaryColor: '#1a1a1a',
          tertiaryColor: '#0a0a0a'
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true
        },
        gitGraph: {
          useMaxWidth: true
        }
      });
      this.mermaidInitialized = true;
      console.log('Mermaid initialized successfully');
    }).catch(error => {
      console.error('Failed to load Mermaid:', error);
    });
  }

  private configureMarked(): void {
    // Configure marked with basic options
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    // Add syntax highlighting extension
    const self = this;
    marked.use({
      renderer: {
        code(token) {
          const code = token.text;
          const lang = token.lang || 'plaintext';
          
          // Handle Mermaid diagrams
          if (lang === 'mermaid') {
            const id = `mermaid-${self.mermaidCounter++}`;
            return `<div class="mermaid-container">
                      <div id="${id}" class="mermaid">${code}</div>
                    </div>`;
          }
          
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
      const html = await marked(content);
      // Reset counter for each new render
      this.mermaidCounter = 0;
      return html;
    } catch (error) {
      console.error('Markdown rendering failed:', error);
      return `<p class="error">Error rendering markdown content</p>`;
    }
  }

  async renderMermaidDiagrams(element: HTMLElement): Promise<void> {
    // Only render on browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('Starting Mermaid diagram rendering...');

    try {
      // Ensure Mermaid is loaded and initialized
      if (!this.mermaidInitialized) {
        console.log('Waiting for Mermaid initialization...');
        await this.initializeMermaid();
        await new Promise(resolve => {
          const checkInitialized = () => {
            if (this.mermaidInitialized) {
              console.log('Mermaid initialization complete');
              resolve(void 0);
            } else {
              setTimeout(checkInitialized, 50);
            }
          };
          checkInitialized();
        });
      }

      const mermaidModule = await import('mermaid');
      const mermaidElements = element.querySelectorAll('.mermaid');
      
      console.log(`Found ${mermaidElements.length} Mermaid diagrams to render`);

      for (let i = 0; i < mermaidElements.length; i++) {
        const el = mermaidElements[i] as HTMLElement;
        if (el.getAttribute('data-processed') !== 'true') {
          try {
            const graphDefinition = el.textContent?.trim() || '';
            const elementId = el.id || `mermaid-diagram-${Date.now()}-${i}`;
            
            console.log(`Rendering diagram ${i + 1}:`, graphDefinition.substring(0, 50) + '...');
            
            // Clear any existing content and show loading
            el.innerHTML = '<div style="color: #74c0fc; text-align: center; padding: 1rem;">Rendering diagram...</div>';
            
            // Add a small delay to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Render the diagram
            const { svg } = await mermaidModule.default.render(elementId + '-svg', graphDefinition);
            
            // Insert the SVG
            el.innerHTML = svg;
            el.setAttribute('data-processed', 'true');
            
            console.log(`Successfully rendered diagram ${i + 1}`);
          } catch (error) {
            console.error(`Mermaid rendering failed for diagram ${i + 1}:`, error);
            el.innerHTML = `<div class="error" style="color: #ff6b6b; padding: 1rem; text-align: center; border: 1px solid #ff6b6b; border-radius: 4px; background: rgba(255, 107, 107, 0.1);">
              <strong>Diagram Rendering Error</strong><br>
              ${error instanceof Error ? error.message : 'Unknown error'}
              <details style="margin-top: 0.5rem;">
                <summary style="cursor: pointer;">Show diagram code</summary>
                <pre style="text-align: left; margin-top: 0.5rem; padding: 0.5rem; background: #0a0a0a; border-radius: 4px; overflow-x: auto;">${el.textContent}</pre>
              </details>
            </div>`;
          }
        }
      }
      
      console.log('Mermaid diagram rendering complete');
    } catch (error) {
      console.error('Failed to render Mermaid diagrams:', error);
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