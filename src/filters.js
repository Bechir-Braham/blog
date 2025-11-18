/**
 * Filtering and Search Utilities
 * Used by: blog.html, projects.html
 * Provides content filtering, searching, and category management
 */
class FilterManager {
  constructor(options = {}) {
    this.items = options.items || [];
    this.filterButtons = options.filterButtons || [];
    this.searchInput = options.searchInput || null;
    this.noResultsElement = options.noResultsElement || null;
    this.activeCategory = 'all';
    this.searchTerm = '';
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateCounts();
  }
  
  bindEvents() {
    // Category filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const category = button.dataset.category;
        this.filterByCategory(category, button);
      });
    });
    
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.searchTerm = this.searchInput.value.toLowerCase().trim();
        this.applyFilters();
      });
      
      // Add search clear functionality
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearSearch();
        }
      });
    }
  }
  
  filterByCategory(category, activeButton) {
    this.activeCategory = category;
    this.updateActiveButton(activeButton);
    this.applyFilters();
    this.updateCounts();
  }
  
  filterBySearch() {
    this.applyFilters();
  }
  
  applyFilters() {
    let visibleCount = 0;
    
    this.items.forEach(item => {
      const matchesCategory = this.matchesCategory(item);
      const matchesSearch = this.matchesSearch(item);
      const shouldShow = matchesCategory && matchesSearch;
      
      if (shouldShow) {
        this.showItem(item);
        visibleCount++;
      } else {
        this.hideItem(item);
      }
    });
    
    this.updateNoResultsDisplay(visibleCount);
  }
  
  matchesCategory(item) {
    if (this.activeCategory === 'all') return true;
    
    const itemCategories = (item.dataset.category || '').toLowerCase();
    return itemCategories.includes(this.activeCategory.toLowerCase());
  }
  
  matchesSearch(item) {
    if (!this.searchTerm) return true;
    
    // Search in multiple fields
    const searchableText = [
      item.textContent || '',
      item.dataset.title || '',
      item.dataset.description || '',
      item.dataset.tags || '',
      item.dataset.author || ''
    ].join(' ').toLowerCase();
    
    // Split search term to allow multiple word search
    const searchWords = this.searchTerm.split(/\s+/).filter(word => word.length > 0);
    
    // All words must be found
    return searchWords.every(word => searchableText.includes(word));
  }
  
  showItem(item) {
    item.style.display = '';
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
    item.setAttribute('aria-hidden', 'false');
  }
  
  hideItem(item) {
    item.style.display = 'none';
    item.setAttribute('aria-hidden', 'true');
  }
  
  updateActiveButton(activeButton) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-pressed', 'true');
  }
  
  updateNoResultsDisplay(visibleCount) {
    if (this.noResultsElement) {
      if (visibleCount === 0) {
        this.noResultsElement.classList.remove('hidden');
        this.noResultsElement.setAttribute('aria-hidden', 'false');
        
        // Update message based on active filters
        const messages = [];
        if (this.activeCategory !== 'all') {
          messages.push(`category "${this.activeCategory}"`);
        }
        if (this.searchTerm) {
          messages.push(`search "${this.searchTerm}"`);
        }
        
        const filterText = messages.length > 0 ? ` matching ${messages.join(' and ')}` : '';
        this.noResultsElement.innerHTML = `
          <p>No items found${filterText}.</p>
          ${this.getFilterSuggestions()}
        `;
      } else {
        this.noResultsElement.classList.add('hidden');
        this.noResultsElement.setAttribute('aria-hidden', 'true');
      }
    }
  }
  
  getFilterSuggestions() {
    const suggestions = [];
    
    if (this.searchTerm) {
      suggestions.push('<button class="btn btn--secondary btn--small" onclick="filterManager.clearSearch()">Clear search</button>');
    }
    
    if (this.activeCategory !== 'all') {
      suggestions.push('<button class="btn btn--secondary btn--small" onclick="filterManager.showAll()">Show all categories</button>');
    }
    
    return suggestions.length > 0 ? `<div class="mt-4">${suggestions.join(' ')}</div>` : '';
  }
  
  updateCounts() {
    // Update button counts if they have count elements
    this.filterButtons.forEach(button => {
      const category = button.dataset.category;
      const countElement = button.querySelector('.filter-count');
      
      if (countElement) {
        let count;
        if (category === 'all') {
          count = this.items.length;
        } else {
          count = Array.from(this.items).filter(item => 
            this.matchesCategory({ dataset: { category } })
          ).length;
        }
        countElement.textContent = count;
      }
    });
  }
  
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchTerm = '';
      this.applyFilters();
    }
  }
  
  showAll() {
    this.activeCategory = 'all';
    this.clearSearch();
    
    // Update active button
    const allButton = Array.from(this.filterButtons).find(btn => btn.dataset.category === 'all');
    if (allButton) {
      this.updateActiveButton(allButton);
    }
    
    this.applyFilters();
  }
  
  reset() {
    this.showAll();
  }
  
  // Utility method to add items dynamically
  addItems(newItems) {
    this.items = [...this.items, ...newItems];
    this.updateCounts();
  }
  
  // Utility method to remove items
  removeItems(itemsToRemove) {
    this.items = this.items.filter(item => !itemsToRemove.includes(item));
    this.updateCounts();
  }
  
  // Get current filter state
  getState() {
    return {
      activeCategory: this.activeCategory,
      searchTerm: this.searchTerm,
      visibleItems: Array.from(this.items).filter(item => {
        const matchesCategory = this.matchesCategory(item);
        const matchesSearch = this.matchesSearch(item);
        return matchesCategory && matchesSearch;
      })
    };
  }
  
  // Set filter state
  setState(state) {
    if (state.activeCategory) {
      this.activeCategory = state.activeCategory;
      const activeButton = Array.from(this.filterButtons).find(btn => 
        btn.dataset.category === state.activeCategory
      );
      if (activeButton) {
        this.updateActiveButton(activeButton);
      }
    }
    
    if (state.searchTerm !== undefined) {
      this.searchTerm = state.searchTerm;
      if (this.searchInput) {
        this.searchInput.value = state.searchTerm;
      }
    }
    
    this.applyFilters();
  }
}

// Debounce utility for search optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Auto-initialize FilterManager on elements with data-filter-manager attribute
document.addEventListener('DOMContentLoaded', function() {
  const filterContainers = document.querySelectorAll('[data-filter-manager]');
  filterContainers.forEach(container => {
    const items = container.querySelectorAll('[data-category]');
    const filterButtons = container.querySelectorAll('[data-category-filter]');
    const searchInput = container.querySelector('[data-search]');
    const noResultsElement = container.querySelector('[data-no-results]');
    
    if (items.length > 0 || filterButtons.length > 0) {
      new FilterManager({
        items,
        filterButtons,
        searchInput,
        noResultsElement
      });
    }
  });
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FilterManager, debounce };
}