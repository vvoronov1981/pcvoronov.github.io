/**
 * Theme Module
 * Handles light/dark theme switching with smooth transitions
 */

class ThemeManager {
    constructor() {
        this.currentTheme = CONFIG.defaultTheme;
        this.themeToggle = null;
    }

    /**
     * Initialize theme system
     */
    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }

        // Apply theme
        this.applyTheme(this.currentTheme, false);

        // Setup theme toggle button
        this.setupThemeToggle();

        // Listen to system theme changes
        this.listenToSystemTheme();
    }

    /**
     * Apply theme to the page
     */
    applyTheme(theme, animate = true) {
        const root = document.documentElement;
        
        if (animate) {
            root.classList.add('theme-transitioning');
        }

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        this.currentTheme = theme;
        localStorage.setItem('preferred-theme', theme);

        // Update toggle button icon
        this.updateThemeToggleIcon();

        if (animate) {
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 300);
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme, true);
    }

    /**
     * Setup theme toggle button
     */
    setupThemeToggle() {
        this.themeToggle = document.getElementById('theme-toggle');
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * Update theme toggle button icon
     */
    updateThemeToggleIcon() {
        if (!this.themeToggle) return;

        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    /**
     * Listen to system theme changes
     */
    listenToSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addEventListener('change', (e) => {
                // Only apply if user hasn't manually set a preference
                if (!localStorage.getItem('preferred-theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme, true);
                }
            });
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme, true);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
