document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initBurgerMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavigation();
});

// Burger Menu Toggle
function initBurgerMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                // Check for reduced motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (prefersReducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all sections immediately
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.add('visible');
        });
        // Disable hero animations
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        const nav = document.querySelector('.nav');
        
        if (heroTitle) heroTitle.style.animation = 'none';
        if (heroSubtitle) heroSubtitle.style.animation = 'none';
        if (heroButtons) heroButtons.style.animation = 'none';
        if (nav) nav.style.animation = 'none';
        
        return;
    }

    // Create Intersection Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add spring animation class for extra visual appeal
                if (!entry.target.classList.contains('spring-in')) {
                    entry.target.classList.add('spring-in');
                }
                
                // Unobserve the element after animation to improve performance
                setTimeout(() => {
                    sectionObserver.unobserve(entry.target);
                }, 500);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animate project cards individually
    const projectCards = document.querySelectorAll('.project-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation of cards
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        cardObserver.observe(card);
    });

    // Animate process steps
    const processSteps = document.querySelectorAll('.process-step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                
                stepObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
        step.style.transition = 'opacity 0.8s cubic-bezier(0.15, 1.1, 0.15, 1), transform 0.8s cubic-bezier(0.15, 1.1, 0.15, 1)';
        stepObserver.observe(step);
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

// Enhanced scroll behavior for navbar with parallax
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const nav = document.querySelector('.nav');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Add subtle parallax to background via CSS variable
        const parallaxSpeed = scrollTop * 0.1;
        document.documentElement.style.setProperty('--parallax-y', `${parallaxSpeed}px`);
        
        // Navbar hide/show logic
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// Mouse movement parallax for hero section
function initMouseParallax() {
    const hero = document.querySelector('.hero');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!hero || prefersReducedMotion) return;
    
    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;
        
        const heroTitle = hero.querySelector('.hero-title');
        const heroSubtitle = hero.querySelector('.hero-subtitle');
        
        if (heroTitle) {
            heroTitle.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        }
        if (heroSubtitle) {
            heroSubtitle.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
        }
    }, { passive: true });
    
    hero.addEventListener('mouseleave', function() {
        const heroTitle = hero.querySelector('.hero-title');
        const heroSubtitle = hero.querySelector('.hero-subtitle');
        
        if (heroTitle) {
            heroTitle.style.transform = 'translate(0, 0)';
        }
        if (heroSubtitle) {
            heroSubtitle.style.transform = 'translate(0, 0)';
        }
    });
}

// FAQ Accordion Enhancement
document.addEventListener('click', function(e) {
    if (e.target.matches('.faq-question') || e.target.closest('.faq-question')) {
        const faqItem = e.target.closest('.faq-item');
        const allFaqItems = document.querySelectorAll('.faq-item');
        
        // Close other FAQ items (optional - comment out for multiple open)
        // allFaqItems.forEach(item => {
        //     if (item !== faqItem && item.hasAttribute('open')) {
        //         item.removeAttribute('open');
        //     }
        // });
    }
});

// Form validation and interaction enhancements
function enhanceInteractivity() {
    // Add hover effects to clickable elements
    const clickableElements = document.querySelectorAll('.btn, .project-card, .service-item, .contact-item');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add ripple effect to buttons (iOS-style)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--c-tint) !important;
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: var(--c-tint);
        border-radius: 50%;
    }
    
    .nav {
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
`;
document.head.appendChild(style);

// Initialize enhanced interactivity
enhanceInteractivity();
initMouseParallax();
initAdvancedAnimations();

// Advanced animations
function initAdvancedAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Disable all advanced animations for reduced motion
        return;
    }
    
    // Stagger animation for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        link.style.animation = `slideInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${1 + index * 0.1}s forwards`;
    });
    
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function(e) {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
    });
    
    // Text reveal effect for section titles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.section-title');
                if (title && !title.classList.contains('revealed')) {
                    title.classList.add('revealed');
                    title.style.animation = 'heroTitleReveal 0.8s cubic-bezier(0.15, 1.1, 0.15, 1) forwards';
                }
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Re-initialize on resize if needed
        console.log('Window resized, reinitializing if necessary');
    }, 250);
});

// Error handling for external links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[target="_blank"]') || e.target.closest('a[target="_blank"]')) {
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        
        // Basic validation for external links
        if (!link.href || link.href === '#') {
            e.preventDefault();
            console.warn('Invalid external link clicked');
        }
    }
});

// Console log for debugging (remove in production)
console.log('Portfolio website initialized successfully');
console.log('Features loaded: Burger menu, smooth scroll, scroll animations, active navigation, parallax effects, micro-interactions');