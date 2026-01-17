/**
 * Configuration file for the personal website
 * Contains all personal information and site settings
 */

const CONFIG = {
    // Personal Information
    name: 'Volodymyr Voronov',
    role: 'Frontend Developer',
    location: 'Germany',
    email: 'voronov.voldymyr@gmail.com',
    
    // Social Links
    github: 'vvoronov1981',
    linkedin: 'volodymyr-voronov-224480236',
    
    // Professional Details
    experience: 10,
    
    // Site Settings
    defaultLanguage: 'en',
    defaultTheme: 'light',
    
    // API Configuration
    githubApiUrl: 'https://api.github.com',
    
    // Particles Configuration
    particlesConfig: {
        count: 100,
        speed: 0.5,
        color: '#6366f1'
    },
    
    // Statistics
    stats: {
        yearsExperience: 10,
        projectsCompleted: 50,
        happyClients: 30
    },
    
    // Skills
    skills: {
        frontend: [
            { name: 'React', level: 95 },
            { name: 'TypeScript', level: 90 },
            { name: 'JavaScript (ES6+)', level: 95 },
            { name: 'HTML5/CSS3', level: 95 },
            { name: 'Vue.js', level: 80 },
            { name: 'Next.js', level: 85 }
        ],
        backend: [
            { name: 'Node.js', level: 85 },
            { name: 'Express', level: 80 },
            { name: 'MongoDB', level: 75 },
            { name: 'REST API', level: 90 },
            { name: 'GraphQL', level: 75 }
        ],
        tools: [
            { name: 'Git', level: 90 },
            { name: 'Webpack', level: 85 },
            { name: 'Docker', level: 70 },
            { name: 'Figma', level: 80 },
            { name: 'Jest', level: 85 }
        ]
    },
    
    // Experience Timeline
    experience_timeline: [
        {
            position: 'Senior Frontend Developer',
            company: 'Tech Company',
            location: 'Remote',
            period: '2020 - Present',
            description: 'Led frontend development for enterprise applications using React and TypeScript.',
            technologies: ['React', 'TypeScript', 'Redux', 'Next.js']
        },
        {
            position: 'Frontend Developer',
            company: 'Digital Agency',
            location: 'Germany',
            period: '2017 - 2020',
            description: 'Developed responsive web applications and implemented modern UI/UX designs.',
            technologies: ['JavaScript', 'Vue.js', 'SASS', 'Webpack']
        },
        {
            position: 'Web Developer',
            company: 'Startup',
            location: 'Remote',
            period: '2014 - 2017',
            description: 'Built full-stack web applications and maintained legacy systems.',
            technologies: ['HTML', 'CSS', 'jQuery', 'PHP']
        }
    ],
    
    // Certifications
    certifications: [
        {
            name: 'Responsive Web Design',
            issuer: 'FreeCodeCamp',
            image: 'certificates/webDesign.jpg'
        },
        {
            name: 'Foundational C# with Microsoft',
            issuer: 'Microsoft',
            image: 'certificates/c#.jpg'
        },
        {
            name: 'JavaScript Algorithms and Data Structures',
            issuer: 'FreeCodeCamp',
            image: 'certificates/JavaScript.jpg'
        },
        {
            name: 'Front End Development Libraries',
            issuer: 'FreeCodeCamp',
            image: 'certificates/FrontEndDevelopment.jpg'
        },
        {
            name: 'Data Visualization',
            issuer: 'FreeCodeCamp',
            image: 'certificates/DataVisualization.jpg'
        },
        {
            name: 'Scientific Computing with Python',
            issuer: 'FreeCodeCamp',
            image: 'certificates/Python.jpg'
        }
    ],
    
    // Financial Services
    financialServices: [
        {
            icon: 'fa-chart-line',
            titleKey: 'services.investment.title',
            descriptionKey: 'services.investment.description',
            features: [
                'services.investment.feature1',
                'services.investment.feature2',
                'services.investment.feature3',
                'services.investment.feature4'
            ]
        },
        {
            icon: 'fa-piggy-bank',
            titleKey: 'services.savings.title',
            descriptionKey: 'services.savings.description',
            features: [
                'services.savings.feature1',
                'services.savings.feature2',
                'services.savings.feature3',
                'services.savings.feature4'
            ]
        },
        {
            icon: 'fa-shield-alt',
            titleKey: 'services.insurance.title',
            descriptionKey: 'services.insurance.description',
            features: [
                'services.insurance.feature1',
                'services.insurance.feature2',
                'services.insurance.feature3',
                'services.insurance.feature4'
            ]
        },
        {
            icon: 'fa-home',
            titleKey: 'services.realestate.title',
            descriptionKey: 'services.realestate.description',
            features: [
                'services.realestate.feature1',
                'services.realestate.feature2',
                'services.realestate.feature3',
                'services.realestate.feature4'
            ]
        },
        {
            icon: 'fa-graduation-cap',
            titleKey: 'services.retirement.title',
            descriptionKey: 'services.retirement.description',
            features: [
                'services.retirement.feature1',
                'services.retirement.feature2',
                'services.retirement.feature3',
                'services.retirement.feature4'
            ]
        },
        {
            icon: 'fa-balance-scale',
            titleKey: 'services.tax.title',
            descriptionKey: 'services.tax.description',
            features: [
                'services.tax.feature1',
                'services.tax.feature2',
                'services.tax.feature3',
                'services.tax.feature4'
            ]
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}