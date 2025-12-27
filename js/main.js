/**
 * Main JavaScript file
 * Orchestrates all functionality of the personal website
 */

// Global instances
let i18n, themeManager, particlesAnimation, projectsManager;

/**
 * Initialize the application
 */
async function init() {
    // Show loading screen
    showLoadingScreen();

    try {
        // Initialize theme manager
        themeManager = new ThemeManager();
        themeManager.init();

        // Initialize i18n
        i18n = new I18n();
        await i18n.init();

        // Initialize particles animation
        particlesAnimation = new ParticlesAnimation('particles-canvas');

        // Initialize projects manager
        projectsManager = new ProjectsManager();
        await projectsManager.init();

        // Setup navigation
        setupNavigation();

        // Setup smooth scroll
        setupSmoothScroll();

        // Setup scroll animations
        setupScrollAnimations();

        // Setup back to top button
        setupBackToTop();

        // Setup typing effect
        setupTypingEffect();

        // Setup stats counter
        setupStatsCounter();

        // Setup contact form
        setupContactForm();

        // Setup mobile menu
        setupMobileMenu();

        // Populate experience timeline
        populateExperience();

        // Populate skills
        populateSkills();

        // Populate certifications
        populateCertifications();

        // Populate services
        populateServices();

        // Update copyright year
        updateCopyrightYear();

        // Hide loading screen
        hideLoadingScreen();
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoadingScreen();
    }
}

/**
 * Setup navigation
 */
function setupNavigation() {
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active navigation link
        updateActiveNavLink(sections, navLinks);
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink(sections, navLinks) {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Setup smooth scrolling
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#' or empty
            if (!href || href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offset = 80; // Navigation height
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navCollapse = document.querySelector('.nav-collapse');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    navCollapse.classList.remove('show');
                }
            }
        });
    });
}

/**
 * Setup scroll animations using Intersection Observer
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Setup typing effect for hero section
 */
function setupTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.visibility = 'visible';

    let i = 0;
    const speed = 100; // Typing speed in milliseconds

    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

/**
 * Setup animated stats counter
 */
function setupStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // Animation duration in milliseconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Setup contact form
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + i18n.t('contact.form.sending');

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Here you would normally send the data to a server
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showNotification(i18n.t('contact.form.success'), 'success');
            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification(i18n.t('contact.form.error'), 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Setup mobile menu
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navCollapse = document.querySelector('.nav-collapse');

    if (!menuToggle || !navCollapse) return;

    menuToggle.addEventListener('click', () => {
        navCollapse.classList.toggle('show');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navCollapse.contains(e.target)) {
            navCollapse.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
}

/**
 * Populate experience timeline
 */
function populateExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;

    const experienceHTML = CONFIG.experience_timeline.map((exp, index) => `
        <div class="timeline-item animate-on-scroll" style="animation-delay: ${index * 0.2}s">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${exp.period}</div>
                <h3 class="timeline-title">${exp.position}</h3>
                <h4 class="timeline-company">${exp.company} - ${exp.location}</h4>
                <p class="timeline-description">${exp.description}</p>
                <div class="timeline-tags">
                    ${exp.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    timeline.innerHTML = experienceHTML;
}

/**
 * Populate skills section
 */
function populateSkills() {
    populateSkillCategory('frontend', CONFIG.skills.frontend);
    populateSkillCategory('backend', CONFIG.skills.backend);
    populateSkillCategory('tools', CONFIG.skills.tools);
}

/**
 * Populate a skill category
 */
function populateSkillCategory(category, skills) {
    const container = document.getElementById(`${category}-skills`);
    if (!container) return;

    const skillsHTML = skills.map(skill => `
        <div class="skill-item animate-on-scroll">
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%" data-level="${skill.level}"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = skillsHTML;
}

/**
 * Populate certifications
 */
function populateCertifications() {
    const container = document.getElementById('certifications');
    if (!container) return;

    const certificationsHTML = CONFIG.certifications.map(cert => `
        <div class="certification-card animate-on-scroll">
            <img src="${cert.image}" alt="${cert.name}" class="certification-image">
            <div class="certification-info">
                <h4>${cert.name}</h4>
                <p>${cert.issuer}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = certificationsHTML;
}

/**
 * Populate financial services section
 */
function populateServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    const servicesHTML = CONFIG.financialServices.map((service, index) => `
        <div class="service-card animate-on-scroll" style="animation-delay: ${index * 0.1}s">
            <div class="service-icon">
                <i class="fas ${service.icon}"></i>
            </div>
            <h3 class="service-title" data-i18n="${service.titleKey}"></h3>
            <p class="service-description" data-i18n="${service.descriptionKey}"></p>
            <ul class="service-features">
                ${service.features.map(feature => `
                    <li class="service-feature" data-i18n="${feature}"></li>
                `).join('')}
            </ul>
            <button class="service-cta" onclick="scrollToContact()">
                <i class="fas fa-calendar-check"></i>
                <span data-i18n="services.cta">Get Consultation</span>
            </button>
        </div>
    `).join('');

    container.innerHTML = servicesHTML;

    // Re-translate the newly added elements
    if (i18n) {
        i18n.translatePage();
    }
}

/**
 * Scroll to contact section
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const offset = 80;
        const targetPosition = contactSection.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
    }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 500);
    }
}

/**
 * Update copyright year dynamically
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Debounce function for performance optimization
 */
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

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, i18n, themeManager, particlesAnimation, projectsManager };
}
