/**
 * Main JavaScript file
 * Orchestrates all functionality of the personal website
 */

// Global instances
let i18n, themeManager, particlesAnimation, projectsManager;

const TASK_STORAGE_KEY = 'visitor-task-planner-items';
const taskPlannerState = {
    items: [],
    filter: 'all'
};

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

        // Setup hosted forms
        setupHostedForms();

        // Setup visitor task planner
        setupTaskPlanner();

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
 * Get translated text with fallback
 */
function translate(key, fallback) {
    if (!i18n || typeof i18n.t !== 'function') {
        return fallback;
    }

    const value = i18n.t(key);
    return value && value !== key ? value : fallback;
}

/**
 * Setup hosted forms
 */
function setupHostedForms() {
    document.querySelectorAll('form[data-ajax-endpoint]').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalContent = submitBtn.innerHTML;
            const sendingKey = form.dataset.sendingKey || 'common.loading';
            const successKey = form.dataset.successKey || 'contact.form.success';
            const errorKey = form.dataset.errorKey || 'contact.form.error';

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${translate(sendingKey, 'Sending...')}`;

                const formData = new FormData(form);
                const replyTo = formData.get('email');
                if (typeof replyTo === 'string' && replyTo.trim()) {
                    formData.set('_replyto', replyTo.trim());
                }

                formData.set('page_url', window.location.href);
                formData.set('language', i18n && typeof i18n.getCurrentLanguage === 'function' ? i18n.getCurrentLanguage() : 'en');

                const response = await fetch(form.dataset.ajaxEndpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const responseData = await response.json().catch(() => null);
                if (!response.ok || (responseData && responseData.success === 'false')) {
                    throw new Error(responseData && responseData.message ? responseData.message : 'Form submission failed');
                }

                showNotification(translate(successKey, 'Message sent successfully!'), 'success');
                form.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification(translate(errorKey, 'Failed to send message. Please try again.'), 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }
        });
    });
}

function setupTaskPlanner() {
    const form = document.getElementById('visitor-task-form');
    const list = document.getElementById('visitor-task-list');
    const emptyState = document.getElementById('visitor-task-empty');
    const clearCompletedBtn = document.getElementById('clear-completed-tasks');
    const filterButtons = document.querySelectorAll('.task-filter-btn');

    if (!form || !list || !emptyState || !clearCompletedBtn || !filterButtons.length) {
        return;
    }

    taskPlannerState.items = loadStoredTasks();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const titleInput = form.elements.namedItem('title');
        const priorityInput = form.elements.namedItem('priority');
        const deadlineInput = form.elements.namedItem('deadline');

        if (!(titleInput instanceof HTMLInputElement) || !(priorityInput instanceof HTMLSelectElement) || !(deadlineInput instanceof HTMLInputElement)) {
            return;
        }

        const title = titleInput.value.trim();
        if (!title) {
            titleInput.focus();
            return;
        }

        taskPlannerState.items.unshift({
            id: createTaskId(),
            title,
            priority: priorityInput.value,
            deadline: deadlineInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        });

        persistTasks();
        renderTaskPlanner();
        form.reset();
        priorityInput.value = 'medium';
        showNotification(translate('tasks.planner.added', 'Task added to your planner.'), 'success');
    });

    list.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target.closest('[data-task-action]') : null;
        if (!target) {
            return;
        }

        const taskId = target.getAttribute('data-task-id');
        const action = target.getAttribute('data-task-action');
        if (!taskId || !action) {
            return;
        }

        if (action === 'toggle') {
            taskPlannerState.items = taskPlannerState.items.map((item) => (
                item.id === taskId ? { ...item, completed: !item.completed } : item
            ));
        }

        if (action === 'delete') {
            taskPlannerState.items = taskPlannerState.items.filter((item) => item.id !== taskId);
        }

        persistTasks();
        renderTaskPlanner();
    });

    clearCompletedBtn.addEventListener('click', () => {
        taskPlannerState.items = taskPlannerState.items.filter((item) => !item.completed);
        persistTasks();
        renderTaskPlanner();
    });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            taskPlannerState.filter = button.dataset.filter || 'all';
            renderTaskPlanner();
        });
    });

    document.addEventListener('languageChanged', renderTaskPlanner);
    renderTaskPlanner();
}

function loadStoredTasks() {
    const rawValue = window.localStorage.getItem(TASK_STORAGE_KEY);
    if (!rawValue) {
        return [];
    }

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
            throw new TypeError('Stored tasks must be an array');
        }

        return parsed.filter(isValidTaskRecord);
    } catch (error) {
        console.error('Error loading visitor tasks:', error);
        window.localStorage.removeItem(TASK_STORAGE_KEY);
        return [];
    }
}

function isValidTaskRecord(item) {
    return Boolean(
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.priority === 'string' &&
        typeof item.deadline === 'string' &&
        typeof item.completed === 'boolean' &&
        typeof item.createdAt === 'string'
    );
}

function persistTasks() {
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskPlannerState.items));
}

function renderTaskPlanner() {
    const list = document.getElementById('visitor-task-list');
    const emptyState = document.getElementById('visitor-task-empty');
    const totalCount = document.getElementById('task-total-count');
    const openCount = document.getElementById('task-open-count');
    const doneCount = document.getElementById('task-done-count');
    const clearCompletedBtn = document.getElementById('clear-completed-tasks');

    if (!list || !emptyState || !totalCount || !openCount || !doneCount || !clearCompletedBtn) {
        return;
    }

    const filteredItems = getFilteredTasks();
    const completedTasks = taskPlannerState.items.filter((item) => item.completed).length;

    totalCount.textContent = String(taskPlannerState.items.length);
    openCount.textContent = String(taskPlannerState.items.length - completedTasks);
    doneCount.textContent = String(completedTasks);
    clearCompletedBtn.disabled = completedTasks === 0;

    document.querySelectorAll('.task-filter-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.filter === taskPlannerState.filter);
    });

    emptyState.hidden = filteredItems.length > 0;
    list.hidden = filteredItems.length === 0;
    list.innerHTML = filteredItems.map((item) => createTaskMarkup(item)).join('');
}

function getFilteredTasks() {
    if (taskPlannerState.filter === 'open') {
        return taskPlannerState.items.filter((item) => !item.completed);
    }

    if (taskPlannerState.filter === 'done') {
        return taskPlannerState.items.filter((item) => item.completed);
    }

    return taskPlannerState.items;
}

function createTaskMarkup(task) {
    const completedClass = task.completed ? ' is-completed' : '';
    const priorityLabel = translate(`tasks.priority.${task.priority}`, task.priority);
    const toggleLabel = task.completed
        ? translate('tasks.planner.actions.mark_open', 'Mark as open')
        : translate('tasks.planner.actions.mark_done', 'Mark as done');
    const deleteLabel = translate('tasks.planner.actions.delete', 'Delete task');
    const deadlineMarkup = task.deadline
        ? `<span class="visitor-task-deadline"><i class="fas fa-calendar-alt"></i> ${escapeHtml(translate('tasks.planner.deadline_prefix', 'Due'))}: ${escapeHtml(formatTaskDate(task.deadline))}</span>`
        : `<span class="visitor-task-deadline visitor-task-deadline-empty">${escapeHtml(translate('tasks.planner.no_deadline', 'No deadline'))}</span>`;

    return `
        <li class="visitor-task-item${completedClass}">
            <button type="button" class="visitor-task-toggle" data-task-action="toggle" data-task-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(toggleLabel)}">
                <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <div class="visitor-task-content">
                <div class="visitor-task-header">
                    <h4 class="visitor-task-title">${escapeHtml(task.title)}</h4>
                    <span class="visitor-task-priority priority-${escapeHtml(task.priority)}">${escapeHtml(priorityLabel)}</span>
                </div>
                <div class="visitor-task-meta">
                    ${deadlineMarkup}
                </div>
            </div>
            <button type="button" class="visitor-task-delete" data-task-action="delete" data-task-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(deleteLabel)}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </li>
    `;
}

function formatTaskDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const locale = i18n && typeof i18n.getCurrentLanguage === 'function'
        ? i18n.getCurrentLanguage()
        : 'en';

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }

    return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
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
    console.log(CONFIG.certifications); // Выведет массив в консоль
    const certificationsHTML = CONFIG.certifications.map(cert => `
        <div>
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
        i18n.updatePageContent();
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
