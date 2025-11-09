/**
 * Terminal Commands Module
 * Contains all terminal command implementations
 */
const TerminalCommands = {
  // Command implementations
  commands: {
    about() {
      return `<div class="text-info">I'm Bechir Braham, a software developer passionate about creating innovative solutions.<br>I have experience in web development, mobile apps, and enjoy exploring new technologies.<br>My goal is to write clean, efficient code that makes a difference.</div>`;
    },

    skills() {
      return `<div class="text-muted">Technical Skills:<br>├── Languages: JavaScript, Python, TypeScript, Java, C++<br>├── Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS<br>├── Backend: Node.js, Express.js, Django, Spring Boot<br>├── Databases: MongoDB, PostgreSQL, MySQL<br>├── Tools: Git, Docker, AWS, Linux<br>└── Mobile: React Native, Flutter</div>`;
    },

    projects() {
      return `<div class="text-muted">Featured Projects:<br>1. Personal Blog - This terminal interface website<br>2. Task Manager App - Full-stack productivity tool<br>3. Weather Dashboard - Real-time weather data visualization<br>4. E-commerce Platform - Modern shopping experience<br>5. API Gateway - Microservices orchestration<br><br>Type 'git clone &lt;project-name&gt;' to learn more about each project.</div>`;
    },

    blog() {
      return `<div class="text-info">Latest Blog Posts:<br>• "Building a Terminal Interface with HTML/CSS/JS" - Nov 2025<br>• "Modern Web Development Best Practices" - Oct 2025<br>• "Understanding Async Programming" - Sep 2025<br><br>Visit /blog for full articles and archive.</div>`;
    },

    contact() {
      return `<div class="text-success">Contact Information:<br>📧 Email: bechir.braham@example.com<br>💼 LinkedIn: linkedin.com/in/bechir-braham<br>🐙 GitHub: github.com/Bechir-Braham<br>🌐 Website: bechirbraham.dev<br><br>Feel free to reach out for collaborations or opportunities!</div>`;
    },

    social() {
      return `<div class="text-info">Find me on:<br>• GitHub: @Bechir-Braham<br>• LinkedIn: Bechir Braham<br>• Twitter: @bechirbraham<br>• Dev.to: @bechirbraham</div>`;
    },

    help() {
      return `<div class="text-info">Available commands:<br>  about       - Learn more about me<br>  skills      - View my technical skills<br>  projects    - Browse my projects<br>  blog        - Read my latest blog posts<br>  contact     - Get in touch with me<br>  social      - Find me on social media<br>  clear       - Clear the terminal<br>  help        - Show this help message<br><br>Pro tip: Use ↑/↓ arrow keys to navigate command history!</div>`;
    },

    whoami() {
      return `<div class="text-muted">Software Developer | Problem Solver | Tech Enthusiast</div>`;
    },

    date() {
      return `<div class="text-muted">${new Date().toString()}</div>`;
    },

    pwd() {
      return `<div class="text-muted">/home/bechir/portfolio</div>`;
    },

    ls() {
      return `<div class="text-muted">total 8<br>drwxr-xr-x  4 bechir  staff   128 Nov  8 2025 .<br>drwxr-xr-x  3 bechir  staff    96 Nov  8 2025 ..<br>drwxr-xr-x  5 bechir  staff   160 Nov  8 2025 about/<br>drwxr-xr-x  3 bechir  staff    96 Nov  8 2025 projects/<br>-rw-r--r--  1 bechir  staff  1024 Nov  8 2025 resume.pdf<br>-rw-r--r--  1 bechir  staff   512 Nov  8 2025 README.md</div>`;
    },

    clear(terminal) {
      if (terminal && typeof terminal.clearHistory === 'function') {
        terminal.clearHistory();
      }
      return null; // Don't add output for clear command
    }
  },

  // Get all available command names
  getCommandNames() {
    return Object.keys(this.commands);
  },

  // Execute a command
  execute(commandName, args, terminal) {
    const cmd = commandName.toLowerCase();
    const handler = this.commands[cmd];
    
    if (handler) {
      // For commands that need terminal reference (like clear), pass it as first parameter
      if (cmd === 'clear') {
        return handler(terminal);
      }
      // For other commands, just execute them
      return handler();
    }
    
    return null; // Command not found
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TerminalCommands;
}