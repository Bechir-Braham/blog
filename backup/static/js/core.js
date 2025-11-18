/**
 * Shared Utilities - Core Module
 * Used by: All pages
 * Contains utility functions and helpers used across multiple pages
 */

// Utility functions
const Utils = {
  // DOM manipulation helpers
  createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },

  // Animation helpers
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  },

  fadeOut(element, duration = 300, callback) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    setTimeout(() => {
      if (callback) callback();
    }, duration);
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementTop = element.offsetTop - offset;
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  },

  // Copy text to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  // Format date
  formatDate(date, options = {}) {
    const defaults = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaults, ...options });
  },

  // Truncate text
  truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  // Generate random ID
  generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Local storage helpers
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.warn('Failed to read from localStorage:', err);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn('Failed to remove from localStorage:', err);
        return false;
      }
    },

    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (err) {
        console.warn('Failed to clear localStorage:', err);
        return false;
      }
    }
  }
};

// Theme management
const ThemeManager = {
  getCurrentTheme() {
    return Utils.storage.get('theme', 'dark');
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Utils.storage.set('theme', theme);
    this.updateThemeToggle();
  },

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  },

  updateThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    const currentTheme = this.getCurrentTheme();
    
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`);
      toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    });
  },

  init() {
    // Set initial theme
    const savedTheme = this.getCurrentTheme();
    this.setTheme(savedTheme);

    // Bind theme toggle buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-theme-toggle]')) {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
};

// Navigation helpers
const Navigation = {
  // Add active class to current page nav link
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .nav a');
    
    navLinks.forEach(link => {
      link.classList.remove('active', 'current');
      if (link.getAttribute('href') === currentPath.split('/').pop()) {
        link.classList.add('active', 'current');
        link.setAttribute('aria-current', 'page');
      }
    });
  },

  // Smooth scroll for anchor links
  initSmoothScroll() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          Utils.scrollToElement(targetElement, 80);
        }
      }
    });
  }
};

// Performance monitoring
const Performance = {
  // Simple performance tracking
  measurePerformance() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
      });
    }
  },

  // Lazy loading for images
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
    }
  }
};

// Accessibility helpers
const A11y = {
  // Skip link functionality
  initSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },

  // Keyboard navigation for custom elements
  initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        const activeDropdown = document.querySelector('.dropdown.open');
        
        if (activeModal) {
          activeModal.classList.remove('active');
        }
        if (activeDropdown) {
          activeDropdown.classList.remove('open');
        }
      }
    });
  },

  // Announce dynamic content changes to screen readers
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

// Initialize core functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize core features
  Navigation.highlightCurrentPage();
  Navigation.initSmoothScroll();
  ThemeManager.init();
  A11y.initSkipLinks();
  A11y.initKeyboardNav();
  Performance.initLazyLoading();
  Performance.measurePerformance();

  // Add global event listeners
  
  // Back button functionality
  document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-back, [data-back]')) {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    }
  });

  // Copy functionality
  document.addEventListener('click', async (e) => {
    if (e.target.matches('[data-copy]')) {
      e.preventDefault();
      const textToCopy = e.target.dataset.copy || e.target.textContent;
      const success = await Utils.copyToClipboard(textToCopy);
      
      if (success) {
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied!';
        setTimeout(() => {
          e.target.textContent = originalText;
        }, 1000);
        A11y.announceToScreenReader('Copied to clipboard');
      }
    }
  });

  // External link handling
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    if (!link.hostname === window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Add visual indicator
      if (!link.querySelector('.external-icon')) {
        const icon = Utils.createElement('span', 'external-icon', '↗');
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
      }
    }
  });
});

// Export utilities for external use
if (typeof window !== 'undefined') {
  window.Utils = Utils;
  window.ThemeManager = ThemeManager;
  window.Navigation = Navigation;
  window.Performance = Performance;
  window.A11y = A11y;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Utils,
    ThemeManager,
    Navigation,
    Performance,
    A11y
  };
}