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
            image: 'responsive_web_design.png'
        },
        {
            name: 'Foundational C# with Microsoft',
            issuer: 'Microsoft',
            image: 'foundational_csharp_with_Microsoft.png'
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
