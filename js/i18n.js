/**
 * Internationalization (i18n) Module
 * Handles multi-language support for EN, DE, RU
 */

class I18n {
    constructor() {
        this.currentLanguage = CONFIG.defaultLanguage;
        this.translations = {};
        this.supportedLanguages = ['en', 'de', 'ru'];
    }

    /**
     * Initialize i18n system
     */
    async init() {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }

        // Load translations for current language
        await this.loadTranslations(this.currentLanguage);
        
        // Update UI
        this.updatePageContent();
        this.updateLanguageButtons();
        
        // Setup language switcher listeners
        this.setupLanguageSwitchers();
    }

    /**
     * Load translation file for a specific language
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English if loading fails
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    /**
     * Get translation for a key
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return value || key;
    }

    /**
     * Change current language
     */
    async changeLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('preferred-language', lang);
        
        await this.loadTranslations(lang);
        this.updatePageContent();
        this.updateLanguageButtons();
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    /**
     * Update all translatable content on the page
     */
    updatePageContent() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });
    }

    /**
     * Update language button states
     */
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Setup language switcher event listeners
     */
    setupLanguageSwitchers() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
