/**
 * Terminal Application Core Module
 * Handles terminal interface functionality including command processing,
 * history management, and keyboard interactions
 */
class TerminalCore {
  constructor(options = {}) {
    this.userInput = options.userInputElement;
    this.commandHistory = options.commandHistoryElement;
    this.commands = [];
    this.commandIndex = -1;
    this.availableCommands = options.availableCommands || [];
    this.commandHandlers = new Map();
    
    this.init();
  }

  init() {
    if (!this.userInput || !this.commandHistory) {
      console.warn('Terminal: Required elements not found');
      return;
    }

    this.setupEventListeners();
    this.focusInput();
  }

  setupEventListeners() {
    // Focus management
    window.addEventListener('load', () => this.focusInput());
    document.addEventListener('click', () => this.focusInput());

    // Keyboard handling
    this.userInput.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.processCommand();
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
        this.autoComplete();
        break;
    }
  }

  processCommand() {
    const command = this.userInput.value.trim();
    if (!command) return;

    this.addCommandToHistory(command);
    this.executeCommand(command);
    this.clearInput();
    this.updateCommandIndex();
  }

  addCommandToHistory(command) {
    const commandLine = this.createElement('div', 'line', `
      <span class="text-primary">bechir@terminal:~$</span> 
      <span class="text-secondary">${this.escapeHtml(command)}</span>
    `);
    this.commandHistory.appendChild(commandLine);
    this.scrollToBottom();
  }

  executeCommand(command) {
    const cmd = command.toLowerCase();
    const handler = this.commandHandlers.get(cmd);
    
    if (handler) {
      const output = handler(command);
      if (output) {
        this.addOutputToHistory(output);
      }
    } else {
      this.handleUnknownCommand(command);
    }
  }

  addOutputToHistory(output) {
    const outputDiv = this.createElement('div');
    outputDiv.innerHTML = output;
    this.commandHistory.appendChild(outputDiv);
    this.scrollToBottom();
  }

  handleUnknownCommand(command) {
    let output = '';
    const cmd = command.toLowerCase();
    
    if (cmd.startsWith('git clone')) {
      const projectName = command.split(' ')[2] || 'project';
      output = `<div class="text-error">Project '${this.escapeHtml(projectName)}' repository details will be available soon!</div>`;
    } else if (cmd.includes('sudo')) {
      output = `<div class="text-error">Nice try! This is a frontend terminal 😉</div>`;
    } else {
      output = `<div class="text-error">Command not found: ${this.escapeHtml(command)}. Type 'help' for available commands.</div>`;
    }
    
    this.addOutputToHistory(output);
  }

  navigateHistory(direction) {
    if (direction === 'up' && this.commandIndex > 0) {
      this.commandIndex--;
      this.userInput.value = this.commands[this.commandIndex] || '';
    } else if (direction === 'down') {
      if (this.commandIndex < this.commands.length - 1) {
        this.commandIndex++;
        this.userInput.value = this.commands[this.commandIndex] || '';
      } else {
        this.commandIndex = this.commands.length;
        this.userInput.value = '';
      }
    }
  }

  autoComplete() {
    const currentValue = this.userInput.value;
    const matches = this.availableCommands.filter(cmd => 
      cmd.startsWith(currentValue.toLowerCase())
    );

    if (matches.length === 1) {
      this.userInput.value = matches[0];
    } else if (matches.length > 1) {
      this.showCompletionOptions(currentValue, matches);
    }
  }

  showCompletionOptions(currentValue, matches) {
    this.addCommandToHistory(currentValue);
    this.addOutputToHistory(`<div class="text-muted">${matches.join('  ')}</div>`);
  }

  registerCommand(name, handler) {
    this.commandHandlers.set(name.toLowerCase(), handler);
  }

  clearInput() {
    this.userInput.value = '';
  }

  updateCommandIndex() {
    this.commands.push(this.userInput.value.trim());
    this.commandIndex = this.commands.length;
  }

  focusInput() {
    if (this.userInput) {
      this.userInput.focus();
    }
  }

  scrollToBottom() {
    this.commandHistory.scrollTop = this.commandHistory.scrollHeight;
  }

  clear() {
    this.commandHistory.innerHTML = '';
  }

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * Filter Manager
 * Handles filtering functionality for blog posts, projects, etc.
 */
class FilterManager {
  constructor(options = {}) {
    this.items = options.items || [];
    this.filterButtons = options.filterButtons || [];
    this.searchInput = options.searchInput;
    this.noResultsElement = options.noResultsElement;
    this.activeFilter = 'all';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const category = button.dataset.category || button.textContent.toLowerCase();
        this.filterByCategory(category, button);
      });
    });

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.filterBySearch();
      });
    }
  }

  filterByCategory(category, activeButton) {
    this.activeFilter = category;
    this.updateActiveButton(activeButton);
    
    let visibleCount = 0;
    
    this.items.forEach(item => {
      const itemCategories = item.dataset.category || '';
      const shouldShow = category === 'all' || itemCategories.includes(category);
      
      this.toggleItemVisibility(item, shouldShow);
      if (shouldShow) visibleCount++;
    });
    
    this.updateNoResults(visibleCount === 0);
  }

  filterBySearch() {
    const searchTerm = this.searchInput.value.toLowerCase();
    let visibleCount = 0;
    
    this.items.forEach(item => {
      const searchableText = this.getSearchableText(item);
      const matches = searchableText.includes(searchTerm);
      
      this.toggleItemVisibility(item, matches);
      if (matches) visibleCount++;
    });
    
    this.updateNoResults(visibleCount === 0);
    
    // Reset filter buttons if searching
    if (searchTerm) {
      this.filterButtons.forEach(btn => btn.classList.remove('active'));
    }
  }

  getSearchableText(item) {
    const title = item.querySelector('.card__title')?.textContent || '';
    const content = item.querySelector('.card__content')?.textContent || '';
    const tags = Array.from(item.querySelectorAll('.tag'))
      .map(tag => tag.textContent)
      .join(' ');
    
    return `${title} ${content} ${tags}`.toLowerCase();
  }

  toggleItemVisibility(item, show) {
    item.style.display = show ? 'block' : 'none';
  }

  updateActiveButton(activeButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  updateNoResults(show) {
    if (this.noResultsElement) {
      this.noResultsElement.style.display = show ? 'block' : 'none';
    }
  }
}

/**
 * Form Handler
 * Manages form submissions and validation
 */
class FormHandler {
  constructor(form, options = {}) {
    this.form = form;
    this.onSubmit = options.onSubmit || this.defaultSubmitHandler;
    this.validator = options.validator || this.defaultValidator;
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    if (this.validator(data)) {
      this.onSubmit(data);
    }
  }

  defaultValidator(data) {
    return Object.values(data).every(value => value.trim() !== '');
  }

  defaultSubmitHandler(data) {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! (This is a demo)');
  }
}

/**
 * Theme Manager
 * Handles theme switching and preferences
 */
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.storeTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  storeTheme(theme) {
    localStorage.setItem('theme', theme);
  }
}

/**
 * Utility Functions
 */
const Utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format date
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  },

  // Scroll to element
  scrollTo(element, options = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options
      });
    }
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  },

  // Local storage helpers
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.error('Error reading from localStorage:', err);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error('Error writing to localStorage:', err);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.error('Error removing from localStorage:', err);
        return false;
      }
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TerminalCore,
    FilterManager,
    FormHandler,
    ThemeManager,
    Utils
  };
}