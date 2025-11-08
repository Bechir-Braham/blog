/**
 * Terminal Application Core Module
 * Handles terminal interface functionality including command processing,
 * history management, and keyboard navigation.
 * Used only by: index.html
 */
class TerminalCore {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.currentCommand = '';
    
    this.terminalHistory = document.getElementById('terminal-history');
    this.terminalInput = document.getElementById('terminal-input');
    
    if (!this.terminalHistory || !this.terminalInput) {
      console.warn('Terminal: Required elements not found');
      return;
    }
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.displayWelcomeMessage();
  }
  
  bindEvents() {
    this.terminalInput.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  
  handleKeydown(event) {
    switch(event.key) {
      case 'Enter':
        event.preventDefault();
        this.executeCommand();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory('down');
        break;
      case 'Tab':
        event.preventDefault();
        this.handleTabCompletion();
        break;
    }
  }
  
  executeCommand() {
    const input = this.terminalInput.value.trim();
    if (!input) return;
    
    // Add to history
    this.history.push(input);
    this.historyIndex = this.history.length;
    
    // Display command
    this.addToHistory(`
      <span class="text-primary">bechir@terminal:~$</span> 
      <span class="text-secondary">${input}</span>
    `);
    
    // Process command
    this.processCommand(input);
    
    // Clear input
    this.terminalInput.value = '';
    this.scrollToBottom();
  }
  
  processCommand(input) {
    const args = input.toLowerCase().split(' ');
    const command = args[0];
    
    let output = '';
    
    // Import commands dynamically if available
    if (typeof window.Commands !== 'undefined') {
      const commandFunction = window.Commands[command];
      if (commandFunction && typeof commandFunction === 'function') {
        output = commandFunction(args);
      } else if (command) {
        output = this.getUnknownCommandMessage(command);
      }
    } else {
      // Fallback for basic commands
      switch(command) {
        case '':
          return;
        case 'clear':
          this.clearHistory();
          return;
        case 'sudo':
          output = `<div class="text-error">Nice try! This is a frontend terminal 😉</div>`;
          break;
        case 'exit':
          output = `<div class="text-error">Cannot exit browser terminal. Try closing the tab instead!</div>`;
          break;
        default:
          output = this.getUnknownCommandMessage(command);
      }
    }
    
    if (output) {
      this.addToHistory(output);
    }
  }
  
  getUnknownCommandMessage(command) {
    return `
      <div class="text-error">Command '${command}' not found.</div>
      <div class="text-muted">Type 'help' for available commands.</div>
    `;
  }
  
  navigateHistory(direction) {
    if (this.history.length === 0) return;
    
    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.terminalInput.value = this.history[this.historyIndex];
      }
    } else if (direction === 'down') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.terminalInput.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.terminalInput.value = '';
      }
    }
  }
  
  handleTabCompletion() {
    const input = this.terminalInput.value;
    const commands = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'ls'];
    
    const matches = commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    
    if (matches.length === 1) {
      this.terminalInput.value = matches[0];
    } else if (matches.length > 1) {
      this.addToHistory(`<div class="text-muted">Available: ${matches.join(', ')}</div>`);
    }
  }
  
  addToHistory(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    div.style.marginBottom = '0.5rem';
    this.terminalHistory.appendChild(div);
  }
  
  clearHistory() {
    this.terminalHistory.innerHTML = '';
    this.displayWelcomeMessage();
  }
  
  displayWelcomeMessage() {
    const welcomeMessage = `
      <div class="text-center mb-6">
        <pre class="text-primary text-xs leading-tight" aria-label="ASCII Art: Bechir">
██████  ███████  ██████ ██   ██ ██ ██████  
██   ██ ██      ██      ██   ██ ██ ██   ██ 
██████  █████   ██      ███████ ██ ██████  
██   ██ ██      ██      ██   ██ ██ ██   ██ 
██████  ███████  ██████ ██   ██ ██ ██   ██ 
        </pre>
      </div>
      <div class="text-center mb-8">
        <div class="text-primary text-lg font-semibold">Welcome to Bechir's Terminal</div>
        <div class="text-muted text-sm mt-2">Full-Stack Developer • Software Engineer • Tech Enthusiast</div>
        <div class="text-muted text-xs mt-2">Type 'help' for available commands</div>
      </div>
    `;
    this.addToHistory(welcomeMessage);
  }
  
  scrollToBottom() {
    this.terminalHistory.scrollTop = this.terminalHistory.scrollHeight;
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('terminal-history') && document.getElementById('terminal-input')) {
    new TerminalCore();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TerminalCore };
}