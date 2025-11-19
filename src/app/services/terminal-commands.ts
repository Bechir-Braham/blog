import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TerminalCommandsService {
  
  constructor(private router: Router) {}
  
  private commands: { [key: string]: () => string } = {
    about: () => `<div class="text-info">I'm Bechir Braham, a software engineer passionate about Tech and Mountains.<br>I'm always curious about new technologies and fields. Currently I'm learning more about distributed systems.<br>I have experience in DevOps, Build Systems, Software Development and Machine learning.</div>`,
    
    skills: () => `<div class="text-muted">Technical Skills:<br>├── Programming Languages: Python, C++, JavaScript, Go, Java<br>├── DevOps: CI/CD, Bazel, GitHub Actions, Docker, Kubernetes, Ansible, Terraform, Git, Linux<br>├── Cloud Computing: AWS, Azure, GCP<br>└── Machine Learning/AI: PyTorch, TensorFlow, Ray</div>`,
    
    contact: () => `<div class="text-success">Contact Information:<br>📧 Email: bechir.braham@example.com<br>💼 LinkedIn: linkedin.com/in/bechir-braham<br>🐙 GitHub: github.com/Bechir-Braham<br>🌐 Website: bechirbraham.dev<br><br>Feel free to reach out for collaborations or opportunities!</div>`,
    
    help: () => `<div class="text-info">Available commands:<br>  about       - Learn more about me<br>  skills      - View my technical skills<br>  contact     - Get in touch with me<br><br>  ls          - List available pages<br>  cd [page]   - Navigate to a page (blog, resume, projects, contact)<br>  pwd         - Print working directory<br>  whoami      - Display current user info<br>  date        - Show current date and time<br>  clear       - Clear the terminal<br>  help        - Show this help message<br><br>Pro tip: Use up/down arrow keys to navigate command history!</div>`,
    
    whoami: () => `<div class="text-muted">Software Engineer | Problem Solver | Tech Enthusiast</div>`,
    
    date: () => `<div class="text-muted">${new Date().toString()}</div>`,
    
    pwd: () => `<div class="text-muted">/home/bechir/portfolio</div>`,
    
    ls: () => {
      const now = new Date();
      const month = now.toLocaleString('en', { month: 'short' });
      const day = now.getDate().toString().padStart(2, ' ');
      const time = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      return `<div class="text-muted">total 4</div><div class="text-secondary">drwxr-xr-x  5 bechir  staff  160 ${month} ${day} ${time} <span class="text-muted">blog/</span><br>drwxr-xr-x  4 bechir  staff  128 ${month} ${day} ${time} <span class="text-muted">contact/</span><br>drwxr-xr-x  6 bechir  staff  192 ${month} ${day} ${time} <span class="text-muted">projects/</span><br>drwxr-xr-x  3 bechir  staff   96 ${month} ${day} ${time} <span class="text-muted">resume/</span></div>`;
    }
  };

  handleCdCommand(destination: string): string {
    const validPages = ['blog', 'resume', 'projects', 'contact', '~', '/'];
    const page = destination.toLowerCase().replace(/\/$/, ''); // Remove trailing slash
    
    if (page === '~' || page === '/' || page === '') {
      this.router.navigate(['/']);
      return `<div class="text-success">Navigating to home...</div>`;
    }
    
    if (validPages.includes(page)) {
      this.router.navigate([`/${page}`]);
      return `<div class="text-success">Navigating to /${page}...</div>`;
    }
    
    return `<div class="text-error">cd: ${destination}: No such directory<br><span class="text-muted">Available: blog, resume, projects, contact</span></div>`;
  }

  getCommandNames(): string[] {
    return Object.keys(this.commands);
  }

  executeCommand(commandName: string): string | null {
    const cmd = commandName.toLowerCase().trim();
    const handler = this.commands[cmd];
    
    if (handler) {
      return handler();
    }
    
    return null; // Command not found
  }
}
