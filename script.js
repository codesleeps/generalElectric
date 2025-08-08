/* jshint esversion: 8 */
// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Close mobile menu when clicking on links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar background change on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Form handling
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const formObject = {};

  // Convert FormData to object
  for (let [key, value] of formData.entries()) {
    if (formObject[key]) {
      // Handle multiple values (like checkboxes)
      if (Array.isArray(formObject[key])) {
        formObject[key].push(value);
      } else {
        formObject[key] = [formObject[key], value];
      }
    } else {
      formObject[key] = value;
    }
  }

  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.classList.add("loading");
  submitBtn.innerHTML = "<span>Sending...</span>";

  try {
    // Simulate form submission (replace with actual endpoint)
    await simulateFormSubmission(formObject);

    // Show success message
    showSuccessMessage();

    // Reset form
    this.reset();
  } catch (error) {
    console.error("Form submission error:", error);
    showErrorMessage();
  } finally {
    // Remove loading state
    submitBtn.classList.remove("loading");
    submitBtn.innerHTML = originalText;
  }
});

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    // Log form data for demonstration
    console.log("Form submitted with data:", data);

    // Simulate network delay
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.1) {
        resolve(data);
      } else {
        reject(new Error("Submission failed"));
      }
    }, 2000);
  });
}

// Show success message
function showSuccessMessage() {
  // Remove any existing messages
  const existingMessage = document.querySelector(".form-success");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create success message
  const successMessage = document.createElement("div");
  successMessage.className = "form-success show";
  successMessage.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
        </svg>
        <span>Thank you! Your message has been sent successfully. We'll contact you within 2 hours.</span>
    `;

  // Insert before form
  const form = document.getElementById("contact-form");
  form.parentNode.insertBefore(successMessage, form);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => successMessage.remove(), 300);
  }, 5000);

  // Scroll to success message
  successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Show error message
function showErrorMessage() {
  // Remove any existing messages
  const existingMessage = document.querySelector(".form-error");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "form-error show";
  errorMessage.style.cssText = `
        background: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
  errorMessage.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>Sorry, there was an error sending your message. Please try again or call us directly.</span>
    `;

  // Insert before form
  const form = document.getElementById("contact-form");
  form.parentNode.insertBefore(errorMessage, form);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);

  // Scroll to error message
  errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Form validation enhancements
function setupFormValidation() {
  const form = document.getElementById("contact-form");
  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearFieldError);
  });
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();

  // Remove existing error styling
  clearFieldError({ target: field });

  if (!value) {
    showFieldError(field, "This field is required");
    return false;
  }

  // Email validation
  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }
  }

  // Phone validation
  if (field.type === "tel") {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      showFieldError(field, "Please enter a valid phone number");
      return false;
    }
  }

  return true;
}

function showFieldError(field, message) {
  field.style.borderColor = "#ef4444";

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.style.cssText =
    "color: #ef4444; font-size: 0.875rem; margin-top: 4px;";
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
  const field = e.target;
  field.style.borderColor = "#e5e7eb";

  const errorDiv = field.parentNode.querySelector(".field-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe service cards
  document.querySelectorAll(".service-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe stat items
  document.querySelectorAll(".stat-item").forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = `opacity 0.5s ease ${
      index * 0.2
    }s, transform 0.5s ease ${index * 0.2}s`;
    observer.observe(item);
  });
}

// Counter animation for stats
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.textContent.replace(/\D/g, ""));
          const suffix = counter.textContent.replace(/\d/g, "");

          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + suffix;
          }, 40);

          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setupFormValidation();
  setupScrollAnimations();
  animateCounters();

  // Add smooth reveal animation to hero content
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(30px)";

    setTimeout(() => {
      heroContent.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 200);
  }
});

// Handle service selection from hero buttons
document.addEventListener("click", function (e) {
  if (e.target.closest('a[href="#contact"]')) {
    setTimeout(() => {
      const serviceSelect = document.getElementById("service");
      if (serviceSelect) {
        serviceSelect.focus();
      }
    }, 1000);
  }
});

// Auto-update copyright year
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector(".footer-bottom p");
if (copyrightElement) {
  copyrightElement.textContent = copyrightElement.textContent.replace(
    "2025",
    currentYear
  );
}
