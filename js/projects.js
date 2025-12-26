/**
 * Projects Module
 * Loads and displays projects from GitHub API
 */

class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.projectsContainer = null;
        this.filterButtons = null;
        this.isLoading = false;
    }

    /**
     * Initialize projects system
     */
    async init() {
        this.projectsContainer = document.getElementById('projects-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        if (!this.projectsContainer) {
            console.warn('Projects container not found');
            return;
        }

        // Setup filter buttons
        this.setupFilters();

        // Load projects
        await this.loadProjects();
    }

    /**
     * Load projects from GitHub API
     */
    async loadProjects() {
        this.isLoading = true;
        this.showLoading();

        try {
            // Fetch user's repositories
            const response = await fetch(
                `${CONFIG.githubApiUrl}/users/${CONFIG.github}/repos?sort=updated&per_page=100`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const repos = await response.json();

            // Filter and map repositories to project objects
            this.projects = repos
                .filter(repo => !repo.fork && !repo.private)
                .map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description || 'No description available',
                    url: repo.html_url,
                    homepage: repo.homepage,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    topics: repo.topics || [],
                    updated: new Date(repo.updated_at)
                }))
                .sort((a, b) => b.updated - a.updated)
                .slice(0, 12); // Show top 12 projects

            this.filteredProjects = [...this.projects];
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Setup filter buttons
     */
    setupFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
                
                // Update active button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Set current filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => {
                const lang = (project.language || '').toLowerCase();
                const topics = project.topics.map(t => t.toLowerCase());
                
                switch (filter) {
                    case 'react':
                        return lang === 'javascript' && topics.includes('react');
                    case 'typescript':
                        return lang === 'typescript';
                    case 'fullstack':
                        return topics.includes('fullstack') || topics.includes('full-stack');
                    default:
                        return true;
                }
            });
        }

        this.renderProjects();
    }

    /**
     * Render projects to the page
     */
    renderProjects() {
        if (!this.projectsContainer) return;

        if (this.filteredProjects.length === 0) {
            this.projectsContainer.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects found for this filter.</p>
                </div>
            `;
            return;
        }

        const projectsHTML = this.filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');

        this.projectsContainer.innerHTML = projectsHTML;

        // Add animation class with delay
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 50);
            });
        }, 100);
    }

    /**
     * Create HTML for a project card
     */
    createProjectCard(project) {
        const languageColors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#3178c6',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C#': '#178600',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8'
        };

        const languageColor = languageColors[project.language] || '#6c757d';

        return `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="fas fa-folder"></i>
                    </div>
                    <div class="project-links">
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" 
                           title="View on GitHub" class="project-link">
                            <i class="fab fa-github"></i>
                        </a>
                        ${project.homepage ? `
                            <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" 
                               title="Live Demo" class="project-link">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${this.escapeHtml(project.name)}</h3>
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                </div>
                <div class="project-footer">
                    ${project.language ? `
                        <span class="project-language">
                            <span class="language-dot" style="background-color: ${languageColor}"></span>
                            ${project.language}
                        </span>
                    ` : ''}
                    ${project.stars > 0 ? `
                        <span class="project-stats">
                            <i class="fas fa-star"></i>
                            ${project.stars}
                        </span>
                    ` : ''}
                    ${project.forks > 0 ? `
                        <span class="project-stats">
                            <i class="fas fa-code-branch"></i>
                            ${project.forks}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = `
            <div class="projects-loading">
                <div class="spinner"></div>
                <p data-i18n="projects.loading">Loading projects from GitHub...</p>
            </div>
        `;
    }

    /**
     * Show error state
     */
    showError() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = `
            <div class="projects-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get all projects
     */
    getProjects() {
        return this.projects;
    }

    /**
     * Get filtered projects
     */
    getFilteredProjects() {
        return this.filteredProjects;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsManager;
}
