/**
 * Terminal Application Core Module
 * Handles terminal interface functionality including command processing,
 * history management, and keyboard navigation.
 * Used only by: index.html
 */
class TerminalCore {
  constructor(config = {}) {
    this.history = [];
    this.historyIndex = -1;
    this.currentCommand = '';
    
    // Use config if provided, otherwise fallback to DOM query
    this.terminalHistory = config.commandHistoryElement || document.getElementById('commandHistory');
    this.terminalInput = config.userInputElement || document.getElementById('userInput');
    this.availableCommands = config.availableCommands || [];
    this.commands = new Map();
    
    if (!this.terminalHistory || !this.terminalInput) {
      console.warn('Terminal: Required elements not found');
      console.warn('History element:', this.terminalHistory);
      console.warn('Input element:', this.terminalInput);
      return;
    }
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.displayWelcomeMessage();
    // Focus the input field
    this.terminalInput.focus();
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
  
  registerCommand(name, handler) {
    this.commands.set(name.toLowerCase(), handler);
  }
  
  processCommand(input) {
    const args = input.toLowerCase().split(' ');
    const command = args[0];
    
    let output = '';
    
    // Check registered commands first
    if (this.commands.has(command)) {
      const handler = this.commands.get(command);
      output = handler(input);
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
    const availableCommands = [...this.commands.keys(), 'help', 'clear', 'ls'];
    
    const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    
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
    // No welcome message - clean terminal start
  }
  
  scrollToBottom() {
    this.terminalHistory.scrollTop = this.terminalHistory.scrollHeight;
  }
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TerminalCore };
}