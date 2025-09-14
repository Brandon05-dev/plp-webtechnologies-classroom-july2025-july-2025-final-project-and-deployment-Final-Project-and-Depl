// main.js - Brantech Solutions
// Enhanced interactive features for modern website experience

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initTypingEffect();
    initStatsCounter();
    initFormValidation();
    initSmoothScroll();
    initBackToTop();
    initHeaderScroll();
    
    // Navigation functionality
    function initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function () {
                navLinks.classList.toggle('open');
                hamburger.classList.toggle('active');
                
                // Update ARIA attributes for accessibility
                const isOpen = navLinks.classList.contains('open');
                hamburger.setAttribute('aria-expanded', isOpen);
            });

            // Close menu when clicking on a link
            const navLinkItems = navLinks.querySelectorAll('a');
            navLinkItems.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Scroll animations using intersection observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attributes
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // Add animation delay based on data-aos-delay
        animatedElements.forEach(el => {
            const delay = el.getAttribute('data-aos-delay');
            if (delay) {
                el.style.transitionDelay = delay + 'ms';
            }
        });
    }

    // Typing effect for hero text
    function initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        const words = ['Innovation', 'Technology', 'Solutions', 'Growth'];
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let typeSpeed = isDeleting ? 100 : 150;

            if (!isDeleting && currentCharIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // Animated counter for stats
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const countUp = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const increment = target / 50;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + (target === 24 ? '/7' : '+');
            }, 50);
        };

        // Trigger animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => countUp(stat));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // Enhanced form validation
    function initFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const formFields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('nameError'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your name.';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your email.';
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
                    return '';
                }
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: (value) => {
                    if (!value.trim()) return 'Please enter your message.';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
                    return '';
                }
            }
        };

        // Real-time validation
        Object.values(formFields).forEach(field => {
            if (field.element) {
                field.element.addEventListener('blur', () => validateField(field));
                field.element.addEventListener('input', () => {
                    if (field.error.textContent) {
                        validateField(field);
                    }
                });
            }
        });

        function validateField(field) {
            const error = field.validate(field.element.value);
            field.error.textContent = error;
            field.element.classList.toggle('error', !!error);
            return !error;
        }

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            let isValid = true;
            Object.values(formFields).forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    showFormSuccess();
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Clear any error messages
                    Object.values(formFields).forEach(field => {
                        field.error.textContent = '';
                        field.element.classList.remove('error');
                    });
                }, 2000);
            }
        });

        function showFormSuccess() {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div style="background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; text-align: center;">
                    <i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.
                </div>
            `;
            
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Back to top button
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header scroll effect
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        });
    }

    // Parallax effect for hero section
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Initialize parallax
    initParallaxEffect();

    // Loading animation
    function showLoadingAnimation() {
        // Add loading class to body if needed
        document.body.classList.add('loading');
        
        // Remove loading class after content is loaded
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 1000);
    }

    // Image lazy loading
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading
    initLazyLoading();

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScroll = debounce(() => {
        // Any additional scroll handlers can be added here
    }, 10);

    window.addEventListener('scroll', debouncedScroll);
});
