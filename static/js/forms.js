/**
 * Form Handling Utilities
 * Used only by: contact.html
 * Provides form validation, submission, and error handling
 */
class FormHandler {
  constructor(form, options = {}) {
    this.form = form;
    this.options = {
      validateOnInput: true,
      showSuccessMessage: true,
      resetOnSuccess: true,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupValidation();
  }
  
  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    if (this.options.validateOnInput) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', (e) => this.validateField(e.target));
        input.addEventListener('input', (e) => this.clearFieldError(e.target));
      });
    }
  }
  
  setupValidation() {
    // Add required indicators
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const label = this.form.querySelector(`label[for="${field.id}"]`);
      if (label && !label.textContent.includes('*')) {
        label.innerHTML += ' <span class="text-error">*</span>';
      }
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const errors = [];
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
      errors.push(`${this.getFieldLabel(field)} is required`);
    }
    
    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          errors.push('Please enter a valid email address');
        }
        break;
      case 'tel':
        if (value && !this.isValidPhone(value)) {
          errors.push('Please enter a valid phone number');
        }
        break;
      case 'url':
        if (value && !this.isValidUrl(value)) {
          errors.push('Please enter a valid URL');
        }
        break;
    }
    
    // Length validation
    if (field.hasAttribute('minlength')) {
      const minLength = parseInt(field.getAttribute('minlength'));
      if (value && value.length < minLength) {
        errors.push(`${this.getFieldLabel(field)} must be at least ${minLength} characters`);
      }
    }
    
    if (field.hasAttribute('maxlength')) {
      const maxLength = parseInt(field.getAttribute('maxlength'));
      if (value.length > maxLength) {
        errors.push(`${this.getFieldLabel(field)} must be no more than ${maxLength} characters`);
      }
    }
    
    // Custom validation
    if (field.hasAttribute('data-validate')) {
      const customRule = field.getAttribute('data-validate');
      const customError = this.validateCustomRule(field, customRule);
      if (customError) {
        errors.push(customError);
      }
    }
    
    this.displayFieldErrors(field, errors);
    return errors.length === 0;
  }
  
  validateCustomRule(field, rule) {
    switch (rule) {
      case 'strong-password':
        const password = field.value;
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain a number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character';
        break;
      case 'confirm-password':
        const originalPassword = this.form.querySelector('#password');
        if (originalPassword && field.value !== originalPassword.value) {
          return 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return null;
  }
  
  validateForm() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
      const fieldValid = this.validateField(field);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!this.validateForm()) {
      this.showMessage('Please correct the errors above.', 'error');
      return;
    }
    
    // Show loading state
    const submitButton = this.form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm(data);
      
      if (this.options.showSuccessMessage) {
        this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      }
      
      if (this.options.resetOnSuccess) {
        this.form.reset();
        this.clearAllErrors();
      }
      
      // Call success callback if provided
      if (this.options.onSuccess) {
        this.options.onSuccess(data);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
      
      // Call error callback if provided
      if (this.options.onError) {
        this.options.onError(error);
      }
    } finally {
      // Restore button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
  
  async submitForm(data) {
    // Simulate API call - replace with your actual endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/error based on data
        if (data.email && data.email.includes('@')) {
          resolve({ success: true, message: 'Form submitted successfully' });
        } else {
          reject(new Error('Invalid email address'));
        }
      }, 1000);
    });
  }
  
  displayFieldErrors(field, errors) {
    this.clearFieldError(field);
    
    if (errors.length > 0) {
      field.classList.add('form__input--error');
      field.setAttribute('aria-invalid', 'true');
      
      const errorContainer = document.createElement('div');
      errorContainer.className = 'form__error';
      errorContainer.id = `${field.id}-error`;
      errorContainer.innerHTML = errors.map(error => `<div>${error}</div>`).join('');
      
      field.setAttribute('aria-describedby', errorContainer.id);
      field.parentNode.appendChild(errorContainer);
    } else {
      field.classList.remove('form__input--error');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }
  
  clearFieldError(field) {
    field.classList.remove('form__input--error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    const existingError = field.parentNode.querySelector('.form__error');
    if (existingError) {
      existingError.remove();
    }
  }
  
  clearAllErrors() {
    const errorElements = this.form.querySelectorAll('.form__error');
    errorElements.forEach(error => error.remove());
    
    const errorFields = this.form.querySelectorAll('.form__input--error');
    errorFields.forEach(field => {
      field.classList.remove('form__input--error');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });
  }
  
  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = this.form.querySelector('.form__message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form__message form__message--${type}`;
    messageElement.textContent = message;
    messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
    
    // Insert at top of form
    this.form.insertBefore(messageElement, this.form.firstChild);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 5000);
    }
  }
  
  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(' *', '') : field.name || field.id;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
  
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Auto-initialize forms with data-form-handler attribute
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('[data-form-handler]');
  forms.forEach(form => {
    new FormHandler(form);
  });
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormHandler };
}