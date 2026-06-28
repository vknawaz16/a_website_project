/**
 * SERENITY WELLNESS SPA - MAIN SCRIPT
 * Modern vanilla JS with zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM References ──
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const faqItems = document.querySelectorAll('.faq-item');
  const contactForm = document.getElementById('contactForm');
  const currentYearEl = document.getElementById('currentYear');
  const revealElements = document.querySelectorAll('.service-card, .why-us-card, .testimonial-card, .faq-item, .about-content, .about-media, .contact-info, .contact-form-wrapper');

  // ── 1. Header Scroll Effect ──
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on load

  // ── 2. Mobile Navigation ──
  function openNav() {
    navToggle.classList.add('is-active');
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close nav when clicking outside (on the overlay)
  navMenu.addEventListener('click', (e) => {
    if (e.target === navMenu && window.innerWidth <= 768) {
      closeNav();
    }
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        closeNav();
        const target = document.querySelector(href);
        if (target) {
          const offset = header.offsetHeight + 20;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeNav();
    }
  });

  // Close nav on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
      closeNav();
    }
  });

  // ── 3. Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ── 4. FAQ Accordion ──
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others (accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current
      item.classList.toggle('is-open');
      question.setAttribute('aria-expanded', !isOpen);
      answer.setAttribute('aria-hidden', isOpen);
    });
  });

  // ── 5. Contact Form Validation ──
  const validators = {
    firstName: (value) => {
      if (!value.trim()) return 'First name is required';
      if (value.trim().length < 2) return 'First name must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Please enter a valid name';
      return '';
    },
    lastName: (value) => {
      if (!value.trim()) return 'Last name is required';
      if (value.trim().length < 2) return 'Last name must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Please enter a valid name';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email address is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
      return '';
    },
    phone: (value) => {
      if (!value.trim()) return 'Phone number is required';
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) return 'Phone number must have at least 10 digits';
      return '';
    },
    service: (value) => {
      if (!value) return 'Please select a service';
      return '';
    },
    consent: (value) => {
      if (!value) return 'Please agree to receive communications';
      return '';
    }
  };

  function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) {
      input.classList.add('is-invalid');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  }

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) {
      input.classList.remove('is-invalid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }

  function clearAllErrors() {
    Object.keys(validators).forEach(fieldId => clearFieldError(fieldId));
  }

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return '';
    const value = input.type === 'checkbox' ? input.checked : input.value;
    const error = validators[fieldId](value);
    if (error) {
      showFieldError(fieldId, error);
    } else {
      clearFieldError(fieldId);
    }
    return error;
  }

  // Real-time validation on blur
  Object.keys(validators).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(fieldId);
        }
      });
    }
  });

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    let hasErrors = false;
    Object.keys(validators).forEach(fieldId => {
      const error = validateField(fieldId);
      if (error) hasErrors = true;
    });

    const statusEl = document.getElementById('formStatus');

    if (hasErrors) {
      statusEl.className = 'form-status form-status--error is-visible';
      statusEl.textContent = 'Please correct the errors above before submitting.';
      // Focus first invalid field
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      statusEl.className = 'form-status form-status--success is-visible';
      statusEl.textContent = 'Thank you! Your booking request has been received. We will contact you within 24 hours to confirm your appointment.';
      contactForm.reset();
      clearAllErrors();

    } catch {
      statusEl.className = 'form-status form-status--error is-visible';
      statusEl.textContent = 'Something went wrong. Please try again or call us directly at (503) 555-0192.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // ── 6. Scroll Reveal Animation ──
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation slightly
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Add reveal class and observe
  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ── 7. Dynamic Year in Footer ──
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ── 8. Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;
    let activeSection = null;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      const href = link.getAttribute('href');
      if (activeSection && href === `#${activeSection}`) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();

  // ── 9. Hero Stat Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const numMatch = text.match(/[\d,]+/);
          if (numMatch) {
            const targetNum = parseInt(numMatch[0].replace(/,/g, ''), 10);
            const suffix = text.replace(/[\d,]+/, '');
            animateCounter(el, 0, targetNum, 1500, suffix);
          }
          statsObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => statsObserver.observe(el));

  function animateCounter(el, start, end, duration, suffix) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ── 10. Input Formatting ──
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }
      e.target.value = value;
    });
  }

  // ── 11. Console Welcome ──
  console.log(
    '%c Serenity Wellness Spa ',
    'background: #2d8b6f; color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;'
  );
  console.log('Welcome to our website. Have a serene day!');
});
