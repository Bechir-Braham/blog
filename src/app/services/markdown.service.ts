import { Injectable } from '@angular/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private mermaidCounter = 0;
  
  constructor() {
    this.configureMarked();
    this.initializeMermaid();
  }

  private initializeMermaid(): void {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        // Background colors
        primaryColor: '#1a1a1a',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#00d7ff',
        
        // Node colors
        secondaryColor: '#2a2a2a',
        tertiaryColor: '#3a3a3a',
        
        // Text colors
        textColor: '#ffffff',
        nodeTextColor: '#ffffff',
        labelTextColor: '#ffffff',
        
        // Line colors
        lineColor: '#00d7ff',
        edgeLabelBackground: '#1a1a1a',
        
        // Background
        background: '#000000',
        mainBkg: '#1a1a1a',
        secondBkg: '#2a2a2a',
        
        // Additional text settings
        fontFamily: 'Monaco, "Courier New", monospace',
        fontSize: '14px'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      },
      sequence: {
        useMaxWidth: true
      },
      gitGraph: {
        useMaxWidth: true
      }
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
    const mermaidElements = element.querySelectorAll('.mermaid');
    
    for (let i = 0; i < mermaidElements.length; i++) {
      const el = mermaidElements[i] as HTMLElement;
      if (el.getAttribute('data-processed') !== 'true') {
        try {
          const graphDefinition = el.textContent || '';
          const elementId = el.id || `mermaid-diagram-${Date.now()}-${i}`;
          
          // Clear any existing content
          el.innerHTML = '';
          
          // Render the diagram
          const { svg } = await mermaid.render(elementId, graphDefinition);
          
          // Insert the SVG
          el.innerHTML = svg;
          el.setAttribute('data-processed', 'true');
          
          // Force font rendering
          const svgElement = el.querySelector('svg');
          if (svgElement) {
            svgElement.style.fontFamily = 'Monaco, "Courier New", monospace';
          }
        } catch (error) {
          console.error('Mermaid rendering failed:', error);
          el.innerHTML = `<div class="error" style="color: #ff6b6b; padding: 1rem; text-align: center;">
            Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}
          </div>`;
        }
      }
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