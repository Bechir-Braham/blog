import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TerminalCommandsService {
  
  private commands: { [key: string]: () => string } = {
    about: () => `<div class="text-info">I'm Bechir Braham, a software engineer passionate about Tech and Mountains.<br>I'm always curious about new technologies and fields. Currently I'm learning more about distributed systems.<br>I have experience in DevOps, Build Systems, Software Development and Machine learning.</div>`,
    
    skills: () => `<div class="text-muted">Technical Skills:<br>├── Programming Languages: Python, C++, JavaScript, Go, Java<br>├── DevOps: CI/CD, Bazel, GitHub Actions, Docker, Kubernetes, Ansible, Terraform, Git, Linux<br>├── Cloud Computing: AWS, Azure, GCP<br>└── Machine Learning/AI: PyTorch, TensorFlow, Ray</div>`,
    
    contact: () => `<div class="text-success">Contact Information:<br>📧 Email: bechir.braham@example.com<br>💼 LinkedIn: linkedin.com/in/bechir-braham<br>🐙 GitHub: github.com/Bechir-Braham<br>🌐 Website: bechirbraham.dev<br><br>Feel free to reach out for collaborations or opportunities!</div>`,
    
    help: () => `<div class="text-info">Available commands:<br>  about       - Learn more about me<br>  skills      - View my technical skills<br>  contact     - Get in touch with me<br><br>  whoami      - Display current user info<br>  date        - Show current date and time<br>  pwd         - Print working directory<br>  ls          - List directory contents<br>  clear       - Clear the terminal<br>  help        - Show this help message<br><br>Pro tip: Use up/down arrow keys to navigate command history!</div>`,
    
    whoami: () => `<div class="text-muted">Software Engineer | Problem Solver | Tech Enthusiast</div>`,
    
    date: () => `<div class="text-muted">${new Date().toString()}</div>`,
    
    pwd: () => `<div class="text-muted">/home/bechir/portfolio</div>`,
    
    ls: () => `<div class="text-muted">total 8<br>drwxr-xr-x  4 bechir  staff   128 Nov 18 2025 .<br>drwxr-xr-x  3 bechir  staff    96 Nov 18 2025 ..<br>drwxr-xr-x  5 bechir  staff   160 Nov 18 2025 about/<br>drwxr-xr-x  3 bechir  staff    96 Nov 18 2025 projects/<br>-rw-r--r--  1 bechir  staff  1024 Nov 18 2025 resume.pdf<br>-rw-r--r--  1 bechir  staff   512 Nov 18 2025 README.md</div>`
  };

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
